export const API_BASE_URL =
  import.meta.env.VITE_BASE_DEV_URL || "http://localhost:5000";
export const PHOTO_DOWNLOAD_URL = `${API_BASE_URL}/products/photos/download`;
export const PLACEHOLDER_IMAGE_URL = "/icons/placeholder-img.png";
