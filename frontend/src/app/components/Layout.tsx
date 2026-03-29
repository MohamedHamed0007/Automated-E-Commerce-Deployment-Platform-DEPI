import React from 'react';
import { Outlet } from 'react-router';
// import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function Layout() {
  return (
    /* 1. أضفنا dark:bg-gray-950 لتغيير خلفية الصفحة بالكامل
       2. أضفنا dark:text-gray-100 لتغيير لون النص الافتراضي
       3. أضفنا transition-colors لجعل الانتقال ناعماً بين الوضعين
    */
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      <TopNav />

      {/* تأكد أن الـ main أيضاً يأخذ في الاعتبار الـ Dark mode 
          إذا كان هناك أي حدود (borders) أو خلفيات فرعية
      */}
      <main className="ml-64 mt-16 p-8">
        <div className="max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}