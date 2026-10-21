import { Router } from 'express';
import {
  createTask, deleteTask, getTask, listTasks, updateTask, updateTaskStatus
} from '../controllers/taskController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
