import Groq from 'groq-sdk';
import { Task } from '@/types/task';

// Initialize Groq client with API key
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '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',
  dangerouslyAllowBrowser: true // Allow browser usage
});

// Cache for responses (simple in-memory cache)
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

export interface ChatResponse {
  response: string;
  taskStats?: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    due_today: number;
  };
}

export async function chatWithTasks(
  message: string, 
  userId: string, 
  tasks: Task[]
): Promise<ChatResponse> {
  // Check rate limiting
  if (isRateLimited(userId)) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Check cache first
  const cacheKey = `${userId}:${message.toLowerCase().trim()}`;
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    return { response: cachedResponse };
  }

  // Calculate task statistics
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < today;
    }).length,
    due_today: tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      const dueDate = new Date(t.due_date);
      return dueDate >= today && dueDate < tomorrow;
    }).length
  };

  // Prepare context about user's tasks (optimized for token usage)
  const tasksContext = tasks.slice(0, 50).map(task => ({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    due_date: task.due_date,
    tags: task.tags,
    is_important: task.is_important
  }));

  const contextString = JSON.stringify(tasksContext, null, 2);

  try {
    // Call Groq API with the llama-3.3-70b-versatile model (best for this use case)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are TaskFlowAI, an intelligent personal assistant that helps users manage their tasks and improve productivity. You have access to the user's current tasks and can provide insights, suggestions, and help with task management.

Key capabilities:
- Analyze task patterns and productivity
- Provide actionable recommendations
- Help with task prioritization
- Offer motivation and productivity tips
- Answer questions about specific tasks
- Generate insights from task data

Response guidelines:
- Be conversational and encouraging
- Focus on helping users be more productive
- Provide specific, actionable advice
- Use markdown formatting for better readability
- Keep responses concise but comprehensive
- Include relevant task statistics when helpful

Current task statistics:
- Total tasks: ${taskStats.total}
- Pending: ${taskStats.pending}
- Completed: ${taskStats.completed}
- Overdue: ${taskStats.overdue}
- Due today: ${taskStats.due_today}

User's current tasks:
${contextString}`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile", // Best model for this use case
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.95,
      stream: false,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Cache the response
    setCachedResponse(cacheKey, aiResponse);

    return {
      response: aiResponse,
      taskStats
    };

  } catch (error) {
    console.error('Error calling Groq API:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Please try again in a moment.');
      }
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      }
    }
    
    throw new Error('Failed to get AI response. Please try again.');
  }
}

// Enhanced chat function with streaming support (for future use)
export async function chatWithTasksStream(
  message: string,
  userId: string,
  tasks: Task[],
  onChunk: (chunk: string) => void
): Promise<void> {
  // Check rate limiting
  if (isRateLimited(userId)) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Calculate task statistics
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < today;
    }).length,
    due_today: tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      const dueDate = new Date(t.due_date);
      return dueDate >= today && dueDate < tomorrow;
    }).length
  };

  // Prepare context about user's tasks
  const tasksContext = tasks.slice(0, 50).map(task => ({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    due_date: task.due_date,
    tags: task.tags,
    is_important: task.is_important
  }));

  const contextString = JSON.stringify(tasksContext, null, 2);

  try {
    // Call Groq API with streaming
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are TaskFlowAI, an intelligent personal assistant that helps users manage their tasks and improve productivity. You have access to the user's current tasks and can provide insights, suggestions, and help with task management.

Current task statistics:
- Total tasks: ${taskStats.total}
- Pending: ${taskStats.pending}
- Completed: ${taskStats.completed}
- Overdue: ${taskStats.overdue}
- Due today: ${taskStats.due_today}

User's current tasks:
${contextString}`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.95,
      stream: true,
    });

    // Process the stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }

  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
} 