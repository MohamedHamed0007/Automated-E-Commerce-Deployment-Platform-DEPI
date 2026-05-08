import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  BarChart3,
  MapPin,
  Settings,
  HelpCircle,
  FileText,
  User,
  Crown,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hookredux";
import { toggleTheme } from "../redux/themeRedux/themeSlice";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  // الـ pattern اللي بنشوف بيه الـ active بدل startsWith العمياء
  matchPattern?: RegExp;
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [isOpen, setIsOpen] = useState(false);

  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [shipmentId, setShipmentId] = useState<string | null>(null);

  // نحدّث الـ state لما localStorage يتغير (مثلاً بعد الدفع)
  useEffect(() => {
    const syncFromStorage = () => {
      setTrackingNumber(localStorage.getItem("lastTrackingNumber"));
      setShipmentId(localStorage.getItem("lastShipmentId"));
    };

    syncFromStorage();

    // نسمع على storage event عشان لو اتغير من tab تاني
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  // نحدّث بعد كل navigation عشان نلتقط التغييرات اللي حصلت في نفس الـ tab
  useEffect(() => {
    setTrackingNumber(localStorage.getItem("lastTrackingNumber"));
    setShipmentId(localStorage.getItem("lastShipmentId"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/user",
      icon: LayoutDashboard,
      // exact match بس
      matchPattern: /^\/user$/,
    },
    {
      name: "New Shipment",
      href: "/user/newshipment",
      icon: Package,
      matchPattern: /^\/user\/newshipment/,
    },
    ...(shipmentId
      ? [
          {
            name: "Compare Prices",
            href: `/user/compare/${shipmentId}`,
            icon: BarChart3,
            matchPattern: /^\/user\/compare/,
          } as NavItem,
        ]
      : []),
    ...(trackingNumber
      ? [
          {
            name: "Track Shipment",
            href: `/user/tracking/${trackingNumber}`,
            icon: MapPin,
            matchPattern: /^\/user\/tracking/,
          } as NavItem,
        ]
      : []),
    {
      name: "Shipment History",
      href: "/user/history",
      icon: FileText,
      matchPattern: /^\/user\/history/,
    },
    {
      name: "Profile",
      href: "/user/profile",
      icon: User,
      matchPattern: /^\/user\/profile/,
    },
    {
      name: "Subscription",
      href: "/user/subscription",
      icon: Crown,
      matchPattern: /^\/user\/subscription/,
    },
    {
      name: "Settings",
      href: "/user/settings",
      icon: Settings,
      matchPattern: /^\/user\/settings/,
    },
    {
      name: "Help Center",
      href: "/user/help",
      icon: HelpCircle,
      matchPattern: /^\/user\/help/,
    },
  ];

  const isActive = (item: NavItem) => {
    if (item.matchPattern) return item.matchPattern.test(location.pathname);
    return location.pathname === item.href;
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-50 dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            <span className="ml-2 text-xl font-bold text-blue-600">
              ShipSphere
            </span>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item);

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                      active
                        ? "bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Dark/Light Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mb-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-600/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}