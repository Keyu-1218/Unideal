import { type Product } from "@/store/productsApi";
import { PHOTO_DOWNLOAD_URL, PLACEHOLDER_IMAGE_URL } from "@/config/api";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const firstPhoto = product?.photos?.[0];

  const imageUrl = firstPhoto
    ? `${PHOTO_DOWNLOAD_URL}/${firstPhoto}`
    : PLACEHOLDER_IMAGE_URL;

  if (!product) return <p>Error loading product</p>;

  return (
    <div className="w-[224px] rounded-lg bg-white box-border shadow transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden rounded-md w-full h-[281px] relative">
          <img
            src={imageUrl}
            alt={`${product.title} image`}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute z-10 top-0.5 left-0.5 rounded-sm p-1 text-[14px] font-bold text-white bg-green-light">
            Pick up from {product.pickup.date.available_from}
          </div>
          <div className="absolute bottom-5 left-3 text-green-dark bg-gray-light p-1 px-2.5 rounded-2xl font-semibold">
            €{product.price}
          </div>
        </div>

        <div className="p-3 flex flex-col gap-1">
          {" "}
          <span className="text-sm font-semibold mb-1 text-[20px]">
            {product.title}
          </span>
          <span className="text-xs text-gray-500 text-[16px]">
            {product.pickup.address.city}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
