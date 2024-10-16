const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://todoapp:lampro123@cluster0.03anq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  date: String,
  task: String,
  status: String,
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());
app.use(express.static('public'));  

// POST route to add a task
app.post('/add-task', async (req, res) => {
  try {
    const task = new Task({ date: req.body.date, task: req.body.task, status: req.body.status });
    await task.save();
    res.json({ message: 'Task saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving task' });
  }
});

// GET route to fetch tasks
app.get('/get-tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// DELETE route to delete a task by ID
app.delete('/delete-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId); 
    res.json({ message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// GET route to search tasks by name
app.get('/search-task', async (req, res) => {
  try {
    const searchQuery = req.query.name;
    const tasks = await Task.find({ task: { $regex: searchQuery, $options: 'i' } }); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error searching tasks' });
  }
});

// PUT route to update a task by ID
app.put('/update-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTask = req.body.task;
    await Task.findByIdAndUpdate(taskId, { task: updatedTask });
    res.json({ message: 'Task updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// PUT route to update a date by ID
app.put('/update-date/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedDate = req.body.date;
    await Task.findByIdAndUpdate(taskId, { date: updatedDate });
    res.json({ message: 'Date updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating date' });
  }
});

// PUT route to update status by ID
app.put('/update-status/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedSTT = req.body.status;
    await Task.findByIdAndUpdate(taskId, { status: updatedSTT });
    res.json({ message: 'Status updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
