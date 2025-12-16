import { useNavigate } from "react-router-dom";

const AddProductCard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[140px] flex flex-col gap-2.5">
      <button
        className="group w-[140px] h-[140px] bg-background-light flex justify-center items-center text-[77px] text-green-light hover:cursor-pointer rounded-2xl"
        onClick={() => navigate("/add-product")}
      >
        <span className="transition-transform duration-300 group-hover:scale-110">
          +
        </span>
      </button>
      <p className="text-center font-bold text-[14px]">Sell A New Item</p>
    </div>
  );
};

export default AddProductCard;
