import type { Message } from "@/store/chatApi";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import UserAvatar from "../UserAvatar";

const MessageItem = ({ message }: { message: Message }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const firstLetter = user?.email[0];
  const isOwn = message.sender === user?.id;

  return (
    <div className={`flex mb-5 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="flex gap-3 max-w-[70%]">
        {!isOwn && <UserAvatar label="p" size="sm" className="shrink-0" />}
        <div
          className={`px-4 py-1 rounded-3xl flex justify-center items-center text-[14px] bg-background-gray  ${
            isOwn ? "text-black" : "text-green-dark font-bold"
          }`}
        >
          <p>{message.content}</p>
        </div>
        {isOwn && (
          <UserAvatar label={firstLetter} size="sm" className="shrink-0" />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
