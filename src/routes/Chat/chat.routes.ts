import { authentication } from '../../middleware/Auth/auth.middleware';
import { roleMiddleware } from '../../middleware/Role/role.middleware';
import * as chatController from '../../controllers/chat/chat.controller';
import express from 'express';

const router = express.Router();

router.post('/', authentication, chatController.createChat);
router.get('/', authentication, chatController.getMyChats);
router.get('/all', authentication, roleMiddleware('admin'), chatController.getAllChats);
router.get('/:chatId', authentication, chatController.getChatById);
router.get('/:chatId/messages', authentication, chatController.getChatMessages);
router.post('/messages', authentication, chatController.sendMessage);

router.patch('/:chatId/read', authentication, chatController.markAsRead);

router.patch('/:chatId/close', authentication, roleMiddleware('admin'), chatController.closeChat);

export default router;