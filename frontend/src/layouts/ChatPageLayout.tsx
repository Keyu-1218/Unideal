import ConversationList from "@/components/Conversation/ConversationList";
import ProductShortDescription from "@/components/Conversation/ProductShortDescription";
import { Outlet } from "react-router-dom";

const ChatPageLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[280px] h-screen">
        <ConversationList />
      </div>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <ProductShortDescription />
    </div>
  );
};

export default ChatPageLayout;
