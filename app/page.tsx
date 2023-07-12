"use client";
import { ChangeEvent, useState } from "react";
import { CompletionMessage } from "@/types/CompletionMessage";
import ChatContainer from "./components/ChatContainer";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<CompletionMessage[]>([]);

  const handleUserPrompt = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    const messages = [
      ...chatHistory,
      { role: "user", content: `${userPrompt}` },
    ];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      const data = await res.json();
      setChatHistory([
        ...messages,
        { role: "assistant", content: `${data.result}` },
      ]);
      setUserPrompt("");
    } catch {
      throw new Error("something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <h1 className="mb-2 text-3xl">ChatterBox</h1>
      <ChatContainer chatHist={chatHistory} />
      <textarea
        className="text-black w-full h-20 rounded-lg p-4 mt-2"
        placeholder="ask me anything"
        value={userPrompt}
        onChange={(e) => handleUserPrompt(e)}
      />
      <button className="border-2 rounded-lg p-2 mt-4" onClick={handleSubmit}>
        generate answer
      </button>
    </main>
  );
}
