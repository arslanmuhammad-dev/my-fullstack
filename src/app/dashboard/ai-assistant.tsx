"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AiAssistant() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  const isStreaming = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <h2 className="font-medium text-sm">AI Assistant</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground space-y-3">
            <p>Ask me to help with your tasks. Try:</p>
            <ul className="space-y-1.5 text-xs">
              <li className="rounded border px-3 py-2 bg-background">
                What should I focus on first today?
              </li>
              <li className="rounded border px-3 py-2 bg-background">
                Summarize my high-priority items.
              </li>
              <li className="rounded border px-3 py-2 bg-background">
                Suggest tasks for shipping a portfolio.
              </li>
            </ul>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`text-sm ${m.role === "user" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <p className="text-xs uppercase tracking-wide font-medium mb-1 opacity-60">
                {m.role === "user" ? "You" : "Assistant"}
              </p>
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("")}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          disabled={isStreaming}
          className="text-sm"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isStreaming || !input.trim()}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
