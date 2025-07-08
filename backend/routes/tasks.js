const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending','in-progress','done'], default: 'pending' },
  dueDate: Date,
}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});
router.post('/', async (req, res) => {
  const saved = await new Task(req.body).save();
  res.status(201).json(saved);
});
router.put('/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
