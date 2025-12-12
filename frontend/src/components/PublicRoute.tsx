import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default PublicRoute;
