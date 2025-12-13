import type { ChangeEvent } from "react";
import Searchbar from "./Searchbar";
import { useSearchParams } from "react-router-dom";

interface RightProfileSideBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RightProfileSideBar = ({
  searchQuery,
  onSearchChange,
}: RightProfileSideBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const name = e.target.id;

    if (isChecked) {
      searchParams.set(name, "true");
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  return (
    <aside className="p-11">
      <div className="flex flex-col items-center gap-6">
        <Searchbar
          size="small"
          variant="outline"
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <div className="w-[218px] h-[143px] bg-background-light rounded-lg">
          <div className="flex flex-col items-start justify-center min-h-[143px] gap-4 px-4">
            {/* Ongoing */}
            <div className="flex gap-2.5 items-center">
              <input
                id="ongoing"
                type="checkbox"
                checked={searchParams.get("ongoing") === "true"}
                className="w-5 h-5 rounded accent-green-dark cursor-pointer"
                onChange={handleInputChange}
              />
              <label
                htmlFor="ongoing"
                className="text-sm font-medium cursor-pointer"
              >
                Ongoing
              </label>
            </div>

            {/* Undibed */}
            <div className="flex gap-2.5 items-center">
              <input
                id="undibed"
                type="checkbox"
                checked={searchParams.get("undibed") === "true"}
                className="w-5 h-5 rounded accent-green-dark cursor-pointer"
                onChange={handleInputChange}
              />
              <label
                htmlFor="undibed"
                className="text-sm font-medium cursor-pointer"
              >
                Undibed
              </label>
            </div>

            {/* Sold */}
            <div className="flex gap-2.5 items-center">
              <input
                id="sold"
                type="checkbox"
                checked={searchParams.get("sold") === "true"}
                className="w-5 h-5 rounded accent-green-dark cursor-pointer"
                onChange={handleInputChange}
              />
              <label
                htmlFor="sold"
                className="text-sm font-medium cursor-pointer"
              >
                Sold
              </label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightProfileSideBar;
