import * as React from "react";
import {
  HardDrive,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { LucideIcon } from "lucide-react";

type NavSubItem = {
  title: string;
  url: string;
  roles?: string[];
};

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  roles?: string[];
  items?: NavSubItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type DataType = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  teams: {
    name: string;
    logo: string;
    plan: string;
  }[];
  navGroups: NavGroup[];
};

const data: DataType = {
  user: {
    name: "alghafary",
    email: "rafii.alghafari@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Dexa Group",
      logo: "/image/dexa.png",
      plan: "Enterprise",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Master Data",
          url: "/master-data",
          icon: HardDrive,
          roles: ["SUPER_ADMIN", "ADMIN"],
          items: [
            {
              title: "User Management",
              url: "/master-data/user",
              roles: ["SUPER_ADMIN", "ADMIN"],
            },
            {
              title: "Departement",
              url: "/master-data/departement",
              roles: ["SUPER_ADMIN", "ADMIN"],
            },
          ],
        },
      ],
    },
    {
      title: "Main",
      items: [
        {
          title: "My Attendance",
          url: "/attendance",
          icon: HardDrive,
          roles: ["ADMIN", "EMPLOYEE"],
        },
        {
          title: "All Employees",
          url: "/all-employees",
          icon: HardDrive,
          roles: ["ADMIN"],
        }
      ],
    },
  ],
};

function isNavGroup(obj: unknown): obj is NavGroup {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "title" in obj &&
    "items" in obj &&
    Array.isArray((obj as NavGroup).items)
  );
}

function isNavItem(obj: unknown): obj is NavItem {
  return (
    typeof obj === "object" && obj !== null && "title" in obj && "url" in obj
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.auth.user);

  const currentRole = user?.role ? String(user.role).toUpperCase() : "GUEST";

  const filteredNavGroups: NavGroup[] = React.useMemo(() => {
    return data.navGroups
      .map((group) => {
        const filteredItems = group.items
          .map((item) => {
            // Check roles for main item
            if (item.roles && !item.roles.includes(currentRole)) {
              return null;
            }

            // Filter sub-items if exists
            if (item.items) {
              const filteredSubItems = item.items.filter((subItem) => {
                if (subItem.roles && !subItem.roles.includes(currentRole)) {
                  return false;
                }
                return true;
              });

              if (filteredSubItems.length === 0) {
                return null;
              }

              return { ...item, items: filteredSubItems };
            }

            return item;
          })
          .filter(isNavItem);

        if (filteredItems.length > 0) {
          return { ...group, items: filteredItems };
        }
        return null;
      })
      .filter(isNavGroup);
  }, [currentRole]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map(
          (group) =>
            group && (
              <SidebarGroup key={group.title} className="mb-5">
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <NavMain items={group.items} />
              </SidebarGroup>
            ),
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Guest",
            email: user?.email ?? "guest@example.com",
            role: currentRole ?? "Default",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
