import { useAddProduct } from "@/contexts/add-product/useAddProduct";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const DescriptionStep = () => {
  const { data, updateData, errors, clearFieldError } = useAddProduct();
  const [description, setDescription] = useState<string>(data.description);
  const error = errors["description"];

  useEffect(() => {
    return () => updateData("description", description);
  }, [description, updateData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);

    if (error) {
      clearFieldError("description");
    }
  };

  return (
    <div className="w-[clamp(520px,56vw,680px)]">
        <h2 className="text-[30px] font-bold">Create your description</h2>
        <p className="text-[18px] text-text-gray text-left mt-2">
          Describe what makes your item special.
        </p>

        <textarea
          className={`w-full h-[180px] border-2 rounded-[10px] mt-[clamp(16px,6vh,40px)] p-3.5 resize-none transition-all duration-200
            ${
              error 
                ? "border-red-500 focus:border-red-500  "
                : "border-gray-dark focus:border-green-dark "
            }`}
          value={description}
          onChange={handleChange}
          maxLength={200}
          placeholder="Describe your item..."
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
            {description.length}/200
          </span>
        </div>
      </div>
  );
};

export default DescriptionStep;
