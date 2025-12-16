import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PHOTO_DOWNLOAD_URL } from "@/config/api";

export function ProductCarousel({ photos }: { photos: string[] }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-[618px] h-[618px] bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-lg">No photos available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center">
      <Carousel className="w-full ">
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem
              key={photo}
              className="flex items-center justify-center"
            >
              <Card className="bg-transparent border-none shadow-none h-full flex items-center">
                <CardContent className="flex items-center justify-center p-0 w-full">
                  <img
                    src={`${PHOTO_DOWNLOAD_URL}/${photo}`}
                    alt={`Product image ${index}`}
                    className="object-contain rounded-lg px-12  max-h-[600px]"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 w-[51px] h-[51px] bg-green-dark text-white hover:bg-green-dark hover:opacity-90 hover:text-white" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 w-[51px] h-[51px] bg-green-dark text-white hover:bg-green-dark hover:opacity-90 hover:text-white" />
      </Carousel>
    </div>
  );
}
