'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLogout } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

export function NavUser({user}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}) {
  const { isMobile } = useSidebar();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  function getAvatarColor(name: string) {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-amber-100 text-amber-700',
      'bg-emerald-100 text-emerald-700',
      'bg-violet-100 text-violet-700',
    ];
    const index = name.charCodeAt(1) % colors.length;
    return colors[index];
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-9 w-9 shadow-sm ring-1 ring-border/40'>
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback
                    className={`${getAvatarColor(user.name)} font-semibold`}
                  >
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-9 w-9 shadow-sm ring-1 ring-border/40'>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback
                      className={`${getAvatarColor(user.name)} font-semibold`}
                    >
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Badge
                  variant='outline'
                  className='absolute -bottom-1 -right-1 text-[10px] font-medium px-1.5 py-0.5'
                ></Badge>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut />
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}