import { useSearchParams } from "react-router-dom";

const ProductsNotFound = () => {
  const [, setSearchParams] = useSearchParams(); 

  return (
    <div className="flex items-center justify-center flex-col gap-8 h-full">
      <h2 className="text-2xl font-normal text-center">
        {" "}
        Sorry, no products match your criteria.
      </h2>
      <button
        onClick={() => setSearchParams({})}
        className="px-6 py-3 bg-green-dark font-semibold text-white rounded-lg"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductsNotFound;
