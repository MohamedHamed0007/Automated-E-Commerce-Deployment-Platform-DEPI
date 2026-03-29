import React, { useState } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

export function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifications = [
    { id: 1, title: 'Shipment Delivered', message: 'Your package #SH-2024-001 has been delivered', time: '5m ago', unread: true },
    { id: 2, title: 'Payment Received', message: 'Payment of $45.00 has been confirmed', time: '1h ago', unread: true },
    { id: 3, title: 'New Offer', message: 'DHL is offering 15% discount this week', time: '3h ago', unread: false },
  ];
  
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="h-full flex items-center justify-between px-8">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments, tracking numbers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <span className="text-sm text-blue-600 cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                JD
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
                <div className="py-2">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a href="/billing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Billing</a>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
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
