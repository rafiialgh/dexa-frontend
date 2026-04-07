
import { type RouteObject } from "react-router-dom";
import LoginPage from "@/pages/auth/login";

export const globalRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
]