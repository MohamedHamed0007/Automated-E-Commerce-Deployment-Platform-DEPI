import { Bell, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Breadcrumb } from "../../components/Breadcrumb";
import toast from "react-hot-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      shipment: true,
      payment: true,
      delivery: true,
      promo: false,
    },
    language: "en",
    currency: "usd",
    timezone: "est",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // تحميل من localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // حفظ الإعدادات
  const handleSave = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully ✅");
  };

  // تغيير الباسورد
  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password updated successfully 🔒");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-6 rounded-xl transition-colors duration-300">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "Settings" },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">
          Manage your account preferences and security
        </p>
      </div>

      {/* Notifications */}
      <Card className="dark:bg-slate-800 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Configure how you receive updates
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: "shipment", label: "Shipment updates" },
            { key: "payment", label: "Payment confirmations" },
            { key: "delivery", label: "Delivery alerts" },
            { key: "promo", label: "Promotional offers" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
            >
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={settings.notifications[item.key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [item.key]: e.target.checked,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="dark:bg-slate-800 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Security</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Update your password
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
          />
          <Input
            type="password"
            label="New Password"
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
          />
          <Input
            type="password"
            label="Confirm Password"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
          />

          <Button onClick={handlePasswordChange}>
            Update Password
          </Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="dark:bg-slate-800 dark:border-slate-600 space-y-4">
        <Select
          label="Language"
          value={settings.language}
          onChange={(e) =>
            setSettings({ ...settings, language: e.target.value })
          }
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" },
          ]}
        />

        <Select
          label="Currency"
          value={settings.currency}
          onChange={(e) =>
            setSettings({ ...settings, currency: e.target.value })
          }
          options={[
            { value: "usd", label: "USD ($)" },
            { value: "eur", label: "EUR (€)" },
            { value: "gbp", label: "GBP (£)" },
          ]}
        />

        <Select
          label="Timezone"
          value={settings.timezone}
          onChange={(e) =>
            setSettings({ ...settings, timezone: e.target.value })
          }
          options={[
            { value: "est", label: "Eastern Time (ET)" },
            { value: "cst", label: "Central Time (CT)" },
            { value: "pst", label: "Pacific Time (PT)" },
          ]}
        />
      </Card>

      {/* Save Button */}
      <Button className="w-full" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  );
}