import ProductCard from "@/components/ProductCard";
import { HomePageSideBar } from "./HomePageSideBar";
import { useGetProductsQuery } from "@/store/productsApi";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "react-router-dom";
import ProductsNotFound from "@/pages/ProductsNotFound.tsx/ProductsNotFound";
import { useState, useMemo } from "react";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries());
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, error } =
    useGetProductsQuery(queryParams);

  const products = data?.products ?? [];

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      return (
        product.title.toLowerCase().includes(query) ||
        product.short_description?.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-10 h-10" color="#3b5d4f" />
      </div>
    );
  }

  if (error) {
    return <p>Error loading products</p>;
  }

  return (
    <div className="grid grid-cols-[minmax(625px,5fr)_minmax(250px,2fr)] gap-16 relative">
      <div className="flex-1 relative">
        {isFetching && (
          <div className="absolute inset-0 flex justify-center bg-white/60 backdrop-blur-sm z-20">
            <Spinner className="w-10 h-10 absolute z-99" color="#3b5d4f" />
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <ProductsNotFound />
        )}
      </div>

      <HomePageSideBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default ProductList;
