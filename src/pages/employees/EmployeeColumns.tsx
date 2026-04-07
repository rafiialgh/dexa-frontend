import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "@/services/user/user.type";
import { formatSnakeCase } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      return formatSnakeCase(row.getValue('role') as string);
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
          {formatSnakeCase(status)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Attendance',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 h-8" asChild>
          <Link to={`/all-employees/${row.original.id}`}>
            <Eye className="h-3.5 w-3.5" />
            View History
          </Link>
        </Button>
      </div>
    ),
  },
];
