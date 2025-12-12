import { useSearchParams } from "react-router-dom";

const ProductsNotFound = () => {
  const [, setSearchParams] = useSearchParams(); 

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-full">
      <h2 className="text-3xl font-semibold text-center">
        {" "}
        Sorry, no products match your criteria.
      </h2>
      <button
        onClick={() => setSearchParams({})}
        className="px-6 py-3 bg-green-dark font-bold text-white rounded-md"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductsNotFound;
