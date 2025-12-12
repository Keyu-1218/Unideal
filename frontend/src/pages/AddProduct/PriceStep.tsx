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
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="text-center">
        <h2 className="text-[35px] font-bold mb-16">Now, set a price</h2>

        <div className="flex items-center justify-center">
          <input
            type="text"
            value={price}
            onChange={handleChange}
            placeholder="25€"
            maxLength={4}
            className="
              w-[250px]
              text-[110px]
              font-bold
              text-center
              bg-transparent
              border-gray-300
              focus:border-green-dark
              outline-none
              placeholder:text-gray-300
            "
          />
          {price.length !== 0 && (
            <span className="text-[110px] font-bold ml-1">€</span>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-6 text-red-500 animate-slideDown">
          <AlertCircle size={24} />
          <span className="text-lg font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PriceStep;
