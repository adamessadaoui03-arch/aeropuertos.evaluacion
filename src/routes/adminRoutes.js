import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';
import { getUserActivityLogs } from '../controllers/adminController.js';

const router = Router();

router.get('/users/:userId/logs', authenticate, authorizeAdmin, getUserActivityLogs);

export default router;