import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddProductSchema } from "@/schemas/product.schema";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddProduct } from "@/contexts/add-product/useAddProduct";
import { mapProductDataToApiInput } from "@/services/products/mappers";
import { useCreateProductMutation } from "@/store/productsApi";

const STEPS = [
  { path: "/add-product/title", label: "Title" },
  { path: "/add-product/description", label: "Description" },
  { path: "/add-product/photo", label: "Photos" },
  { path: "/add-product/address", label: "Address" },
  { path: "/add-product/price", label: "Price" },
  { path: "/add-product/dates", label: "Dates" },
];

const AddProductFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, setErrors, clearErrors } = useAddProduct();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const currentStepIndex = STEPS.findIndex(
    (step) => step.path === location.pathname
  );

  const currentStep = currentStepIndex + 1;
  const totalSteps = STEPS.length;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      clearErrors();

      const result = AddProductSchema.safeParse(data);
      if (!result.success) {
        const validationErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const fieldPath = err.path.join(".");
          validationErrors[fieldPath] = err.message;
        });
        setErrors(validationErrors);
        toast.error(
          "Failed to create a product. Please check your form answers."
        );
        return;
      }

      const apiData = mapProductDataToApiInput(data);
      try {
        await createProduct({
          productData: apiData,
          photos: data.photos,
        }).unwrap();

        toast.success("Product created successfully!");
        navigate("/profile");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Failed to create product";
        toast.error(errorMessage);
      }
    } else {
      navigate(STEPS[currentStepIndex + 1].path);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      navigate(STEPS[currentStepIndex - 1].path);
    }
  };

  return (
    <footer className="flex flex-col">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="flex justify-between w-full items-center px-14 pt-4 pb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isFirstStep || isLoading}
          className="text-green-dark text-[22px] hover:cursor-pointer hover:text-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={isLoading}
          className="text-white bg-green-dark hover:text-white text-[20px] hover:bg-green-dark hover:opacity-90 hover:cursor-pointer p-4 w-[129px] h-[52px] rounded-md"
        >
          {isLoading ? "Publishing..." : isLastStep ? "Publish" : "Next"}
        </Button>
      </div>
    </footer>
  );
};

export default AddProductFooter;
