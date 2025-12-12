import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (token && user) {
    return <Outlet />;
  }

  return <Navigate to="/auth" replace />;
};

export default PrivateRoute;
