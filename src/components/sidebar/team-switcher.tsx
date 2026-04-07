import * as React from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: string | React.ElementType;
    plan: string;
  }[];
}) {
  const [activeTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`
            text-sidebar-primary-foreground ml-2 group-data-[collapsible=icon]:ml-0
            flex aspect-square size-14 items-center justify-center
            transition-all duration-200
            group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:border
          `}
        >
          {typeof activeTeam.logo === 'string' ? (
            <Link to={'/'}>
              <img
                src={activeTeam.logo}
                alt={activeTeam.name}
                className={`
                object-contain transition-all duration-200
                size-14 group-data-[collapsible=icon]:size-3
              `}
              />
            </Link>
          ) : (
            <activeTeam.logo className='size-4 group-data-[collapsible=icon]:size-3 transition-all duration-200' />
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
