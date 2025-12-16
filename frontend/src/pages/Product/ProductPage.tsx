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
      <main className="mt-10 pl-20 pr-20 mb-16">
        <div className="flex items-stretch gap-[clamp(16px,5vw,60px)]">
          <div className="flex-1 w-[clamp(420px,40vw,520px)] bg-background-light rounded-lg flex items-center justify-center py-6">
            <ProductCarousel photos={photos} />
          </div>
          <div className="flex-shrink-0">
            <ProductInfoCard product={product} />
          </div>
        </div>
      </main>
    </Container>
  );
};
