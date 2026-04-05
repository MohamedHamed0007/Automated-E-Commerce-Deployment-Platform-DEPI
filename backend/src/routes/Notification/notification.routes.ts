import { Router } from 'express';
import { authentication } from '../../middleware/Auth/auth.middleware';
import * as notificationCtrl from '../../controllers/Notification/notification.controller';

const router = Router();

router.get('/', authentication, notificationCtrl.getMyNotifications);
router.patch('/:id/read', authentication, notificationCtrl.markAsRead);
router.patch('/read-all', authentication, notificationCtrl.markAllAsRead);

export default router;