import { type ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="max-w-[1388px] mx-auto w-full">{children}</div>;
};

export default Container;
