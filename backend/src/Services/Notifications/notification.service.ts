import { Notification, NotificationType } from '../../config/DB/Models/Notification/Notification.model';
import { getIO } from '../../config/Socket/socketio.instance';

interface SendNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export const sendNotification = async (input: SendNotificationInput) => {
  const { userId, type, title, message } = input;

  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    read: false,
  });


  try {
    const io = getIO();
    io.to(`user:${userId}`).emit('notification:new', {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
    });
  } catch (err) {
    console.error('❌ Notification socket error:', err);
  }

  return notification;
};


export const getUserNotifications = async (userId: string) => {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);
};

// ✅ mark as read
export const markNotificationRead = async (notificationId: string, userId: string) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

// ✅ mark all as read
export const markAllNotificationsRead = async (userId: string) => {
  await Notification.updateMany({ userId, read: false }, { read: true });
};