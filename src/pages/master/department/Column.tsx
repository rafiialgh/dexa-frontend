import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import type { Department } from "@/services/department/department.type";
import { ActionColumn } from "./ActionColumn";

export const columns: ColumnDef<Department, any>[] = [
  {
    accessorKey: "name",
    header: "Department Name",
    cell: ({ row }) => (
      <div className="font-medium text-zinc-900">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono bg-zinc-50 uppercase">
        {row.getValue("code")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionColumn department={row.original} />,
  },
];
