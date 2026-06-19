/**
 * Supabase Helper Functions
 * Common database operations and utilities
 */

import { createClient } from './server';
import { Database } from './types';

type Contract = Database['public']['Tables']['contracts']['Row'];
type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
  userId: string,
  updates: Partial<UserProfile>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      ...updates,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's contracts
 */
export async function getUserContracts(
  userId: string,
  options?: {
    status?: Contract['status'];
    limit?: number;
    offset?: number;
  }
) {
  const supabase = await createClient();

  let query = supabase
    .from('contracts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Create a new contract
 */
export async function createContract(contract: ContractInsert) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contracts')
    .insert(contract)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a contract
 */
export async function updateContract(
  contractId: string,
  updates: Database['public']['Tables']['contracts']['Update']
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contracts')
    .update(updates)
    .eq('id', contractId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a contract
 */
export async function deleteContract(contractId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', contractId);

  if (error) throw error;
  return true;
}

/**
 * Search contracts by text
 */
export async function searchContracts(
  userId: string,
  searchTerm: string,
  limit = 20
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', userId)
    .textSearch('search_vector', searchTerm)
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get contract by ID
 */
export async function getContractById(contractId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', contractId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save chat message
 */
export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: {
    model?: string;
    tokensUsed?: number;
    confidence?: number;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      model: metadata?.model,
      tokens_used: metadata?.tokensUsed,
      confidence: metadata?.confidence,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create chat session
 */
export async function createChatSession(
  userId: string,
  contractId?: string,
  title?: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      contract_id: contractId,
      title: title || 'New Chat',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get chat session with messages
 */
export async function getChatSession(sessionId: string) {
  const supabase = await createClient();

  const [sessionResult, messagesResult] = await Promise.all([
    supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single(),
    supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true }),
  ]);

  if (sessionResult.error) throw sessionResult.error;
  if (messagesResult.error) throw messagesResult.error;

  return {
    session: sessionResult.data,
    messages: messagesResult.data,
  };
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadContractFile(
  userId: string,
  file: File
): Promise<string> {
  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('contracts')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('contracts')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Log user activity
 */
export async function logUserActivity(
  userId: string,
  action: string,
  resourceType?: string,
  resourceId?: string,
  metadata?: Record<string, any>
) {
  const supabase = await createClient();

  await supabase.from('user_activity').insert({
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    metadata: metadata || {},
  });
}

/**
 * Create notification
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string,
  metadata?: Record<string, any>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl,
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly = false,
  limit = 50
) {
  const supabase = await createClient();

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) throw error;
  return true;
}
