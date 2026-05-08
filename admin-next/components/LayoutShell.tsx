"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { ChatWidget } from "./ChatWidget";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProfile } from "@/store/authSlice";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated, isHydrated } = useAppSelector((s) => s.auth);
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (isLogin) return;
    if (!isHydrated) return;

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    // لو عندنا token بس مش verified → اتحقق من الـ profile
    if (!isAuthenticated) {
      dispatch(getProfile()).unwrap().catch(() => router.replace("/login"));
    }
  }, [isLogin, isHydrated, accessToken, isAuthenticated, dispatch, router]);

  if (isLogin) return <>{children}</>;
  if (!isHydrated) return null;
  if (!accessToken) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <ChatWidget />
    </div>
  );
}
