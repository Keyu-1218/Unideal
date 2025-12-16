import { useAddProduct } from "@/contexts/add-product/useAddProduct";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const PriceStep = () => {
  const { data, updateData, errors, clearFieldError } = useAddProduct();
  const [price, setPrice] = useState<string>(data.price);
  const error = errors["price"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPrice(value);

    // ✅ Очищаємо помилку
    if (error) {
      clearFieldError("price");
    }
  };

  useEffect(() => {
    return () => updateData("price", price);
  }, [price, updateData]);

  return (
    <div className="w-[clamp(520px,56vw,680px)] mx-auto flex flex-col items-center text-center">
      <h2 className="text-[34px] font-bold ">Now, set a price</h2>

      <div className="flex items-center justify-center mt-[clamp(16px,6vh,40px)]">
        <input
          type="text"
          value={price}
          onChange={handleChange}
          placeholder="25"
          maxLength={4}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-[clamp(150px,24vw,160px)] text-[clamp(48px,8vw,72px)] font-bold text-center bg-transparent focus:border-green-dark outline-none placeholder:text-gray-300"
        />
        <span className="text-[clamp(48px,8vw,72px)] font-bold">€</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-[clamp(8px,3vh,16px)] text-red-500 animate-slideDown">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PriceStep;
