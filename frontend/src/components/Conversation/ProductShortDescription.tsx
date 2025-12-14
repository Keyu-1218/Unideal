import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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
import { useGetConversationsQuery } from "@/store/chatApi";
import ScheduleTimeModal from "./ScheduleTimeModal";

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

  const { conversationId } = useParams<{ conversationId: string }>();

  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery();
  const currentUserId = useSelector(
    (state: RootState) => state.auth.user?.id ?? null
  );
  const { data: conversations, isLoading: isConvosLoading } =
    useGetConversationsQuery();

  const currentConversation = conversations?.find(
    (convo) => convo.id === Number(conversationId)
  );

  const product = productsData?.products.find(
    (p) => p.id === currentConversation?.product
  );

  const isBuyer = currentConversation?.is_buyer;
  const tasks = isBuyer ? BUYER_TASKS : SELLER_TASKS;

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
    return;
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
  const todoLabel = `TODO List · 0/${tasks.length}`;
  const scheduleLabel = "Schedule with Seller";

  const otherPersonName = isBuyer ? "Seller" : "Buyer";

  const handleScheduleSubmit = (availability: { date: Date; slots: string[] }[]) => {
    console.log("Selected availability:", availability);
    // TODO: 调用 API 将时间发送给后端或发送消息给对方
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
                    <CarouselItem key={photo} className="h-full w-full">
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
        <div className="mb-6 w-7/8 mx-auto">
          <h3 className="text-xl font-bold text-green-dark">
            {product.title}
          </h3>
        </div>

        {/* TODO List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#B9CFBF] mb-6">
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
              size={18}
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
                {tasks.map((label) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon name="clock" size={16} />
                    <span className="text-xs text-black font-bold">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pickup Location & Time */}
        <div className="space-y-4">
          <div className="bg-[#E9F1EB] rounded-2xl px-5 py-4 border border-[#B9CFBF]">
            <button
              type="button"
              className="w-full flex items-center justify-between text-left"
              onClick={() => setIsLocationOpen((prev) => !prev)}
            >
              <span className="text-[14px] font-bold text-green-dark">
                Pickup Location
              </span>
              <Icon
                name="toggle"
                size={18}
                className={isLocationOpen ? "" : "rotate-180"}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isLocationOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-4">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-green-light text-green-dark font-semibold py-2 text-xs cursor-pointer">
                    <Icon
                      name="whiteLocation"
                      size={10}
                      className="cursor-default"
                    />
                    <p className="text-white">{scheduleLabel}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#E9F1EB] rounded-2xl px-5 py-4 border border-[#B9CFBF]">
            <button
              type="button"
              className="w-full flex items-center justify-between text-left"
              onClick={() => setIsTimeOpen((prev) => !prev)}
            >
              <span className="text-[14px] font-bold text-green-dark">
                Pickup Time
              </span>
              <Icon
                name="toggle"
                size={18}
                className={isTimeOpen ? "" : "rotate-180"}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isTimeOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-4">
                  <button 
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-green-light text-green-dark font-semibold py-2 text-xs cursor-pointer"
                  >
                    <Icon
                      name="whiteCalendar"
                      size={16}
                      className="cursor-default"
                    />
                    <p className="text-white">{scheduleLabel}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBuyer && (
          <div className="flex items-center gap-3 mt-6 justify-between">
            <Button className="flex-1 bg-green-dark hover:bg-green-dark hover:opacity-90 text-white font-semibold py-6 rounded-4xl w-[145px] h-[34px]">
              Go To Payment
            </Button>
            <Button
              variant="outline"
              className="border-green-dark text-gray-dark font-semibold px-8 py-6 rounded-4xl"
            >
              Undibs
            </Button>
          </div>
        )}

        <ScheduleTimeModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onSubmit={handleScheduleSubmit}
        />
      </div>
    </aside>
  );
};

export default ProductShortDescription;
