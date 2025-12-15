import { type Product } from "@/store/productsApi";
import { PHOTO_DOWNLOAD_URL, PLACEHOLDER_IMAGE_URL } from "@/config/api";
import { Link, useSearchParams } from "react-router-dom";
import { getTravelInfo } from "@/helpers/mockTravelData";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const firstPhoto = product?.photos?.[0];
  const [searchParams] = useSearchParams();

  const imageUrl = firstPhoto
    ? `${PHOTO_DOWNLOAD_URL}/${firstPhoto}`
    : PLACEHOLDER_IMAGE_URL;

  const location = searchParams.get("location");
  const haveCar = searchParams.get("haveCar") === "true";
  const travelDistance = searchParams.get("travelDistance");
  const travelInfo = location ? getTravelInfo(product.id, haveCar) : null;

  // Filtering logic: if travelDistance is set, only show products within that distance
  if (travelDistance && travelInfo) {
    const maxDistance = Number(travelDistance);
    if (travelInfo.time > maxDistance) {
      return null; // Don't render this product
    }
  }

  if (!product) return <p>Error loading product</p>;

  const formatMinutes = (m: number) => {
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return `${h}h${mm}min`;
    }
    return `${m}min`;
  };

  return (
    <div className="w-full box-border transition-transform duration-300 ease-in-out hover:scale-105">
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden rounded-lg w-full aspect-[4/5] relative">
          <img
            src={imageUrl}
            alt={`${product.title} image`}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute bottom-5 left-3 text-green-dark bg-gray-light p-1 px-2.5 rounded-2xl font-semibold">
            €{product.price}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-0.5">
          <span className="font-semibold text-base">
            {product.title}
          </span>
          <span className="text-xs text-gray-500">
            {product.pickup.address.city}
          </span>
          {travelInfo && location && (
            <span className="text-xs text-green-dark font-semibold mt-1">
              {formatMinutes(travelInfo.time)} · {travelInfo.transport}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;