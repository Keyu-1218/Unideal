import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetConversationsQuery } from "@/store/chatApi";
import UserAvatar from "../UserAvatar";
import { Spinner } from "../ui/spinner";

const ConversationList = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const { data: conversations, isLoading, error } = useGetConversationsQuery();

  const activeConversationId = useMemo(
    () => (conversationId ? Number(conversationId) : null),
    [conversationId]
  );

  const handleConversationClick = (id: number) => {
    navigate(`/chat/${id}`);
  };

  if (isLoading) {
    return (
      <aside className="w-[332px] h-dvh border-r flex items-center justify-center">
        <Spinner />
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-[332px] h-dvh border-r">
        <div className="font-bold text-[20px] m-[25px]">Messages</div>
        <div className="flex items-center justify-center h-[calc(100%-80px)]">
          <p className="text-red-500 text-sm px-4 text-center">
            Failed to load conversations
          </p>
        </div>
      </aside>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <aside className="w-[332px] h-dvh border-r">
        <div className="font-bold text-[20px] m-[25px]">Messages</div>
        <div className="flex flex-col items-center justify-center h-[calc(100%-80px)] px-6">
          <div className="mb-4">
            <svg
              className="h-16 w-16 text-gray-300 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-gray-600 font-semibold mb-2 text-center">
            No active conversations
          </h3>
          <p className="text-gray-400 text-sm text-center">
            Start chatting by clicking "Dibs!" on a product you're interested in
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[332px] h-dvh border-r">
      <div className="font-bold text-[20px] m-[25px]">Messages</div>
      <div>
        <ul className="flex flex-col">
          {conversations.map((conversation) => {
            const isActive = activeConversationId === conversation.id;
            const otherPersonName = conversation.is_buyer ? "Seller" : "Buyer";

            return (
              <li
                key={conversation.id}
                className={`border-b-2 pl-4 py-5 hover:cursor-pointer transition-colors ${
                  isActive ? "bg-background-gray" : "hover:bg-background-light"
                }`}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex gap-5">
                  <UserAvatar label={otherPersonName} size="md" />
                  <div className="flex flex-col justify-center gap-2">
                    <span className="font-bold text-[14px]">
                      {otherPersonName}
                    </span>
                    <span className="text-green-dark font-bold text-[10px]">
                      Goods · {conversation.title}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default ConversationList;
