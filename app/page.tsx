"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { CompletionMessage } from "@/types/CompletionMessage";
import ChatContainer from "./components/ChatContainer";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<CompletionMessage[]>([]);

  const handleUserPrompt = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <main className="flex h-screen flex-col items-center justify-between p-4">
      <h1 className="mb-2 text-3xl">ChatterBox</h1>
      <ChatContainer chatHist={chatHistory} />
      <form
        className="flex flex-row w-full h-20 items-center mt-4"
        onSubmit={handleSubmit}
      >
        <textarea
          className="text-black w-full rounded-lg p-2 h-20 mr-4"
          placeholder="ask me anything"
          value={userPrompt}
          onChange={handleUserPrompt}
        />
        <button
          type="submit"
          className="border-2 rounded-lg p-2 hover:bg-gray-300 hover:text-black"
        >
          Generate Answer
        </button>
      </form>
    </main>
  );
}
