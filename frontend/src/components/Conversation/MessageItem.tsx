import { type Message, useSendMessageMutation, useGetConversationsQuery } from "@/store/chatApi";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import UserAvatar from "../UserAvatar";
import { useState } from "react";
import ScheduleTimeModal from "./ScheduleTimeModal";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const MessageItem = ({ message, allMessages }: { message: Message; allMessages: Message[] }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isOwn = message.sender === user?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversationId } = useParams<{ conversationId: string }>();
  const [sendMessage] = useSendMessageMutation();
  const { data: conversations } = useGetConversationsQuery();

  const currentConversation = conversations?.find(
    (c) => c.id === Number(conversationId)
  );
  
  const otherUser = (currentConversation?.is_buyer ? currentConversation?.seller : currentConversation?.buyer) as any;
  const rawName = otherUser?.username || (currentConversation?.is_buyer ? "Seller" : "Buyer");
  const otherPersonName = rawName.includes("@") ? rawName.split("@")[0] : rawName;

  const selfName = user?.username || user?.email?.split('@')[0] || "Me";

  let displayContent = message.content;
  let isScheduleProposal = false;
  let scheduleData = null;

  if (message.content.startsWith("SCHEDULE_PROPOSAL::")) {
    isScheduleProposal = true;
    displayContent = isOwn ? "My Availability" : "Seller's Availability";
    try {
      scheduleData = JSON.parse(
        message.content.replace("SCHEDULE_PROPOSAL::", "")
      );
    } catch (e) {
      console.error("Error parsing schedule data", e);
    }
  } else if (message.content.startsWith("PICKUP_CONFIRMED::")) {
    displayContent =
      "I choose the pickup time at " +
      message.content.replace("PICKUP_CONFIRMED::", "")+".";
  }

  let modalInitialData = scheduleData;
  let modalConfirmedData = null;
  let modalIsBuyer = !isOwn;

  if (isScheduleProposal && scheduleData && allMessages) {
    // Find ANY confirmation that matches a slot in this proposal
    const confirmationMessages = allMessages.filter((m) => m.content.startsWith("PICKUP_CONFIRMED::"));
    
    for (const confMsg of confirmationMessages) {
      const confirmedTimeStr = confMsg.content.replace("PICKUP_CONFIRMED::", "");
      
      const filteredData: { date: string; slots: string[] }[] = [];
      scheduleData.forEach((item: any) => {
        const dateObj = new Date(item.date);
        const matchingSlots = item.slots.filter((slot: string) => {
          const [h, m] = slot.split(":").map(Number);
          const dt = new Date(dateObj);
          dt.setHours(h, m);
          return format(dt, "h:mmaaa, MMM d") === confirmedTimeStr;
        });
        if (matchingSlots.length > 0) {
          filteredData.push({ ...item, slots: matchingSlots });
        }
      });

      if (filteredData.length > 0) {
        modalConfirmedData = filteredData;
        modalIsBuyer = false; // Force read-only mode
        break; // Found a matching confirmation, stop looking
      }
    }
  }

  const handleScheduleClick = () => {
    if (isScheduleProposal) {
      setIsModalOpen(true);
    }
  };

  const handleScheduleSubmit = async (availability: { date: Date; slots: string[] }[]) => {
    console.log("Submitting schedule from MessageItem:", availability);
    if (!conversationId) return;

    try {
      if (availability.length > 0 && availability[0].slots.length > 0) {
        const date = availability[0].date;
        const time = availability[0].slots[0];
        const [h, m] = time.split(":").map(Number);
        const dateTime = new Date(date);
        dateTime.setHours(h, m);
        const formattedTime = format(dateTime, "h:mmaaa, MMM d");
        
        await sendMessage({
          conversationId: Number(conversationId),
          content: "PICKUP_CONFIRMED::" + formattedTime,
        }).unwrap();
      }
    } catch (error) {
      console.error("Failed to send confirmation from message item:", error);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`flex mb-5 ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className="flex gap-3 max-w-[70%]">
          {!isOwn && <UserAvatar label={otherPersonName} size="sm" className="shrink-0" />}
          <div
            onClick={handleScheduleClick}
            className={`px-4 py-1 rounded-3xl flex justify-center items-center text-[14px] bg-background-gray ${
              isScheduleProposal
                ? "text-green-dark font-bold cursor-pointer hover:opacity-80"
                : "text-black"
            }`}
          >
            <p>{displayContent}</p>
          </div>
          {isOwn && (
            <UserAvatar label={selfName} size="sm" className="shrink-0" />
          )}
        </div>
      </div>
      {isScheduleProposal && (
        <ScheduleTimeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleScheduleSubmit}
          initialData={modalInitialData}
          confirmedData={modalConfirmedData}
          title={displayContent}
          isBuyer={modalIsBuyer}
        />
      )}
    </>
  );
};

export default MessageItem;
