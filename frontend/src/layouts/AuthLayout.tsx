import AuthCard from "@/components/AuthCard";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard>
        <Outlet />
      </AuthCard>
    </div>
  );
};

export default AuthLayout;
