import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "@/services/user/user.type";
import { ActionColumn } from "./ActionColumn";
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
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      const department = row.original.department;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-zinc-900">{department?.name || "-"}</span>
          {department?.code && (
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              {department.code}
            </span>
          )}
        </div>
      );
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
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to={`/master-data/user/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <ActionColumn user={row.original} />
      </div>
    ),
  },
];