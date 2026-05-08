import axiosInstance from "@/lib/axiosInstance";
import type { User } from "@/types/User";

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

const ADMIN_USERS_PATH = "/admin/users";

// الفانكشن دي ممتازة سيبها زي ما هي
const unwrapResponse = <T>(payload: T | ApiResponse<T>): T => {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }
  return payload as T;
};

export const getUsers = async (): Promise<User[]> => {
  // 🔥 التعديل هنا: شلنا buildInternalApiUrl واستخدمنا المسار مباشرة
  const response = await axiosInstance.get<ApiResponse<User[]> | User[]>(
    ADMIN_USERS_PATH 
  );
  return unwrapResponse(response.data);
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User> | User>(
    `${ADMIN_USERS_PATH}/${id}`
  );
  return unwrapResponse(response.data);
};

export const deleteUserById = async (id: string): Promise<string> => {
  await axiosInstance.delete(`${ADMIN_USERS_PATH}/${id}`);
  return id;
};