import { ProductCarousel } from "@/components/ProductCarousel";
import { Spinner } from "@/components/ui/spinner";
import Container from "@/components/Сontainer";
import ProductInfoCard from "@/containers/ProductInfoCard";
import { useGetProductsQuery } from "@/store/productsApi";
import { useParams } from "react-router-dom";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetProductsQuery();

  const products = data?.products;
  const product = products?.find((p) => p.id === Number(id));

  console.log("product FROM PRODUCT PAGE", product);

  if (isProductsLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="w-10 h-10" />
      </div>
    );
  if (productsError || !product) return <p>Error loading product</p>;

  const { photos } = product;

  return (
    <Container>
      <main className="mt-16 px-8">
        <div className="flex justify-between gap-16">
          <div className="max-w-[618px]">
            <ProductCarousel photos={photos} />
          </div>
          <ProductInfoCard product={product} />
        </div>
      </main>
    </Container>
  );
};
