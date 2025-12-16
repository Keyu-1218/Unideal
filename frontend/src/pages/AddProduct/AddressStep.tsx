import { useAddProduct } from "@/contexts/add-product/useAddProduct";
import { AlertCircle } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";

const AddressStep = () => {
  const { data, updateData, errors, clearFieldError } = useAddProduct();
  const [address, setAddress] = useState(data.address);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Sanitize postal code: keep digits only, max length 5
    const nextValue =
      id === "postalCode" ? value.replace(/\D/g, "").slice(0, 5) : value;

    setAddress((prev) => {
      const updated = { ...prev, [id]: nextValue };
      updateData("address", updated); // keep context in sync for validation
      return updated;
    });

    if (errors[`address.${id}`]) {
      clearFieldError(`address.${id}`);
    }
  };

  useEffect(() => {
    return () => updateData("address", address);
  }, [address, updateData]);

  const getFieldError = (field: string) => {
    return errors[`address.${field}`];
  };

  const getInputClassName = (field: string) => {
    const hasError = getFieldError(field);
    return `w-full h-[48px] pl-4 border-2 rounded-[10px] text-[16px] placeholder:text-gray-dark transition-colors
      ${
        hasError
          ? "border-red-500 focus:border-red-500 "
          : "border-gray-dark focus:border-green-dark"
      }`;
  };

  return (
    <div className="w-[clamp(520px,56vw,680px)]">
        <h2 className="text-[30px] font-bold">Pick up address</h2>
        <p className="text-[18px] text-text-gray text-left">
          Your address is only shared with guests after they've made a
          reservation.
        </p>

        <div className="mt-4 space-y-4">
          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Country/Region
            </label>
            <input
              type="text"
              id="country"
              placeholder="Country / Region"
              className={getInputClassName("country")}
              value={address.country}
              onChange={handleAddressChange}
            />
            {getFieldError("country") && (
              <div className="flex items-center gap-2 mt-1 text-red-500">
                <AlertCircle size={16} />
                <span className="text-sm">{getFieldError("country")}</span>
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="City"
              className={getInputClassName("city")}
              value={address.city}
              onChange={handleAddressChange}
            />
            {getFieldError("city") && (
              <div className="flex items-center gap-2 mt-1 text-red-500">
                <AlertCircle size={16} />
                <span className="text-sm">{getFieldError("city")}</span>
              </div>
            )}
          </div>

          {/* Street Address */}
          <div>
            <label
              htmlFor="streetAddress"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Street address
            </label>
            <input
              type="text"
              id="streetAddress"
              placeholder="Street address"
              className={getInputClassName("streetAddress")}
              value={address.streetAddress}
              onChange={handleAddressChange}
            />
            {getFieldError("streetAddress") && (
              <div className="flex items-center gap-2 mt-1 text-red-500">
                <AlertCircle size={16} />
                <span className="text-sm">
                  {getFieldError("streetAddress")}
                </span>
              </div>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Postal code
            </label>
            <input
              type="text"
              id="postalCode"
              placeholder="Postal code"
              className={getInputClassName("postalCode")}
              value={address.postalCode}
              onChange={handleAddressChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
            />
            {getFieldError("postalCode") && (
              <div className="flex items-center gap-2 mt-1 text-red-500">
                <AlertCircle size={16} />
                <span className="text-sm">{getFieldError("postalCode")}</span>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default AddressStep;
