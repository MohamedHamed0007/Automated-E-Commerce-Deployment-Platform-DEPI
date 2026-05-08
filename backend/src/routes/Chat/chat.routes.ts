import { authentication, guestOrAuth } from '../../middleware/Auth/auth.middleware';
import { roleMiddleware } from '../../middleware/Role/role.middleware';
import * as chatController from '../../controllers/chat/chat.controller';
import express from 'express';

const router = express.Router();

router.post('/', guestOrAuth, chatController.createChat);
router.get('/', authentication, chatController.getMyChats);
router.get('/all', authentication, roleMiddleware('admin'), chatController.getAllChats);
router.get('/admin-id', authentication, chatController.getAdminId);
router.get('/messages', guestOrAuth, chatController.getChatMessagesByQuery);
router.get('/:chatId', guestOrAuth, chatController.getChatById);
router.get('/:chatId/messages', guestOrAuth, chatController.getChatMessages);
router.post('/messages', guestOrAuth, chatController.sendMessage);
router.post('/send_message', guestOrAuth, chatController.sendMessage);
router.patch('/:chatId/read', guestOrAuth, chatController.markAsRead);

router.patch('/:chatId/close', authentication, roleMiddleware('admin'), chatController.closeChat);

export default router;