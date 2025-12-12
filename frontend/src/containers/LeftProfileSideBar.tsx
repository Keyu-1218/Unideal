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
    <aside className="flex flex-col gap-9 h-screen border-r-1 border-gray-light p-12">
      <div className="flex gap-4 items-center">
        <UserAvatar label={userEmail} size="md"/>
        <span className="font-bold text-3xl">{name}</span>
      </div>
      <div>
        <div
          className={`w-[229px] h-[46px] text-[14px] flex items-center gap-6 py-4 px-6  rounded-[10px] ${
            isSellingPage ? `bg-background-light` : ""
          }`}
        >
          <Icon name="sell" size={23} />
          <Link to="/profile/sold-and-selling" className="font-bold">
            Selling & Sold Items
          </Link>
        </div>
        <div
          className={`w-[229px] h-[46px] text-[14px] flex items-center gap-6 py-4 px-6  rounded-[10px] ${
            isPurchasedPage ? `bg-background-light` : ""
          }`}
        >
          <Icon name="purchase" size={23} />
          <Link to="/profile/purchased" className="font-bold">
            Purchased items
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default LeftProfileSideBar;
