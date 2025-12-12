import { useSendMessageMutation } from "@/store/chatApi";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import Icon from "../Icon";

const MessageInput = ({ conversationId }: { conversationId: number }) => {
  const [
    sendMessage,
    { isLoading: isSendingMessage, error: sendMessageError },
  ] = useSendMessageMutation();
  const [input, setInput] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage({ conversationId, content: input }).unwrap();
      setInput("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full flex justify-end p-2.5 mt-4">
      <div className="w-full relative">
        <input
          type="text"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={input}
          placeholder="Type a message"
          className="w-full border-green-dark border-[1px] border-solid rounded-3xl py-2 px-5 pr-14"
        />

        <button
          onClick={handleSendMessage}
          disabled={isSendingMessage}
          className="bg-background-gray-200 rounded-full p-2 absolute right-1.5 top-1/2 -translate-y-1/2 hover:opacity-90"
        >
          <Icon name="arrowUp" size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
