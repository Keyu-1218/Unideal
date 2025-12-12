import { useGetProductsQuery } from "@/store/productsApi";
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import ProfileProductCard from "@/components/ProfileProductCard";
import AddProductCard from "@/components/AddProductCard";

interface OutletContext {
  searchQuery: string;
}

const SoldProfileSection = () => {
  const { searchQuery } = useOutletContext<OutletContext>();

  const { data, isLoading, error } = useGetProductsQuery({ owned: true });
  const products = data?.products || [];

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

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading your products</p>;

  return (
    <div className="flex-1">
      <main className="grid grid-cols-4 p-11 gap-x-11 gap-y-16">
        {/* Add new product card */}
        <AddProductCard />

        {/* Filtered product cards */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProfileProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-3 flex items-center justify-center h-64">
            <p className="text-gray-400">
              {searchQuery ? "No products found" : "No products yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SoldProfileSection;
