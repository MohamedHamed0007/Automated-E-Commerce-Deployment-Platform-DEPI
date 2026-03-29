import { Chat } from '../../config/DB/Models/Chat/Chat.model';
import { Message } from '../../config/DB/Models/Message/Message.model';
import User from '../../config/DB/Models/User/user.models';

/**
 * Returns all chats with last message, unread count, and user info.
 * Unread count is computed on-the-fly (never stored) to stay accurate.
 */
export const listAllChats = async (page = 1, limit = 20) => {
  return Chat.aggregate([
    // Join messages
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'chat',
        as: 'messages'
      }
    },
    // Join user info for all participants
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participantInfo'
      }
    },
    // Join shipment info
    {
      $lookup: {
        from: 'shipments',
        localField: 'shipmentRef',
        foreignField: '_id',
        as: 'shipmentInfo'
      }
    },
    // Compute derived fields
    {
      $addFields: {
        lastMessage: { $arrayElemAt: [{ $slice: ['$messages', -1] }, 0] },
        unreadCount: {
          $size: {
            $filter: {
              input: '$messages',
              as: 'm',
              cond: { $eq: ['$$m.read', false] }
            }
          }
        },
        totalMessages: { $size: '$messages' },
        shipment: { $arrayElemAt: ['$shipmentInfo', 0] }
      }
    },
    // Remove raw arrays to keep response lean
    {
      $project: {
        messages: 0,
        shipmentInfo: 0,
        'participantInfo.password': 0
      }
    },
    { $sort: { updatedAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]);
};

/**
 * Get a single chat by ID with participant info (admin use).
 */
export const getAdminChatById = async (chatId: string) => {
  const chat = await Chat.findById(chatId)
    .populate('participants', 'name email role')
    .populate('shipmentRef', 'trackingNumber status');

  if (!chat) {
    const err = new Error('Chat not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  // Get unread count for this specific chat
  const unreadCount = await Message.countDocuments({
    chat: chatId,
    read: false
  });

  return { ...chat.toObject(), unreadCount };
};

export const getAllUsersService = async () => {
  return await User.find();
};

export const deleteUserService = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

// export const getAllShipmentsService = async () => {
//   return await Shipment.find();
// };

// export const deleteShipmentService = async (shipmentId: string) => {
//   return await Shipment.findByIdAndDelete(shipmentId);
// };
