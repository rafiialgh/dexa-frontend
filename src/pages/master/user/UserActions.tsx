import { useState } from "react";
import { Plus, Upload, FileText } from "lucide-react";
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
import { useCreateUser, useBulkRegisterUser } from "@/hooks/useUser";
import { useDepartments } from "@/hooks/useDepartment";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserValues } from "@/services/user/user.service";
import { ROLE_LABELS } from "@/lib/utils";

export function UserActions() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <AddUserSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      <BulkRegisterSheet open={isBulkOpen} onOpenChange={setIsBulkOpen} />
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
      departmentId: "",
    },
  });

  const onSubmit = (data: CreateUserValues) => {
    // Convert "none" or empty string to undefined if needed by your API
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="add-role">
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
            <Label htmlFor="add-dept">Department</Label>
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => {
                const { data: deptResponse, isLoading: isLoadingDepts } = useDepartments("", 1, 100);
                const departments = deptResponse?.data || [];
                
                return (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                );
              }}
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

function BulkRegisterSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const bulkRegisterMutation = useBulkRegisterUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    bulkRegisterMutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFile(null);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Register
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Bulk User Registration</SheetTitle>
          <SheetDescription>
            Upload an Excel (.xlsx, .xls) or CSV file to register multiple users at once.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4 py-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25  p-10 gap-4">
            <div className="bg-primary/10 p-4 ">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {file ? file.name : "Select a file to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: .csv, .xlsx, .xls
              </p>
            </div>
            <Input
              id="bulk-file"
              type="file"
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            <Button
              variant="secondary"
              onClick={() => document.getElementById("bulk-file")?.click()}
              className="w-full"
            >
              Choose File
            </Button>
          </div>
          <SheetFooter className="mt-4">
            <Button
              onClick={handleUpload}
              disabled={!file || bulkRegisterMutation.isPending}
              className="w-full"
            >
              {bulkRegisterMutation.isPending ? "Uploading..." : "Upload & Register"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
