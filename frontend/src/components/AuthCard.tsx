import { type ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="max-w-md w-full rounded-2xl p-8 text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      {children}
    </div>
  );
};

export default AuthCard;
