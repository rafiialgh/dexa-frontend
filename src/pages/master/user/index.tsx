import { useState } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { columns } from './Column';
import { useUser } from '@/hooks/useUser';
import { useDebounce, ROLE_LABELS } from '@/lib/utils';
import { UserActions } from './UserActions';

export default function UserPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: response, isLoading } = useUser(
    roleFilter,
    statusFilter, 
    debouncedSearch, 
    pagination.pageIndex + 1, 
    pagination.pageSize
  );

  const users = response?.data || [];
  const totalPages = response?.pagination?.totalPages || -1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>
        <UserActions />
      </div>

      <div className="bg-white p-4 border relative">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchPlaceholder="Search users..."
          globalFilter={search}
          onGlobalFilterChange={setSearch}
          manualPagination
          manualFiltering
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={setPagination}
          filterElements={() => (
            <>
              <Select onValueChange={(value) => { 
                setRoleFilter(value === 'all' ? '' : value); 
                setPagination(prev => ({...prev, pageIndex: 0})); 
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => { 
                setStatusFilter(value === 'all' ? '' : value); 
                setPagination(prev => ({...prev, pageIndex: 0})); 
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        />
      </div>
    </div>
  );
}