import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, Sun, Moon } from 'lucide-react';

export function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // إضافة State للتحكم في الـ Theme
  const [isDark, setIsDark] = useState(false);

  // تبديل الكلاس في عنصر الـ html الأساسي
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const notifications = [
    { id: 1, title: 'Shipment Delivered', message: 'Your package #SH-2024-001 has been delivered', time: '5m ago', unread: true },
    { id: 2, title: 'Payment Received', message: 'Payment of $45.00 has been confirmed', time: '1h ago', unread: true },
    { id: 3, title: 'New Offer', message: 'DHL is offering 15% discount this week', time: '3h ago', unread: false },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 transition-colors duration-300">
      <div className="h-full flex items-center justify-between px-8">
        
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments, tracking numbers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-semibold dark:text-white">Notifications</h3>
                  <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                        n.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                AI
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">ahmed ibrahim</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ahmedsadey5454@gmail.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <p className="font-medium text-gray-900 dark:text-gray-100">ahmed ibrahim</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ahmedsadey5454@gmail.com</p>
                </div>
                <div className="py-2">
                  <a href="#p" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Profile</a>
                  <a href="#s" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Settings</a>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 py-2">
                  <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}