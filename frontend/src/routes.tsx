import Home from "./pages/Home/Home";
import Conversation from "./pages/Conversation/Conversation";
import NotFound from "./pages/NotFound.tsx/NotFound";
import { Navigate, type RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import Auth from "./pages/Auth/Auth";
import AuthLayout from "./layouts/AuthLayout";
import { ProductPage } from "./pages/Product/ProductPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AddProductLayout from "./layouts/AddProductLayout";
import SoldProfileSection from "./pages/Profile/SoldProfileSection";
import PurchasedProfileSection from "./pages/Profile/PurchasedProfileSection";
import TitleStep from "./pages/AddProduct/TitleStep";
import DescriptionStep from "./pages/AddProduct/DescriptionStep";
import PhotoStep from "./pages/AddProduct/PhotoStep";
import AddressStep from "./pages/AddProduct/AddressStep";
import PriceStep from "./pages/AddProduct/PriceStep";
import DatesStep from "./pages/AddProduct/DatesStep";
import ProfileLayout from "./layouts/ProfileLayout";
import ChatPageLayout from "./layouts/ChatPageLayout";
import EmptyChat from "./components/Conversation/EmptyChat";

export const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Auth /> },
          { path: "sign-in", element: <SignIn /> },
          { path: "sign-up", element: <SignUp /> },
        ],
      },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/product/:id", element: <ProductPage /> },

          {
            path: "/chat",
            element: <ChatPageLayout />,
            children: [
              { index: true, element: <EmptyChat /> },
              { path: ":conversationId", element: <Conversation /> },
            ],
          },

          {
            path: "/profile",
            element: <ProfileLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/profile/sold-and-selling" replace />,
              },
              { path: "sold-and-selling", element: <SoldProfileSection /> },
              { path: "purchased", element: <PurchasedProfileSection /> },
            ],
          },
        ],
      },
      {
        path: "/add-product",
        element: <AddProductLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/add-product/title" replace />,
          },
          { path: "title", element: <TitleStep /> },
          { path: "description", element: <DescriptionStep /> },
          { path: "photo", element: <PhotoStep /> },
          { path: "address", element: <AddressStep /> },
          { path: "price", element: <PriceStep /> },
          { path: "dates", element: <DatesStep /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
