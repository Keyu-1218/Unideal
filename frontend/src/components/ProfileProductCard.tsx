import { PHOTO_DOWNLOAD_URL, PLACEHOLDER_IMAGE_URL } from "@/config/api";
import type { Product } from "@/store/productsApi";
import { Link } from "react-router-dom";

const ProfileProductCard = ({ product }: { product: Product }) => {
  const firstPhoto = product?.photos[0];

  const imageUrl = firstPhoto
    ? `${PHOTO_DOWNLOAD_URL}/${product.photos[0]}`
    : PLACEHOLDER_IMAGE_URL;

  return (
    <div className="w-[180px] flex flex-col gap-[9px]  transition-all duration-300 ease-in-out hover:scale-105 hover:rounded-2xl hover:cursor-pointer">
      <Link to={`/product/${product.id}`}>
        <div className="w-full h-[180px] relative rounded-2xl overflow-hidden">
          <img
            src={imageUrl}
            alt={`${product.title} photo`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-5 left-3 text-green-dark bg-gray-light p-1 px-2.5 rounded-2xl font-semibold">
            €{product.price}
          </div>
        </div>
        <p className="text-left font-bold text-[14px] mt-2.5">{product.title}</p>
      </Link>
    </div>
  );
};

export default ProfileProductCard;
