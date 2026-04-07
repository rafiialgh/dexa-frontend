import { z } from "zod";
import type { BaseResponse } from "@/types/response";
import type { GetUserParams, User } from "./user.type";
import { privateInstance } from "@/lib/axios";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  departmentId: z.string().optional(),
});

export const createUserSchema = updateUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;

export const getAllUsers = async (
  params: GetUserParams
): Promise<BaseResponse<User[]>> =>
  privateInstance.get("/user", { params })
    .then((res) => res.data)

export const getUserById = async (id: string): Promise<BaseResponse<User>> =>
  privateInstance.get(`/user/${id}`).then((res) => res.data)

export const createUser = async (
  data: CreateUserValues
): Promise<BaseResponse<User>> =>
  privateInstance.post("/user", data).then((res) => res.data)

export const updateUser = async (
  id: string,
  data: UpdateUserValues
): Promise<BaseResponse<User>> =>
  privateInstance.patch(`/user/${id}`, data).then((res) => res.data)

export const deleteUser = async (id: string): Promise<BaseResponse<void>> =>
  privateInstance.delete(`/user/${id}`).then((res) => res.data)
