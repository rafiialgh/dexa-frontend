import { useState } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { columns } from './Column';
import { useDepartments } from '@/hooks/useDepartment';
import { useDebounce } from '@/lib/utils';
import { DepartmentActions } from './DepartmentActions';

export default function DepartmentPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: response, isLoading } = useDepartments(
    debouncedSearch, 
    pagination.pageIndex + 1, 
    pagination.pageSize
  );

  const departments = response?.data || [];
  const totalPages = response?.pagination?.totalPages || -1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Department Management</h1>
            <p className="text-muted-foreground">Manage organization departments and their descriptions.</p>
          </div>
        </div>
        <DepartmentActions />
      </div>

      <div className="bg-white p-4 border shadow-sm">
        <DataTable
          columns={columns}
          data={departments}
          isLoading={isLoading}
          searchPlaceholder="Search departments..."
          globalFilter={search}
          onGlobalFilterChange={setSearch}
          manualPagination
          manualFiltering
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  );
}
