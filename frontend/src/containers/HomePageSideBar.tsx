import FilterHomePage from "./FilterHomePage";
import Searchbar from "./Searchbar";

interface HomePageSideBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const HomePageSideBar = ({
  searchQuery,
  onSearchChange,
}: HomePageSideBarProps) => {
  return (
    <aside className="flex flex-col gap-4 sticky top-6 self-start">
      <Searchbar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <FilterHomePage />
    </aside>
  );
};
