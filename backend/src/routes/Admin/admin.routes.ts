import { Router } from 'express';
import { roleMiddleware } from '../../middleware/Role/role.middleware';
import { validateObjectId } from '../../middleware/Validate/validate.middleware';
import * as adminCtrl from '../../controllers/admin/admin.controller';
import { authentication, isAdmin } from '../../middleware/Auth/auth.middleware';
import { getUsers, removeUser } from '../../controllers/admin/admin.controller';
// import { getShipments, removeShipment } from '../../controllers/admin/admin.controller';
const router = Router();

// All admin routes require authentication + admin role
router.use(authentication);
router.use(roleMiddleware('admin'));

// GET /admin/chats — list all chats with unread count
router.get('/chats', adminCtrl.getAllChats);

// GET /admin/chats/:chatId — single chat detail
router.get('/chats/:chatId', validateObjectId('chatId'), adminCtrl.getChatById);

// User routes
router.get('/users', authentication, isAdmin, getUsers);
router.delete('/users/:id', authentication, isAdmin, removeUser);

// Shipment routes
// router.get('/shipments', authenticate, isAdmin, getShipments);
// router.delete('/shipments/:id', authenticate, isAdmin, removeShipment);

export default router;
