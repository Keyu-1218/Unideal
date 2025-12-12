import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface SearchButtonProps {
  variant?: "outline" | "filled";
}

const SearchButton = ({ variant = "filled" }: SearchButtonProps) => {
  const buttonVariant =
    variant === "outline" ? "searchOutline" : "searchFilled";
  const iconStrokeWith = variant === "outline" ? 3.5 : 2;

  return (
    <Button
      type="button"
      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full w-11 h-11 p-0 hover:cursor-pointer"
      variant={buttonVariant}
    >
      <Search className="w-[22px] h-[22px]" strokeWidth={iconStrokeWith} />
    </Button>
  );
};

export default SearchButton;
