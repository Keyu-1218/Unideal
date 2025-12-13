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
    <div className="relative w-[618px] h-[675px] rounded-lg bg-background-light flex items-center justify-center overflow-hidden">
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full ">
          {photos.map((photo, index) => (
            <CarouselItem
              key={photo}
              className="flex items-center justify-center"
            >
              <Card className="bg-transparent border-none shadow-none h-full">
                <CardContent className="flex items-center justify-center p-0 h-full">
                  <img
                    src={`${PHOTO_DOWNLOAD_URL}/${photo}`}
                    alt={`Product image ${index}`}
                    className="w-[464px] h-[618px] object-contain rounded-lg"
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
