import { createBrowserRouter, Navigate } from "react-router-dom";
import { globalRoutes } from "@/router/modules/global.routes";
import RootLayout from "@/components/RootLayout";
import { adminRoutes } from "./modules/admin.routes";

import ProtectedRoutes from "@/components/ProtectedRoutes";

export const router = createBrowserRouter([
    ...globalRoutes,
    {
        element: <RootLayout />,
        children: [
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/attendance" replace />,
                    },
                    ...adminRoutes,
                ]
            }
        ]
    }
]);