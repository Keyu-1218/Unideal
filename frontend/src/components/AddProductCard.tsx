import { useNavigate } from "react-router-dom";

const AddProductCard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[180px] flex flex-col gap-2.5">
      <button
        className="w-[180px] h-[180px] bg-background-medium flex justify-center items-center text-[77px] text-green-light hover:cursor-pointer"
        onClick={() => navigate("/add-product")}
      >
        +
      </button>
      <p className="text-center font-bold text-[18px]">Sell A New Item</p>
    </div>
  );
};

export default AddProductCard;
