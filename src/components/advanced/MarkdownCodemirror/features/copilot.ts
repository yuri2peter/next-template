import { inlineCopilot } from 'codemirror-copilot';

export function copilot() {
  return inlineCopilot(async (prefix, suffix) => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `You are a markdown writing assistant that replaces <FILL_ME> part with the right content.
Only output the content that replaces <FILL_ME> part.
Do not add any explanation.

<DOC>${prefix}<FILL_ME>${suffix}</DOC>
`,
        history: [],
        stream: false,
      }),
    });
    const { result } = await res.json();
    return result;
  });
}
