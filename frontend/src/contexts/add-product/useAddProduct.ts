import { useContext } from "react";
import { AddProductContext } from "./AddProductContext";

export const useAddProduct = () => {
  const context = useContext(AddProductContext);
  if (!context) {
    throw new Error("useAddProduct must be used within AddProductProvider");
  }
  return context;
};
