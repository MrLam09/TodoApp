const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const login = require('./login')
const Task = require('./function');
const { NONAME } = require('dns');


const app = express();
const PORT = 3000;

const viewsPath = path.join(__dirname, '../views');


app.use(bodyParser.json());
app.use(express.static('public'));  
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/main', (req, res) => {
  res.render('main');
});


// Register users
app.post('/signup', async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password
  }

  const existingUser = await login.findOne({ username: data.username });

  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  else{
    try {

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword;

      // Save new user
      const user = await new login(data).save();
      console.log(user);

      res.render('login');
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
  }
})

// Login users
app.post('/login', async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password
  }
  try{
  const user = await login.findOne({ username: data.username });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  else{
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) { 
      return res.status(400).json({ message: 'Invalid password' });
    }
    else{
      res.render('main');
    }}
  } catch (error) {
    res.status(500).json({ message: 'Username or password incorrect' });
  }
})

// POST route to add a task
app.post('/main', async (req, res) => {
  try {

    const task = new Task({ date: req.body.date, task: req.body.task, status: req.body.status });
    console.log(task);
    await task.save();
    res.render('main');

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
