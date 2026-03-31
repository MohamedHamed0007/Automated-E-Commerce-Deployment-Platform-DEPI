"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/StatusBadge";
import { createChatForUser } from "@/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers } from "@/store/usersSlice";
import type { User } from "@/types/User";

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      {initials}
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users, loadingUsers, error } = useAppSelector((state) => state.users);
  const { creatingChat } = useAppSelector((state) => state.chat);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const query = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const name = getDisplayName(user).toLowerCase();
    const email = user.email.toLowerCase();

    return !query || name.includes(query) || email.includes(query);
  });

  const handleStartChat = async (user: User) => {
    const result = await dispatch(
      createChatForUser({
        userId: user._id || user.id,
        participantName: getDisplayName(user),
        participantEmail: user.email,
        name: getDisplayName(user),
        email: user.email,
      })
    );

    if (createChatForUser.fulfilled.match(result)) {
      router.push("/chat");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-0.5 text-sm text-gray-500">{users.length} registered</p>
        </div>

        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={getUserKey(user)}
                  className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Initials name={getDisplayName(user)} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getDisplayName(user)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.phone ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.role ?? "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getStatusLabel(user)} variant={getStatusVariant(user)} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt ?? user.joinedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleStartChat(user)}
                      disabled={creatingChat}
                      className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-950/20"
                    >
                      {creatingChat ? "Creating..." : "Start chat"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getUserKey(user: User) {
  return user._id || user.id || user.email;
}

function getDisplayName(user: User) {
  return user.fullName || user.name || user.email;
}

function getStatusLabel(user: User) {
  if (user.status) {
    return user.status;
  }

  if (typeof user.isActive === "boolean") {
    return user.isActive ? "Active" : "Inactive";
  }

  return "Unknown";
}

function getStatusVariant(user: User): "success" | "warning" | "danger" {
  const status = getStatusLabel(user).toLowerCase();

  if (status === "active") {
    return "success";
  }

  if (status === "banned" || status === "blocked" || status === "suspended") {
    return "danger";
  }

  return "warning";
}

function formatDate(date?: string) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
}
