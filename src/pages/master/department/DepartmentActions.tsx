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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  createDepartmentSchema, 
  type CreateDepartmentValues 
} from "@/services/department/department.service";
import { useCreateDepartment } from "@/hooks/useDepartment";

export function DepartmentActions() {
  const [isOpen, setIsOpen] = useState(false);
  const createDepartmentMutation = useCreateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = (data: CreateDepartmentValues) => {
    createDepartmentMutation.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="h-9 px-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Add New Department</SheetTitle>
          <SheetDescription>
            Create a new department in the organization.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 px-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-name">Name</Label>
            <Input id="add-name" {...register("name")} placeholder="Enter department name" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-code">Code</Label>
            <Input id="add-code" {...register("code")} placeholder="Enter department code" />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>
          <SheetFooter className="mt-4">
            <Button type="submit" disabled={createDepartmentMutation.isPending} className="w-full">
              {createDepartmentMutation.isPending ? "Creating..." : "Create Department"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
