import { Bell, Lock } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Breadcrumb } from '../../components/Breadcrumb';
import toast from 'react-hot-toast';

import type { RootState } from '../../redux/store';

export default function Settings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [settings, setSettings] = useState({
    notifications: {
      shipment: true,
      payment: true,
      delivery: true,
      promo: false
    },
    language: 'en',
    currency: 'usd',
    timezone: 'est'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Settings updated successfully ✅');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

const handlePasswordChange = async () => {
  if (!passwords.current || !passwords.new || !passwords.confirm) {
    toast.error('Please fill all password fields');
    return;
  }

  if (passwords.new === passwords.current) {
    toast.error('New password must be different from the current one');
    return;
  }

  if (passwords.new !== passwords.confirm) {
    toast.error('Passwords do not match');
    return;
  }

  if (!token) {
    toast.error('Session expired. Please login again.');
    return;
  }

  try {
    setIsChangingPassword(true);

    const response = await fetch('http://localhost:3000/api/v1/user/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: passwords.current,
        newPassword: passwords.new
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update password');
    }

    toast.success('Password updated successfully 🔒');
    setPasswords({ current: '', new: '', confirm: '' });
  } catch (error: any) {
    toast.error(error.message || 'Something went wrong, please try again.');
  } finally {
    setIsChangingPassword(false);
  }
};

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-6 rounded-xl transition-colors duration-300">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/user' }, { label: 'Settings' }]} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">
          Manage your account preferences and security
        </p>
      </div>

      {/* Notifications Section */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 shadow-sm border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Configure how you receive updates
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'shipment', label: 'Shipment updates' },
            { key: 'payment', label: 'Payment confirmations' },
            { key: 'delivery', label: 'Delivery alerts' },
            { key: 'promo', label: 'Promotional offers' }
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all"
            >
              <span className="font-medium">{item.label}</span>
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, [item.key]: e.target.checked }
                  }))
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security Section (Change Password) */}
      <Card className="dark:bg-slate-800 dark:border-slate-600 space-y-5 p-6 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Update your password security
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            labelClassName="text-gray-700 dark:text-slate-200 font-medium"
          />
          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            labelClassName="text-gray-700 dark:text-slate-200 font-medium"
          />
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            labelClassName="text-gray-700 dark:text-slate-200 font-medium"
          />

          <Button
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-red-600/20"
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 shadow-sm border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Language"
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ar', label: 'العربية' },
              { value: 'es', label: 'Spanish' }
            ]}
          />
          <Select
            label="Currency"
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            options={[
              { value: 'usd', label: 'USD ($)' },
              { value: 'eur', label: 'EUR (€)' },
              { value: 'egp', label: 'EGP (ج.م)' }
            ]}
          />
          <Select
            label="Timezone"
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            options={[
              { value: 'est', label: 'Eastern Time' },
              { value: 'cat', label: 'Cairo Time (CAT)' },
              { value: 'gmt', label: 'GMT' }
            ]}
          />
        </div>
      </Card>

      <Button
        className="w-full h-12 rounded-xl font-black text-lg shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-transform"
        onClick={handleSaveSettings}
        disabled={isSavingSettings}
      >
        {isSavingSettings ? 'Saving...' : 'Save All Preferences'}
      </Button>
    </div>
  );
}
