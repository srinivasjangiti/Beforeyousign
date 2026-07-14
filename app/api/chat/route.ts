import { NextRequest, NextResponse } from 'next/server';
import { generateWithSystem } from '@/lib/nvidia-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message || !context) {
      return NextResponse.json(
        { success: false, error: 'Message and context are required' },
        { status: 400 }
      );
    }

    // Build the system prompt dynamically based on the provided context
    let systemPrompt = `You are a highly knowledgeable and professional legal AI assistant.
Your goal is to answer questions about the provided contract accurately and concisely.

GUIDELINES:
1. Base your answer ONLY on the provided context.
2. If the contract does not contain the answer, explicitly state that it is not covered.
3. Do not invent or hallucinate clauses.
4. Keep your responses clear, professional, and formatted in markdown.
5. Use bullet points or bold text where helpful for readability.
6. Provide specific section or clause references if possible.
`;

    // Add raw text context (From ContractChat.tsx)
    if (context.contractText) {
      systemPrompt += `\n\n--- RAW CONTRACT TEXT ---\n${context.contractText}\n-------------------------\n`;
    }

    // Add structured analysis context (From AnalysisResult.tsx)
    if (context.clauses && Array.isArray(context.clauses)) {
      systemPrompt += `\n\n--- CONTRACT ANALYSIS OVERVIEW ---\n`;
      if (context.summary) systemPrompt += `Summary: ${context.summary}\n`;
      if (context.riskScore) systemPrompt += `Overall Risk Score: ${context.riskScore}/100\n`;
      
      if (context.redFlags && context.redFlags.length > 0) {
        systemPrompt += `\nRed Flags:\n`;
        context.redFlags.forEach((flag: any) => {
          systemPrompt += `- [${flag.severity.toUpperCase()}] ${flag.title}\n`;
        });
      }

      systemPrompt += `\nKey Clauses:\n`;
      context.clauses.forEach((clause: any) => {
        systemPrompt += `- ${clause.title} (Risk: ${clause.riskLevel})\n  Meaning: ${clause.plainLanguage}\n`;
      });
      systemPrompt += `----------------------------------\n`;
    }

    const responseText = await generateWithSystem(
      systemPrompt,
      message,
      undefined, // Use primary model
      0.5, // Slightly lower temperature for factual answers
      1500
    );

    return NextResponse.json({
      success: true,
      response: responseText,
    });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate chat response' },
      { status: 500 }
    );
  }
}
