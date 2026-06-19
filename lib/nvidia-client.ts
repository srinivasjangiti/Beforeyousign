/**
 * NVIDIA NIM API Client
 *
 * Centralised OpenAI-compatible client for all NVIDIA NIM AI calls.
 * Docs: https://docs.api.nvidia.com
 *
 * All AI calls in the app go through this module so the key and base URL
 * are configured in one place and are NEVER exposed to the browser.
 */

import OpenAI from 'openai';

// ---------------------------------------------------------------------------
// Model catalogue
// ---------------------------------------------------------------------------
export const NVIDIA_MODELS = {
  /** Primary model – ultimate reasoning and highest capability context support */
  primary: 'meta/llama-3.3-70b-instruct',
  /** Fallback – newest 70B model, extremely high quality and faster */
  fallback: 'meta/llama-3.1-70b-instruct',
  /** Lightweight – for quick tasks */
  fast: 'meta/llama-3.1-8b-instruct',
} as const;

const DEFAULT_NVIDIA_TIMEOUT_MS = Number.parseInt(
  process.env.NVIDIA_REQUEST_TIMEOUT_MS || '45000',
  10
);

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------
export function createNvidiaClient(): OpenAI {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY environment variable is not set.');
  }
  return new OpenAI({
    apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate text from a single user prompt.
 * Returns the raw response string.
 */
export async function generateText(
  prompt: string,
  model: string = NVIDIA_MODELS.primary,
  temperature = 0.7,
  maxTokens = 4096,
  timeoutMs = DEFAULT_NVIDIA_TIMEOUT_MS,
): Promise<string> {
  const client = createNvidiaClient();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let completion;
  try {
    completion = await client.chat.completions.create(
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      },
      {
        signal: controller.signal,
      }
    );
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`NVIDIA request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  return completion.choices[0]?.message?.content ?? '';
}

/**
 * Generate text with a system prompt.
 */
export async function generateWithSystem(
  systemPrompt: string,
  userPrompt: string,
  model: string = NVIDIA_MODELS.primary,
  temperature = 0.7,
  maxTokens = 4096,
): Promise<string> {
  const client = createNvidiaClient();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content ?? '';
}

/**
 * Attempt to repair a truncated JSON string by closing any unclosed
 * strings / arrays / objects. Returns the repaired string (best-effort).
 */
function repairTruncatedJson(text: string): string {
  let result = text.trimEnd();

  // Remove a trailing comma that would make the JSON invalid
  result = result.replace(/,\s*$/, '');

  // Walk the string tracking state so we know what's open
  let inString = false;
  let escape = false;
  const stack: string[] = [];

  for (const char of result) {
    if (escape) { escape = false; continue; }
    if (char === '\\' && inString) { escape = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (!inString) {
      if (char === '{' || char === '[') stack.push(char);
      else if (char === '}' || char === ']') stack.pop();
    }
  }

  // Close an unterminated string value
  if (inString) result += '"';

  // Remove any trailing comma that appeared just before the close
  result = result.replace(/,(\s*)$/, '$1');

  // Close remaining open structures in reverse order
  while (stack.length > 0) {
    const open = stack.pop();
    result += open === '{' ? '}' : ']';
  }

  return result;
}

/**
 * Parse JSON from an AI response, stripping markdown code fences if present.
 * Falls back to best-effort JSON repair when the response was truncated.
 */
export function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonText = (jsonMatch ? jsonMatch[1] : text).trim();

  // First attempt — clean parse
  try {
    return JSON.parse(jsonText) as T;
  } catch {
    // Second attempt — repair truncated JSON then parse
    try {
      return JSON.parse(repairTruncatedJson(jsonText)) as T;
    } catch (repairErr) {
      throw new Error(
        `Failed to parse AI response as JSON: ${repairErr instanceof Error ? repairErr.message : String(repairErr)}`
      );
    }
  }
}
