import { useGetMessagesQuery } from "@/store/chatApi";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Spinner } from "../ui/spinner";

const ChatWindow = () => {
  const { conversationId } = useParams();

  const {
    data: messages,
    isLoading: isLoadingMessages,
    error,
  } = useGetMessagesQuery(Number(conversationId), {
    pollingInterval: 3000,
    skip: !conversationId,
  });

  const displayMessages = messages ?? [];

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error loading messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {displayMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mb-3">
                <svg
                  className="mx-auto h-12 w-12 text-green-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-green-dark font-semibold mb-1">
                No messages yet
              </p>
              <p className="text-gray-400 text-sm">
                Start the conversation below!
              </p>
            </div>
          </div>
        ) : (
          <MessageList messages={displayMessages} />
        )}
      </div>
      <div className="flex-none bg-white pb-4 px-4">
        <MessageInput conversationId={Number(conversationId)} />
      </div>
    </div>
  );
};

export default ChatWindow;
