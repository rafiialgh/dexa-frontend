import { useState, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserDetail, useUpdateUser, useDeleteUser } from "@/hooks/useUser";
import { useDepartments } from "@/hooks/useDepartment";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/services/user/user.type";
import { ROLE_LABELS } from "@/lib/utils";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  departmentId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface ActionColumnProps {
  user: User;
}

export function ActionColumn({ user }: ActionColumnProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserSheet
        id={user.id}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ConfirmDeleteDialog
        id={user.id}
        name={user.name}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

function EditUserSheet({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: detailResponse, isLoading: isFetching } = useUserDetail(id, open);
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (detailResponse?.data) {
      reset({
        name: detailResponse.data.name,
        email: detailResponse.data.email,
        role: detailResponse.data.role,
        departmentId: detailResponse.data.departmentId || "none",
      });
    }
  }, [detailResponse, reset]);

  const onSubmit = (data: UserFormValues) => {
    const submissionData = {
      ...data,
      departmentId: data.departmentId === "none" ? undefined : data.departmentId
    };

    updateUserMutation.mutate(
      { id, data: submissionData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update user information here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        {isFetching ? (
          <div className="grid gap-4 py-4 px-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 px-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dept">Department</Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => {
                  const { data: deptResponse, isLoading: isLoadingDepts } = useDepartments("", 1, 100);
                  const departments = deptResponse?.data || [];
                  
                  return (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="edit-dept">
                        <SelectValue placeholder={isLoadingDepts ? "Loading departments..." : "Select a department"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Department</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
            <SheetFooter className="mt-4">
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ConfirmDeleteDialog({
  id,
  name,
  open,
  onOpenChange,
}: {
  id: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteMutation = useDeleteUser();

  const handleConfirm = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Delete User"
      description={`Are you sure you want to delete user "${name}"? This action cannot be undone.`}
      confirmText="Delete"
      loading={deleteMutation.isPending}
      loadingText="Deleting..."
      variant="destructive"
    />
  );
}
