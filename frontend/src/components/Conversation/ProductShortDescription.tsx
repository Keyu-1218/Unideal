import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import UserAvatar from "@/components/UserAvatar";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PHOTO_DOWNLOAD_URL } from "@/config/api";
import type { RootState } from "@/store/store";
import { useGetProductsQuery } from "@/store/productsApi";
import { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation } from "@/store/chatApi";
import ScheduleTimeModal from "./ScheduleTimeModal";
import ScheduleLocationModal from "./ScheduleLocationModal";

const BUYER_TASKS = [
  "Complete Payment",
  "Schedule a Pickup Time Slot",
  "Schedule a Pickup Location",
  "Confirm After Pickup",
];

const SELLER_TASKS = [
  "Schedule a Pickup Time Slot",
  "Schedule a Pickup Location",
  "Confirm After Pickup",
];

const ProductShortDescription = () => {
  const [isTodoOpen, setIsTodoOpen] = useState(true);
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isTimeOpen, setIsTimeOpen] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [sendMessage] = useSendMessageMutation();

  const { conversationId } = useParams<{ conversationId: string }>();

  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery({ includeAllProducts: 'true' });
  const currentUserId = useSelector(
    (state: RootState) => state.auth.user?.id ?? null
  );
  const { data: conversations, isLoading: isConvosLoading } =
    useGetConversationsQuery();
  
  const { data: messages } = useGetMessagesQuery(Number(conversationId), {
    skip: !conversationId,
    pollingInterval: 3000,
  });

  const currentConversation = conversations?.find(
    (convo) => convo.id === Number(conversationId)
  );

  const product = productsData?.products.find(
    (p) => p.id === currentConversation?.product
  );

  const isBuyer = currentConversation?.is_buyer;
  const tasks = isBuyer ? BUYER_TASKS : SELLER_TASKS;

  // Logic to find the latest schedule proposal
  const scheduleMessage = messages
    ?.slice()
    .reverse()
    .find((m) => m.content.startsWith("SCHEDULE_PROPOSAL::"));

  const locationMessage = messages
    ?.slice()
    .reverse()
    .find((m) => m.content.startsWith("You can pick up at "));

  const scheduleData = useMemo(() => {
    if (!scheduleMessage) return null;
    try {
      return JSON.parse(scheduleMessage.content.replace("SCHEDULE_PROPOSAL::", ""));
    } catch (error) {
      console.error("Failed to parse schedule data:", error);
      return null;
    }
  }, [scheduleMessage]);

  const latestRelevantMessage = messages
    ?.slice()
    .reverse()
    .find(
      (m) =>
        m.content.startsWith("SCHEDULE_PROPOSAL::") ||
        m.content.startsWith("PICKUP_CONFIRMED::")
    );

  const isConfirmed = latestRelevantMessage?.content.startsWith("PICKUP_CONFIRMED::");

  const confirmedTimeStr = isConfirmed
    ? latestRelevantMessage?.content.replace("PICKUP_CONFIRMED::", "")
    : null;

  const pickupLocationStr = locationMessage
    ? locationMessage.content.replace("You can pick up at ", "").replace(/\.$/, "")
    : null;

  // Parse pickupLocationStr into location and description
  // Format: "location (description)" or just "location"
  const parsedLocation = (() => {
    if (!pickupLocationStr) return { location: "", description: "" };
    const match = pickupLocationStr.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return { location: match[1].trim(), description: match[2].trim() };
    }
    return { location: pickupLocationStr, description: "" };
  })();

  const isScheduleSender = scheduleMessage?.sender === currentUserId;

  // Loading states
  if (isProductsLoading || isConvosLoading) {
    return (
      <aside className="w-[320px] h-dvh p-5 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </aside>
    );
  }

  // No conversation selected
  if (!conversationId) {
    return null;
  }

  // Conversation not found
  if (!currentConversation) {
    return (
      <aside className="w-[320px] h-dvh p-5 flex items-center justify-center">
        <p className="text-red-500 text-center">Conversation not found</p>
      </aside>
    );
  }

  // Product not found
  if (!product) {
    return (
      <aside className="w-[320px] h-dvh p-5 flex items-center justify-center">
        <p className="text-gray-500 text-center">Product not found</p>
      </aside>
    );
  }

  const photos = product.photos ?? [];
  const completedCount = (confirmedTimeStr ? 1 : 0) + (pickupLocationStr ? 1 : 0);
  const todoLabel = `TODO List · ${completedCount}/${tasks.length}`;
  const otherUser = (isBuyer ? currentConversation?.seller : currentConversation?.buyer) as any;
  const rawName = otherUser?.username || (isBuyer ? "Seller" : "Buyer");
  const otherPersonName = rawName.includes("@") ? rawName.split("@")[0] : rawName;
  const scheduleLabel = `Schedule with ${otherPersonName}`;
  const locationButtonText = isBuyer ? "Waiting for Seller's Location" : scheduleLabel;
  const isLocationButtonDisabled = !!isBuyer;

  // Determine Button State
  let buttonText = scheduleLabel;
  let isButtonDisabled = false;
  let showModal = () => setIsScheduleModalOpen(true);

  if (isBuyer) {
    if (scheduleData && !isScheduleSender) {
      buttonText = "Check Seller's Availability";
      isButtonDisabled = false;
    } else {
      buttonText = "Waiting for Seller's Availability";
      isButtonDisabled = true;
    }
  } else {
    // Seller
    if (scheduleData && isScheduleSender) {
      buttonText = "Wait for Buyer to confirm";
      isButtonDisabled = true;
    } else {
      buttonText = scheduleLabel;
      isButtonDisabled = false;
    }
  }

  const handleScheduleSubmit = async (availability: { date: Date; slots: string[] }[]) => {
    console.log("Submitting schedule:", availability);
    try {
      if (isBuyer) {
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
      } else {
        await sendMessage({
          conversationId: Number(conversationId),
          content: "SCHEDULE_PROPOSAL::" + JSON.stringify(availability),
        }).unwrap();
      }
    } catch (error) {
      console.error("Failed to send schedule message:", error);
    }
  };

  return (
    <aside className="w-[320px] h-dvh border-l bg-[#F3F6F2] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Seller/Buyer Info */}
        <div className="flex items-center justify-between mb-4 w-7/8 mx-auto">
          <div>
            <p className="font-bold text-[16px] text-green-dark">
              {otherPersonName}
            </p>
            <div className="text-xs text-[#5E836C] font-semibold">⭐ 4.8</div>
          </div>
          <UserAvatar label={otherPersonName} size="sm" />
        </div>

        <div className="border-b border-[#B9CFBF] mb-6" />

        {/* Product Carousel */}
        <div className="mb-5 relative w-2/3 mx-auto">
          <Carousel className="w-full">
            <div className="w-full aspect-[4/5] rounded-md overflow-hidden bg-white shadow-sm relative">
              <CarouselContent className="h-full">
                {photos.length > 0 ? (
                  photos.map((photo) => (
                    <CarouselItem key={photo} className="w-full aspect-[4/5]">
                      <img
                        src={
                          photo.startsWith("http")
                            ? photo
                            : `${PHOTO_DOWNLOAD_URL}/${photo}`
                        }
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="h-full w-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-400">No photos</p>
                  </CarouselItem>
                )}
              </CarouselContent>
              <span className="absolute bottom-4 left-4 bg-gray-light px-3 py-1 rounded-full text-green-dark font-semibold text-sm shadow">
                €{product.price}
              </span>
            </div>
            {photos.length > 1 && (
              <>
                <CarouselPrevious className="-left-12 top-1/2 -translate-y-1/2 bg-green-dark text-white hover:bg-green-dark hover:opacity-80 border-none" />
                <CarouselNext className="-right-12 top-1/2 -translate-y-1/2 bg-green-dark text-white hover:bg-green-dark hover:opacity-80 border-none" />
              </>
            )}
          </Carousel>
        </div>

        {/* Product Info */}
        <div className="mb-4 w-7/8 mx-auto">
          <h3 className="text-xl font-bold text-green-dark text-center">
            {product.title}
          </h3>
        </div>

        {/* TODO List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#B9CFBF] mb-4">
          <button
            type="button"
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setIsTodoOpen((prev) => !prev)}
          >
            <div>
              <p className="text-[14px] font-bold text-green-dark">
                {todoLabel}
              </p>
              <p className="text-xs text-[#5E836C]">
                Track your pickup progress
              </p>
            </div>
            <Icon
              name="toggle"
              size={14}
              className={isTodoOpen ? "" : "rotate-180"}
            />
          </button>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              isTodoOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <ul className="px-5 pb-5 space-y-3">
                {tasks.map((label) => {
                  const isCompleted =
                    (label === "Schedule a Pickup Time Slot" && !!confirmedTimeStr) ||
                    (label === "Schedule a Pickup Location" && !!pickupLocationStr);
                  return (
                    <li key={label} className="flex items-center gap-3">
                      <Icon name={isCompleted ? "check" : "clock"} size={16} />
                      <span className="text-xs text-black font-bold">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Pickup Location & Time */}
        <div className="space-y-4">
          <div className="bg-[#E9F1EB] rounded-2xl px-5 py-4 border border-[#B9CFBF]">
            <div
              className="w-full flex items-center justify-between text-left cursor-pointer"
              onClick={() => setIsLocationOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-green-dark">
                  Pickup Location
                </span>
                {pickupLocationStr && !isBuyer && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLocationModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name="reschedule" size={12} />
                    <span className="text-xs">Reschedule</span>
                  </button>
                )}
              </div>
              <Icon
                name="toggle"
                size={14}
                className={isLocationOpen ? "" : "rotate-180"}
              />
            </div>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isLocationOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-4">
                  {pickupLocationStr ? (
                    <div className="w-full flex items-center justify-center py-2">
                      <p className="text-black font-bold text-base text-center px-2">
                        {pickupLocationStr}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isLocationButtonDisabled) setIsLocationModalOpen(true);
                      }}
                      disabled={isLocationButtonDisabled}
                      className={`w-full flex items-center justify-center gap-2 rounded-full font-semibold py-1.5 text-xs ${
                        isLocationButtonDisabled
                          ? "bg-[#B9CFBF] cursor-not-allowed"
                          : "bg-green-light text-green-dark cursor-pointer"
                      }`}
                    >
                      <Icon
                        name="whiteLocation"
                        size={22}
                        className="cursor-default"
                      />
                      <p className="text-white">{locationButtonText}</p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#E9F1EB] rounded-2xl px-5 py-4 border border-[#B9CFBF]">
            <div
              className="w-full flex items-center justify-between text-left cursor-pointer"
              onClick={() => setIsTimeOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-green-dark">
                  Pickup Time
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsScheduleModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name="reschedule" size={12} />
                  <span className="text-xs">Reschedule</span>
                </button>
              </div>
              <Icon
                name="toggle"
                size={14}
                className={isTimeOpen ? "" : "rotate-180"}
              />
            </div>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isTimeOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-4">
                  {confirmedTimeStr ? (
                    <div className="w-full flex items-center justify-center py-2">
                      <p className="text-black font-bold text-base">
                        {confirmedTimeStr}
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => !isButtonDisabled && showModal()}
                      disabled={isButtonDisabled}
                      className={`w-full flex items-center justify-center gap-2 rounded-full font-semibold py-2 text-xs ${
                        isButtonDisabled
                          ? "bg-[#B9CFBF] cursor-not-allowed"
                          : "bg-green-light text-green-dark cursor-pointer"
                      }`}
                    >
                      <Icon
                        name="whiteCalendar"
                        size={16}
                        className="cursor-default"
                      />
                      <p className="text-white">
                        {buttonText}
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBuyer && (
          <div className="flex items-center gap-3 mt-6 justify-between">
            <Button className="flex-1 bg-green-dark hover:bg-green-dark hover:opacity-90 text-white font-semibold py-5 rounded-4xl w-[145px] h-[34px]">
              Go To Payment
            </Button>
            <Button
              variant="outline"
              className="border-green-dark text-gray-dark font-semibold px-8 py-5 rounded-4xl"
            >
              Undibs
            </Button>
          </div>
        )}

        {/* Location Modal (Seller triggers) */}
        <ScheduleLocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          title="Pickup Location"
          initialLocation={pickupLocationStr ? parsedLocation.location : (product.pickup?.address?.street || "")}
          initialDescription={pickupLocationStr ? parsedLocation.description : ""}
          onSubmit={async (payload) => {
            const locationStr = `${payload.location}${payload.description ? ` (${payload.description})` : ""}`;
            try {
              await sendMessage({
                conversationId: Number(conversationId),
                content: `You can pick up at ${locationStr}.`,
              }).unwrap();
            } catch (e) {
              // ignore send failure here
            }
          }}
        />

        <ScheduleTimeModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onSubmit={handleScheduleSubmit}
          initialData={isBuyer ? scheduleData : null}
          title={isBuyer ? "Seller's Availability" : "My Availability"}
          isBuyer={isBuyer}
        />
      </div>
    </aside>
  );
};

export default ProductShortDescription;
