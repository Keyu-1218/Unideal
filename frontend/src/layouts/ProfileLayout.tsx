import LeftProfileSideBar from "@/containers/LeftProfileSideBar";
import RightProfileSideBar from "@/containers/RightProfileSideBar";
import type { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex">
      <LeftProfileSideBar userEmail={user?.email} />
      <Outlet context={{ searchQuery }} />
      <RightProfileSideBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default ProfileLayout;
