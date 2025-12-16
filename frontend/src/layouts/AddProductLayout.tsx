import AddProductFooter from "@/containers/AddProductFooter";
import Header from "@/containers/Header";
import { AddProductProvider } from "@/contexts/add-product/AddProductProvider";
import { Outlet } from "react-router-dom";

const AddProductLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AddProductProvider>
        <main className="flex-1 mx-auto container px-6 py-8 overflow-y-auto flex flex-col items-center justify-center">
          <Outlet />
        </main>
        <AddProductFooter />
      </AddProductProvider>
    </div>
  );
};

export default AddProductLayout;
