import SearchButton from "../components/SearchButton";
import { Input } from "../components/ui/input";
import type { ChangeEvent } from "react";

interface SearchbarProps {
  size?: "small" | "medium";
  variant?: "outline" | "filled";
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Searchbar = ({
  size = "medium",
  variant = "filled",
  searchQuery,
  onSearchChange,
}: SearchbarProps) => {
  const styles = size === "medium" ? "w-[290px] h-12" : "w-[218px] h-10";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className={`${styles} relative [&_button]:scale-80 `}>
      <Input
        className="rounded-full h-full w-full text-lg px-6 pr-16"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search products..."
      />
      <SearchButton variant={variant} />
    </div>
  );
};

export default Searchbar;
