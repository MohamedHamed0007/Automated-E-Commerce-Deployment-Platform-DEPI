import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { deleteUserById, getUserById, getUsers } from "@/services/Users";
import type { User } from "@/types/User";

interface UsersState {
  users: User[];
  currentUser: User | null;
  loadingUsers: boolean;
  loadingCurrentUser: boolean;
  deletingUserId: string | null;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loadingUsers: false,
  loadingCurrentUser: false,
  deletingUserId: null,
  error: null,
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch users"));
    }
  }
);

export const fetchUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/fetchUserById", async (id, { rejectWithValue }) => {
  try {
    return await getUserById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch user"));
  }
});

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteUserById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete user"));
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload ?? "Failed to fetch users";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loadingCurrentUser = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loadingCurrentUser = false;
        state.error = null;
        state.currentUser = action.payload;

        const existingUserIndex = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (existingUserIndex >= 0) {
          state.users[existingUserIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadingCurrentUser = false;
        state.error = action.payload ?? "Failed to fetch user";
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingUserId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deletingUserId = null;
        state.error = null;
        state.users = state.users.filter((user) => user._id !== action.payload);

        if (state.currentUser?._id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deletingUserId = null;
        state.error = action.payload ?? "Failed to delete user";
      });
  },
});

export const { clearCurrentUser, clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
