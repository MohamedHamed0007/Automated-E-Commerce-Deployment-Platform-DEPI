import axiosInstance from "@/lib/axiosInstance";
import { buildInternalApiUrl } from "@/lib/internalApiUrl";
import type { User } from "@/types/User";

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

const ADMIN_USERS_PATH = "/admin/users";

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
  const response = await axiosInstance.get<ApiResponse<User[]> | User[]>(
    buildInternalApiUrl(ADMIN_USERS_PATH)
  );
  return unwrapResponse(response.data);
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User> | User>(
    buildInternalApiUrl(`${ADMIN_USERS_PATH}/${id}`)
  );
  return unwrapResponse(response.data);
};

export const deleteUserById = async (id: string): Promise<string> => {
  await axiosInstance.delete(buildInternalApiUrl(`${ADMIN_USERS_PATH}/${id}`));
  return id;
};
