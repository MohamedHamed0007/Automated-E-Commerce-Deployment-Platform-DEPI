import { Router } from 'express';
import { authentication } from '../../middleware/Auth/auth.middleware';
import { roleMiddleware } from '../../middleware/Role/role.middleware';
import { validateObjectId } from '../../middleware/Validate/validate.middleware';
import * as adminCtrl from '../../controllers/admin/admin.controller';

const router = Router();

// All admin routes require authentication + admin role
router.use(authentication);
router.use(roleMiddleware('admin'));

// GET /admin/chats — list all chats with unread count
router.get('/chats', adminCtrl.getAllChats);

// GET /admin/chats/:chatId — single chat detail
router.get('/chats/:chatId', validateObjectId('chatId'), adminCtrl.getChatById);

export default router;
