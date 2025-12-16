import { useAddProduct } from "@/contexts/add-product/useAddProduct";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const TitleStep = () => {
  const { data, updateData, errors, clearFieldError } = useAddProduct();
  const error = errors["title"];

  const [input, setInput] = useState<string>(data.title);

  useEffect(() => {
    return () => {
      updateData("title", input);
    };
  }, [input, updateData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (error) {
      clearFieldError("title");
    }
  };

  return (
    <div className="w-[clamp(520px,56vw,680px)]">
        <h2 className="text-[30px] font-bold">
          Give your item a short, catchy title
        </h2>
        <p className="text-[18px] text-text-gray text-left mt-2">
          Keep it short, clear, and easy to understand.
        </p>

        <textarea
          className={`w-full h-[clamp(140px, 30vh, 220px)] border-2 rounded-[10px] mt-[clamp(16px,6vh,40px)] p-3.5 resize-none transition-all duration-200
            ${
              error 
                ? "border-red-500 focus:border-red-500  "
                : "border-gray-dark focus:border-green-dark"
            }`}
          value={input}
          onChange={handleChange}
          maxLength={30}
          placeholder="e.g., Vintage Leather Sofa"
        />

        <div className="flex justify-between items-center px-2 mt-[clamp(4px,2vh,8px)]">
          {error ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          ) : (
            <div />
          )}

          <span className="text-gray-dark text-[12px] font-semibold">
            {input.length}/30
          </span>
        </div>
      </div>
  );
};

export default TitleStep;
