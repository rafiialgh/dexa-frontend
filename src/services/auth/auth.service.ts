import { z } from "zod";
import { globalInstance, privateInstance } from "../../lib/axios";
import type { BaseResponse } from "../../types/response";
import type { LoginResponse } from "./auth.type";

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const getMe = async (): Promise<BaseResponse<LoginResponse>> =>
  privateInstance.get('/auth/me').then((res) => res.data)

export const refreshToken = async (): Promise<{ data: { accessToken: string, refreshToken: string } }> =>
  globalInstance.post('/auth/refresh-token').then((res) => res.data);

export const login = async (
  data: LoginValues
): Promise<BaseResponse<LoginResponse>> =>
  globalInstance.post('/auth/login', data).then((res) => res.data);

export const logout = async (): Promise<BaseResponse<any>> =>
  privateInstance.post('/auth/logout').then((res) => res.data);