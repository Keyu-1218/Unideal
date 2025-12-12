import type { Message } from "@/store/chatApi";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";

const MessageList = ({ messages }: { messages: Message[] }) => {
  // list of messages that will be mapped to MessageItem
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) return <div>No messages yet</div>;
  return (
    <div className="flex flex-col p-6">
      {messages.map((message) => (
        <MessageItem message={message} key={message.id} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
