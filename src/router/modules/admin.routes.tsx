import { type RouteObject } from "react-router-dom";
import EmptyLayout from "@/components/EmptyLayout";
import UserPage from "@/pages/master/user";
import MyAttendancePage from "@/pages/attendance";
import AllEmployeesPage from "@/pages/employees";
import EmployeeAttendancePage from "@/pages/employees/EmployeeAttendance";
import DepartmentPage from "@/pages/master/department";
import ProtectedRoutes from "@/components/ProtectedRoutes";

export const adminRoutes: RouteObject[] = [
    {
        path: "attendance",
        element: <MyAttendancePage />,
        handle: { breadcrumb: "My Attendance" },
    },
    {
        path: "all-employees",
        element: <ProtectedRoutes allowedRoles={["ADMIN"]} />,
        handle: { breadcrumb: "All Employees" },
        children: [
            {
                index: true,
                element: <AllEmployeesPage />,
            },
            {
                path: ":id",
                element: <EmployeeAttendancePage />,
                handle: { breadcrumb: "Employee Attendance" },
            },
        ],
    },
    {
        path: "master-data",
        element: <ProtectedRoutes allowedRoles={["SUPER_ADMIN", "ADMIN"]} />,
        handle: { breadcrumb: "Master Data" },
        children: [
            {
                path: "user",
                element: <EmptyLayout />,
                children: [
                    {
                        index: true,
                        element: <UserPage />,
                        handle: { breadcrumb: "User" },
                    },
                ],
            },
            {
                path: "departement",
                element: <DepartmentPage />,
                handle: { breadcrumb: "Departement" },
            },
        ],
    },
];