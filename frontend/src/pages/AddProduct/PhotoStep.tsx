import { useRef, useState, useEffect, type ChangeEvent } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import { useAddProduct } from "@/contexts/add-product/useAddProduct";

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

const MAX_PHOTOS = 5;

const PhotoStep = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateData, errors, clearFieldError } = useAddProduct();
  const error = errors["photos"];

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles].slice(0, MAX_PHOTOS));
    if (error) {
      clearFieldError("photos");
    }
  };

  const handleFileDelete = (id: string) => {
    setFiles((prev) =>
      prev.filter(
        (file) => `${file.name}-${file.size}-${file.lastModified}` !== id
      )
    );
  };

  useEffect(() => {
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${file.lastModified}`,
    }));
    setImages(newPreviews);

    return () => {
      newPreviews.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [files]);

  useEffect(() => {
    updateData("photos", files);
  }, [files, updateData]);

  const totalSlots = Array.from({ length: MAX_PHOTOS }, (_, i) => {
    const img = images[i];
    return img || null;
  });

  return (
    <div className="w-[clamp(520px,56vw,680px)]">
      <div className="flex items-start justify-between mb-[clamp(12px,3vh,20px)]">
        <div>
          <h2 className="text-[30px] font-bold">How does it look like?</h2>
          <p className="text-[18px] text-text-gray">Add up to 5 photos.</p>
        </div>
        <div>
          <button
            className="rounded-full h-12 w-12 bg-background-gray text-green-dark hover:cursor-pointer flex items-center justify-center shadow-sm"
            onClick={() => inputRef.current?.click()}
            aria-label="Add photos"
            title="Add photos"
          >
            <Plus size={28} />
          </button>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 auto-rows-[clamp(120px,22vh,200px)]">
        <div
          className="bg-gray-100 rounded-lg border border-dashed border-gray-400 flex items-center justify-center 
             row-span-2 relative group"
        >
            {totalSlots[0] ? (
              <>
                <img
                  src={totalSlots[0].preview}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleFileDelete(totalSlots[0].id)}
                  className="absolute top-2 right-2 rounded-full bg-red-600 text-white hover:cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1"
                >
                  <X />
                </button>
              </>
            ) : (
              <span className="text-gray-400 font-semibold text-sm">Cover Photo</span>
            )}
        </div>

        {totalSlots.slice(1).map((img, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg border border-dashed border-gray-400 flex items-center justify-center relative group"
          >
            {img ? (
              <>
                <img
                  src={img.preview}
                  alt={`Photo ${i + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleFileDelete(img.id)}
                  className="absolute top-2 right-2 rounded-full bg-red-600 text-white hover:cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1"
                >
                  <X />
                </button>
              </>
            ) : (
              <span className="text-gray-400 font-semibold text-sm">
                Photo {i + 2}
              </span>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-500 rounded-md text-red-600 animate-slideDown">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PhotoStep;
