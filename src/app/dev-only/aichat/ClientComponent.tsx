'use client';

import MarkdownPreview from '@/components/advanced/MarkdownPreview';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Textarea } from '@/components/ui/textarea';
import type { ChatHistory } from '@/lib/ai';
import { fetchEventSource } from '@/lib/fetchEventSource';
import { scrollToBottom } from '@/lib/visual';
import { HelpCircle } from 'lucide-react';
import Head from 'next/head';
import React, { useRef } from 'react';
import { useImmer } from 'use-immer';

export default function ClientComponent() {
  const refChatLogsBox = useRef(null);
  const [value, setValue] = useImmer({
    prompt: '',
    stream: true,
    history: [] as ChatHistory,
    fetching: false,
  });
  const canSend = !value.fetching && value.prompt.trim().length > 0;
  const send = () => {
    if (value.fetching) return;
    const scrollChatLogs = () => {
      requestAnimationFrame(() => {
        scrollToBottom(refChatLogsBox.current!);
      });
    };
    if (value.stream) {
      fetchEventSource('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: value.prompt,
          history: value.history,
          stream: value.stream,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        onmessage: (ev) => {
          const { data } = ev;
          const { totalText, error } = JSON.parse(data);
          if (error) {
            console.error(error);
          } else {
            setValue((draft) => {
              const lastChatLog = draft.history[draft.history.length - 1];
              lastChatLog.model = totalText;
            });
            scrollChatLogs();
          }
        },
        onerror: console.error,
        onclose: () => {
          setValue((draft) => {
            draft.fetching = false;
          });
        },
      });
      setValue((draft) => {
        draft.fetching = true;
        draft.history.push({
          user: value.prompt,
          model: 'AI is thinking...',
        });
        draft.prompt = '';
      });
      scrollChatLogs();
    } else {
      fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: value.prompt,
          history: value.history,
          stream: value.stream,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setValue((draft) => {
            const lastChatLog = draft.history[draft.history.length - 1];
            lastChatLog.model = json.result;
          });
          scrollChatLogs();
        })
        .finally(() => {
          setValue((draft) => {
            draft.fetching = false;
          });
        });
      setValue((draft) => {
        draft.fetching = true;
        draft.history.push({
          user: value.prompt,
          model: 'AI is thinking...',
        });
        draft.prompt = '';
      });
      scrollChatLogs();
    }
  };
  return (
    <>
      <Head>
        <title>AI Chat</title>
      </Head>
      <main className="flex flex-col gap-4 w-[560px]">
        <div
          ref={refChatLogsBox}
          className="max-h-[600px] overflow-auto flex flex-col gap-6"
        >
          {value.history.map((chatLog, index) => (
            <React.Fragment key={index}>
              <MarkdownPreview className="text-amber-700">
                {chatLog.user}
              </MarkdownPreview>
              <MarkdownPreview className="text-gray-600">
                {chatLog.model}
              </MarkdownPreview>
            </React.Fragment>
          ))}
        </div>
        <Textarea
          autoFocus
          placeholder="Ask me anything..."
          rows={4}
          className="resize-none "
          value={value.prompt}
          onChange={(e) => {
            setValue((draft) => {
              draft.prompt = e.target.value;
            });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (canSend) {
                send();
              }
            }
          }}
        />
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 ">
              <Checkbox
                id="stream-output"
                checked={value.stream}
                onCheckedChange={(checked) => {
                  setValue((draft) => {
                    draft.stream = !!checked;
                  });
                }}
              />
              <label htmlFor="stream-output">Stream Output</label>
            </div>
            <HoverCard>
              <HoverCardTrigger>
                <HelpCircle className="w-4 text-gray-500 cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="text-sm">
                <p className="font-bold">ENV variables are requierd</p>
                <p>OPENAI_API_KEY</p>
                <p>OPENAI_BASE_URL</p>
                <p>OPENAI_MODEL</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Button
            disabled={!canSend}
            onClick={send}
            variant={'ringHover'}
            className="w-[200px] mt-8"
          >
            Send
          </Button>
        </div>
      </main>
    </>
  );
}
