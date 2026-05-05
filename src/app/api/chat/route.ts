import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, user.id))
    .limit(50);

  const taskSummary = userTasks.length
    ? userTasks
        .map(
          (t) =>
            `- [${t.status}] (${t.priority}) ${t.title}${t.dueDate ? ` (due ${t.dueDate})` : ""}`,
        )
        .join("\n")
    : "(no tasks yet)";

  const system = `You are Personal Project's productivity assistant. You help ${user.name} stay organized.
Be concise and actionable. When asked, summarize, prioritize, or suggest next actions based on their tasks.

Current tasks:
${taskSummary}`;

  if (!process.env.AI_GATEWAY_API_KEY) {
    return mockStream(user.name, userTasks.length);
  }

  const result = streamText({
    model: "anthropic/claude-haiku-4-5",
    system,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

function mockStream(name: string, taskCount: number) {
  const text = `Hi ${name}! I'm running in offline demo mode (no AI_GATEWAY_API_KEY set).

You currently have ${taskCount} task${taskCount === 1 ? "" : "s"}. Once you add an AI Gateway key to \`.env.local\`, I'll be able to:

• Summarize your workload
• Suggest priorities for today
• Draft new tasks from a brief
• Identify blockers across your board

Get a key at vercel.com/ai-gateway, then restart the dev server.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const id = crypto.randomUUID();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "start" })}\n\n`));
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "text-start", id })}\n\n`,
        ),
      );
      for (const ch of text) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "text-delta", id, delta: ch })}\n\n`,
          ),
        );
        await new Promise((r) => setTimeout(r, 8));
      }
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "text-end", id })}\n\n`),
      );
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "finish" })}\n\n`));
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
    },
  });
}
