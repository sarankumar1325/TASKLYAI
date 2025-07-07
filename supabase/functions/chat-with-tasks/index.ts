import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for Gemini API responses (simple in-memory cache)
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRateLimit = rateLimitMap.get(userId);
  
  if (!userRateLimit || now > userRateLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (userRateLimit.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  userRateLimit.count++;
  return false;
}

function getCachedResponse(cacheKey: string): string | null {
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  return null;
}

function setCachedResponse(cacheKey: string, response: string): void {
  responseCache.set(cacheKey, { response, timestamp: Date.now() });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Message and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limiting
    if (isRateLimited(userId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cacheKey = `${userId}:${message.toLowerCase().trim()}`;
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return new Response(
        JSON.stringify({ response: cachedResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's tasks with optimized query
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('title, description, priority, status, due_date, tags')
      .eq('user_id', userId)
      .not('is_archived', 'eq', true)
      .order('created_at', { ascending: false })
      .limit(50); // Limit to recent tasks for better performance

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tasks' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare context about user's tasks (optimized)
    const tasksContext = tasks?.map(task => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
      tags: task.tags
    })) || [];

    const contextString = JSON.stringify(tasksContext, null, 2);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Gemini API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are TaskFlowAI, an intelligent assistant that helps users manage their tasks. You have access to the user's current tasks and can provide insights, suggestions, and help with task management.

Here are the user's current tasks:
${contextString}

User's question: ${message}

Please provide a helpful response based on the user's tasks and question. Be conversational and focus on helping them be more productive. Keep responses concise and actionable.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to get AI response' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const geminiData = await geminiResponse.json();
      const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      // Cache the response
      setCachedResponse(cacheKey, aiResponse);

      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Request timeout. Please try again.' }),
          { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error in chat-with-tasks function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
