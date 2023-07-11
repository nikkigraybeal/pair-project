import { useEffect, useRef } from "react";
import { CompletionMessage } from "@/types/completionMessage";
import Response from "./Response";

export interface ChatContainerProps {
  chatHist: CompletionMessage[]
}
export default function ChatContainer({chatHist}: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or updates
    scrollToBottom();
  });

  const scrollToBottom = () => {
    // Scroll to the bottom of the container
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  return (
    <div
      className="overflow-y-auto  h-[60vh] w-full border-solid border-2 border-white rounded-lg p-4"
      ref={containerRef}
    >
      {chatHist.map((message, idx) => {
        return (
          <Response key={idx} message={message.content} role={message.role} />
        );
      })}
    </div>
  );
}
