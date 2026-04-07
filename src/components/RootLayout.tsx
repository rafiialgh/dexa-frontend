import { Outlet, useLocation, useMatches, useNavigation } from "react-router-dom"
import AppInitializer from "./AppInitializer"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./sidebar/AppSidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import { Badge, badgeVariants } from "@/components/ui/badge"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import type { VariantProps } from "class-variance-authority"
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { formatSnakeCase } from "@/lib/utils";

NProgress.configure({
  showSpinner: false,
  speed: 400,
  easing: 'ease',
  minimum: 0.1,
});

type CrumbMatch = {
  pathname: string;
  handle: {
    breadcrumb: string;
    title?: string;
  };
};

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

function ResetScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const container = document.getElementById('app-scroll');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  const matches = useMatches() as CrumbMatch[];
  const crumbs = matches.filter((m) => m.handle?.breadcrumb);
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);

  const sidebarDefaultOpen = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sidebar_state='))
    ?.split('=')?.[1] !== 'false';

  const roleVariant: Record<string, BadgeVariant> = {
    'Super Admin': 'destructive',
    'Admin': 'secondary',
    'User': 'default',
  };

  const getRoleVariant = (roleName: string): BadgeVariant => roleVariant[roleName] ?? 'default';

  const formattedRole = formatSnakeCase(user?.role);

  useEffect(() => {
    const lastMatch = matches[matches.length - 1];
    document.title = lastMatch?.handle?.title ?? 'Dexa Group App';
  }, [matches]);

  useEffect(() => {
    if (navigation.state === "loading") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return (
    <AppInitializer>
      <SidebarProvider defaultOpen={sidebarDefaultOpen}>
        <AppSidebar />
        <div className='flex flex-col flex-1 overflow-x-hidden'>

            <header className='z-1 flex items-center gap-2 px-4 py-4 h-14 border-b justify-between sticky top-0 bg-white'>
              <div className='flex items-center gap-2'>
                <SidebarTrigger />
                <Breadcrumb>
                  <BreadcrumbList>
                    {crumbs.map((crumb, index) => {
                      const isLast = index === crumbs.length - 1;
                      const isFirst = index === 0;

                      return (
                        <React.Fragment key={crumb.pathname}>
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>{crumb.handle.breadcrumb}</BreadcrumbPage>
                            ) : isFirst ? (
                              <span className='text-muted-foreground'>{crumb.handle.breadcrumb}</span>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link to={crumb.pathname}>{crumb.handle.breadcrumb}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className='flex items-center gap-3'>
                <Badge variant={getRoleVariant(formattedRole)}>{formattedRole}</Badge>
              </div>
            </header>

            <main
              id='app-scroll'
              className='flex-1 p-5 bg-zinc-200/60 '
            >
              <ResetScroll />
              <Outlet />
            </main>
          </div>
      </SidebarProvider>
    </AppInitializer>
  )
}