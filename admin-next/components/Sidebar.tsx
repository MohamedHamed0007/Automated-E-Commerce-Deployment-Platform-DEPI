"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  DollarSign,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Shipments", href: "/shipments",  icon: Package         },
  { label: "Users",     href: "/users",      icon: Users           },
  { label: "Chats",     href: "/chat",       icon: MessageSquare   },
  { label: "Couriers",  href: "/couriers",   icon: Truck           },
  { label: "Revenue",   href: "/revenue",    icon: DollarSign      },
  { label: "Settings",  href: "/settings",   icon: Settings        },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <aside className="w-56 h-screen flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <p className="font-semibold text-gray-900 dark:text-white">ShipSphere</p>
        <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <ThemeToggle />
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
