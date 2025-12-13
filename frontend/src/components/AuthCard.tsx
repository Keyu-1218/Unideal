import { type ReactNode } from "react";
import Icon from "./Icon";

type AuthCardProps = {
  children: ReactNode;
};

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="max-w-md w-full rounded-2xl p-8 text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center -mb-8 gap-1.5 items-center">
        <Icon name="logo" />
        <div>
          <span className="text-green-dark font-logo text-[30px] font-bold leading-none">
            uni
          </span>
          <span className="text-green-light font-logo text-[30px] font-bold leading-none">
            deal
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
