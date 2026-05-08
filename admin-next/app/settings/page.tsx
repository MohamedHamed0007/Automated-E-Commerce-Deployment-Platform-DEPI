"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Setting {
  key: string;
  label: string;
  description: string;
  value: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([
    { key: "emailAlerts",    label: "Email alerts",         description: "Send email on new shipment or status change", value: true  },
    { key: "delayAlerts",    label: "Delay notifications",  description: "Alert admin when a shipment is delayed",      value: true  },
    { key: "newUserAlerts",  label: "New user alerts",      description: "Notify on every new user registration",       value: false },
    { key: "autoAssign",     label: "Auto-assign couriers", description: "Automatically assign cheapest courier",       value: false },
    { key: "maintenanceMode",label: "Maintenance mode",     description: "Disable ShipSphere for regular users",        value: false },
  ]);

  const [apiUrl,    setApiUrl]    = useState("http://localhost:3000/api");
  const [adminName, setAdminName] = useState("Admin");
  const [saved,     setSaved]     = useState(false);

  const toggle = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: !s.value } : s))
    );
  };

  const handleSave = () => {
    // TODO: POST /api/admin/settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform configuration</p>
      </div>

      {/* General */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">General</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Admin name</label>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              API base URL
              <span className="ml-2 text-blue-500"></span>
            </label>
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Appearance</p>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Notifications & Features */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Notifications & features</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {settings.map((s) => (
            <div key={s.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">{s.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
              </div>
              <button
                onClick={() => toggle(s.key)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  s.value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  s.value ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {saved ? "Saved!" : "Save changes"}
      </button>
    </div>
  );
}