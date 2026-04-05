import { useEffect } from "react";

interface Props {
  notification: any;
  onClose: () => void;
}

const ToastNotification = ({ notification, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50 bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 w-80 animate-slide-in">
      <div className="font-bold text-gray-800 dark:text-white">
        {notification.title}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {notification.message}
      </div>
    </div>
  );
};

export default ToastNotification;