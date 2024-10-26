// https://platform.openai.com/docs/quickstart
import OpenAI from 'openai';
import { z } from 'zod';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export const ChatHistorySchema = z.array(
  z.object({
    user: z.string(),
    model: z.string(),
  })
);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
export type GenerateContent = (
  prompt: string,
  history?: ChatHistory
) => Promise<string>;
export type GenerateContentStream = (
  prompt: string,
  history: ChatHistory | undefined,
  onUpdate: (totalText: string, chunkText: string) => void
) => Promise<string>;

function getChatModel() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
  return openai;
}

export const generateOpenaiContent: GenerateContent = async (
  prompt: string,
  history: ChatHistory = []
) => {
  const openai = getChatModel();
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...historyTostartChatParams(history),
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  return completion.choices[0]!.message.content!;
};

export const generateOpenaiContentStream: GenerateContentStream = async (
  prompt: string,
  history: ChatHistory = [],
  onUpdate: (totalText: string, chunkText: string) => void
) => {
  const openai = getChatModel();
  const stream = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    stream: true,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...historyTostartChatParams(history),
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  let str = '';
  for await (const chunk of stream) {
    const chunkText = chunk.choices[0]?.delta?.content || '';
    str += chunkText;
    onUpdate(str, chunkText);
  }
  return str;
};

function historyTostartChatParams(
  history: ChatHistory
): ChatCompletionMessageParam[] {
  const historyFixed: {
    role: 'user' | 'assistant';
    content: string;
  }[] = [];
  history.forEach((h) => {
    historyFixed.push({
      role: 'user',
      content: h.user,
    });
    historyFixed.push({
      role: 'assistant',
      content: h.model,
    });
  });
  return historyFixed;
}
