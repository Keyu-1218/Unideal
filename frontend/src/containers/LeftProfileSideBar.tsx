import Icon from "@/components/Icon";
import UserAvatar from "@/components/UserAvatar";
import { Link, useLocation } from "react-router-dom";

const LeftProfileSideBar = ({ userEmail }: { userEmail: string }) => {
  const firstName = userEmail.split(/[@.]/)[0];
  const name = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const location = useLocation();
  const isSellingPage = location.pathname === "/profile/sold-and-selling";
  const isPurchasedPage = location.pathname === "/profile/purchased";

  return (
    <aside
      className="flex flex-col gap-9 h-screen border-r-1 border-gray-light py-6 pr-4"
      style={{ paddingLeft: "max(3.5rem, calc((100vw - 1400px) / 2))" }}
    >
      <div className="flex gap-4 items-center">
        <UserAvatar label={userEmail} size="pr"/>
        <span className="font-bold text-xl">{name}</span>
      </div>
      <div>
        <div
          className={`w-[220px] h-[46px] text-[12px] flex items-center gap-4 py-4 px-4  rounded-[10px] ${
            isSellingPage ? `bg-background-light` : ""
          }`}
        >
          <Icon name="sell" size={20} />
          <Link to="/profile/sold-and-selling" className="font-bold whitespace-nowrap">
            Selling & Sold Items
          </Link>
        </div>
        <div
          className={`w-[220px] h-[46px] text-[12px] flex items-center gap-4 py-4 px-4  rounded-[10px] ${
            isPurchasedPage ? `bg-background-light` : ""
          }`}
        >
          <Icon name="purchase" size={20} />
          <Link to="/profile/purchased" className="font-bold whitespace-nowrap">
            Purchased items
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default LeftProfileSideBar;
