import { guard } from 'radashi';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { zodSafeType, zodSafeBoolean } from '@/lib/zod';
import { authCheck } from '../../authCheck';
import { ChatMessagesSchema } from '@/lib/ai/text/defines';
import { getTextGenerateService } from '@/lib/ai/text';
export const maxDuration = 60; // for vercel hosting

export async function POST(req: NextRequest) {
  const authRes = await authCheck(req);
  if (authRes) {
    return authRes;
  }
  const body = await guard(() => req.json());
  const parsedBody = z
    .object({
      prompt: z.string().min(1),
      chatHistory: zodSafeType(ChatMessagesSchema, []),
      stream: zodSafeBoolean(),
    })
    .safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.message },
      { status: 400 }
    );
  }

  const { prompt, chatHistory, stream } = parsedBody.data;

  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  const aiChatService = await getTextGenerateService();

  if (stream) {
    const outputStream = new TransformStream();
    const writer = outputStream.writable.getWriter();
    aiChatService
      .generateTextStream({
        prompt,
        chatHistory,
        onUpdate: async (completeText, chunkText) => {
          await writer.write(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ completeText, chunkText })}\n\n`
            )
          );
        },
      })
      .then(() => {
        writer.close();
      })
      .catch(async (error) => {
        console.error('Error in generateOpenaiContentStream:', error);
        await writer.write(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`
          )
        );
        writer.close();
      });

    return new NextResponse(outputStream.readable, { headers });
  } else {
    try {
      const result = await aiChatService.generateTextStream({
        prompt,
        chatHistory,
      });
      return NextResponse.json({ result });
    } catch (error) {
      console.error('Error in generateOpenaiContent', error);
      return NextResponse.json({ error: 'An error occurred' });
    }
  }
}
