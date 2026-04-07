import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { useCreateUser } from "@/hooks/useUser";
import { useDepartments } from "@/hooks/useDepartment";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserValues } from "@/services/user/user.service";
import { ROLE_LABELS } from "@/lib/utils";

export function UserActions() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <AddUserSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}

function AddUserSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createUserMutation = useCreateUser();
  const { data: deptResponse, isLoading: isLoadingDepts } = useDepartments("", 1, 100);
  const departments = deptResponse?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
      departmentId: "none",
    },
  });

  const onSubmit = (data: CreateUserValues) => {
    const submissionData = {
      ...data,
      departmentId: data.departmentId === "none" ? undefined : data.departmentId
    };

    createUserMutation.mutate(submissionData, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Create a new user account. Fill in all the details below.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 px-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-name">Name</Label>
            <Input id="add-name" {...register("name")} placeholder="Enter name" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-email">Email</Label>
            <Input id="add-email" type="email" {...register("email")} placeholder="Enter email" />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-password">Password</Label>
            <Input id="add-password" type="password" {...register("password")} placeholder="Enter password" />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-role">Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || "EMPLOYEE"}>
                  <SelectTrigger id="add-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS)
                      .filter(([role]) => role !== "SUPER_ADMIN")
                      .map(([value, label]) => (
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
            <Label htmlFor="add-dept">Department</Label>
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <Select key={`add-dept-${departments.length}`} onValueChange={field.onChange} value={field.value || "none"}>
                  <SelectTrigger id="add-dept">
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
              )}
            />
          </div>
          <SheetFooter className="mt-4">
            <Button type="submit" disabled={createUserMutation.isPending} className="w-full">
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}