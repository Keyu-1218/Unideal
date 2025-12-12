import { useNavigate } from "react-router-dom";

const MainProfileContent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1">
      <main className="grid grid-cols-4 p-11 gap-x-11 gap-y-16">
        {/* add new product card */}
        <div className="w-[180px] h-[200px] flex flex-col gap-2.5 hover: cursor-pointer">
          <button
            className="w-[180px] h-[180px] bg-background-medium flex justify-center items-center text-[77px] text-green-light hover:cursor-pointer"
            onClick={()=> navigate('/add-product')}
          >
            +
          </button>
          <p className="text-center font-bold text-[18px]">Sell A New Item</p>
        </div>

        {/* poducts */}
      </main>
    </div>
  );
};

export default MainProfileContent;
