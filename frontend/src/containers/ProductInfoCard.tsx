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
    <div className="w-[631px]">
      <div className="flex justify-between items-center mb-6">
        <span className="text-green-dark text-5xl font-bold">
          {product.price} €
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-4">{product.title}</h3>
        <p className="text-gray-dark text-[14px] leading-6">
          {product.short_description}
        </p>
        <div className="mt-6 flex gap-5">
          <div className="flex items-center gap-3.5 rounded-4xl bg-background-light px-5 py-3">
            <Icon name="size" size={21} />
            <span className="text-green-light">Size:</span>
            <span className="text-green-dark font-bold">
              120cm x 50cm x 40cm
            </span>
          </div>
          <div className="flex items-center gap-3.5 rounded-4xl bg-background-light px-5 py-3">
            <Icon name="condition" size={21} />
            <span className="text-green-light">Condition:</span>
            <span className="text-green-dark font-bold">80% New</span>
          </div>
        </div>
        <div className="h-px bg-gray-light mt-11" />
      </div>

      <div>
        <div className="mt-7 rounded-2xl flex justify-between items-center bg-background-light py-3 pr-11 pl-7">
          <div className="flex gap-6">
            <Icon name="date" size={31} />
            <span className="text-green-light">
              Available
              <br /> Pickup Dates
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-light">From</span>
            <span className="text-green-dark font-semibold text-[22px]">
              {product.pickup.date.available_from}
            </span>
            <span className="text-green-light">To</span>
            <span className="text-green-dark font-semibold text-[22px]">
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
          className="w-full text-xl font-normal bg-green-dark hover:bg-green-dark hover:opacity-90 py-6 mt-8 hover:cursor-pointer"
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
