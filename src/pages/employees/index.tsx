import { useState } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { columns } from './EmployeeColumns';
import { useUser } from '@/hooks/useUser';
import { useDebounce, ROLE_LABELS } from '@/lib/utils';

export default function AllEmployeesPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const debouncedSearch = useDebounce('', 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: response, isLoading } = useUser(
    roleFilter,
    '', 
    debouncedSearch, 
    pagination.pageIndex + 1, 
    pagination.pageSize
  );

  const users = response?.data || [];
  const totalPages = response?.pagination?.totalPages || -1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Employees</h1>
            <p className="text-muted-foreground">View and manage employee attendance records across the organization.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border shadow-sm">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchPlaceholder="Search employees by name or email..."
          manualPagination
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={setPagination}
          filterElements={() => (
            <Select onValueChange={(value) => { 
              setRoleFilter(value === 'all' ? '' : value); 
              setPagination(prev => ({...prev, pageIndex: 0})); 
            }}>
              <SelectTrigger className="w-[200px]">
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
          )}
        />
      </div>
    </div>
  );
}
