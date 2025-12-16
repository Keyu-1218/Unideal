import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  useGetConversationsQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} from "@/store/chatApi";
import { useGetProductsQuery, type Product } from "@/store/productsApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductInfoCard = ({ product }: { product: Product }) => {
  const [startConversation, { isLoading }] = useStartConversationMutation();
  const [sendMessage, { isLoading: isSendingInitialMessage }] =
    useSendMessageMutation();
  const { data: conversations } = useGetConversationsQuery();
  const { data: ownProducts } = useGetProductsQuery({ owned: true });

  const navigate = useNavigate();

  const isDibsed = conversations?.some((convo) => convo.product === product.id);
  const isOwnProduct = ownProducts?.products.some(
    (ownProduct) => ownProduct.id === product.id
  );

  const existingConversation = conversations?.find(
    (convo) => convo.product === product.id
  );

  const handleDibsClick = async () => {
    if (existingConversation) {
      navigate(`/chat/${existingConversation.id}`);
      return;
    }

    try {
      const response = await startConversation(product.id).unwrap();

      try {
        await sendMessage({
          conversationId: response.id,
          content: `Hi! I'm interested in your "${product.title}".`,
        }).unwrap();
      } catch (sendError) {
        console.error(sendError);
        toast.error(
          "Chat is created, but the message was not sent. Please try again in the chat."
        );
      }

      navigate(`/chat/${response.id}`);
    } catch (e: any) {
      console.error(e);
      const backendMessage =
        e?.data?.message || "Something went wrong. Please try again.";
      toast.error(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to start a chat right now."
      );
    }
  };

  return (
    <div className="w-[clamp(480px,38vw,560px)]">
      <div className="flex justify-between items-center mb-3">
        <span className="text-green-dark font-bold text-[clamp(28px,2.6vw,36px)]">
          {product.price} €
        </span>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-[clamp(18px,2.2vw,24px)]">{product.title}</h3>
        <p className="text-gray-dark leading-6 text-[clamp(12px,1.4vw,13px)]">
          {product.short_description}
        </p>
        <div className="mt-5 flex gap-5">
          <div className="flex items-center gap-3.5 rounded-4xl bg-background-light px-4 py-2">
            <Icon name="size" size={21} />
            <span className="text-green-light text-[clamp(9px,1.4vw,11px)]">Size:</span>
            <span className="text-green-dark font-bold text-[clamp(10px,1.6vw,12px)]">
              120cm x 50cm x 40cm
            </span>
          </div>
          <div className="flex items-center gap-3.5 rounded-4xl bg-background-light px-4 py-2">
            <Icon name="condition" size={21} />
            <span className="text-green-light text-[clamp(9px,1.4vw,11px)]">Condition:</span>
            <span className="text-green-dark font-bold text-[clamp(10px,1.6vw,12px)]">80% New</span>
          </div>
        </div>
        <div className="h-px bg-gray-light mt-6" />
      </div>

      <div>
        <div className="mt-6 rounded-2xl flex justify-between items-center bg-background-light py-3 pr-12 pl-5">
          <div className="flex items-center gap-2.5">
            <Icon name="date" size={24} />
            <span className="text-green-light text-[clamp(9px,1.5vw,11px)] pr-1">
              Available Pickup Dates
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-light text-[clamp(9px,1.4vw,11px)]">From</span>
            <span className="text-green-dark font-bold text-[clamp(11px,1.8vw,13px)]">
              {product.pickup.date.available_from}
            </span>
            <span className="text-green-light text-[clamp(9px,1.4vw,11px)]">To</span>
            <span className="text-green-dark font-bold text-[clamp(11px,1.8vw,13px)]">
              {product.pickup.date.available_to}
            </span>
          </div>
        </div>
        <img 
          src="/mapInDetail.png" 
          alt="Pickup location map" 
          className="w-full mt-8 rounded-2xl"
        />
        <Button
          disabled={isLoading || isSendingInitialMessage || isOwnProduct}
          className="w-full font-normal bg-green-dark hover:bg-green-dark hover:opacity-90 py-6 mt-8 hover:cursor-pointer text-[clamp(14px,1.8vw,16px)]"
          onClick={handleDibsClick}
        >
          {isOwnProduct
            ? "Your Product"
            : isLoading || isSendingInitialMessage
            ? "Starting..."
            : isDibsed
            ? "Go to Chat"
            : "Dibs!"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfoCard;
