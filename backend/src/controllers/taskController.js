import Task from '../models/Task.js';
import User from '../models/User.js';

const taskQueryForUser = (user) => ({
  $or: [{ createdBy: user._id }, { assignedTo: user._id }]
});

const canAccessTask = (task, user) => user.role === 'admin'
  || task.createdBy.equals(user._id)
  || task.assignedTo?.equals(user._id);

export const listTasks = async (req, res, next) => {
  try {
    const { status, priority, search, assignedTo } = req.query;
    const filters = req.user.role === 'admin' ? {} : taskQueryForUser(req.user);
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assignedTo) filters.assignedTo = assignedTo;
    if (search) filters.$text = { $search: search };

    const tasks = await Task.find(filters)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title is required' });

    if (assignedTo) {
      const assignee = await User.findOne({ _id: assignedTo, isActive: true });
      if (!assignee) return res.status(400).json({ success: false, message: 'Assigned user was not found' });
    }

    const task = await Task.create({
      title: title.trim(), description, priority, dueDate, assignedTo: assignedTo || null, createdBy: req.user._id
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!canAccessTask(task, req.user)) return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && !task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the creator or an admin can edit this task' });
    }

    const allowed = ['title', 'description', 'priority', 'dueDate', 'assignedTo', 'status'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && !task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the creator or an admin can delete this task' });
    }
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!canAccessTask(task, req.user)) return res.status(403).json({ success: false, message: 'Access denied' });
    if (!['todo', 'in_progress', 'completed', 'rejected'].includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid task status' });
    }
    task.status = req.body.status;
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};
