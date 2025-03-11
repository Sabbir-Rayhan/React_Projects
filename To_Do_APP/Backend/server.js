const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./todo');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));


// Create a new task
app.post('/create', async (req, res) => {
    const text = req.body.task;
    try {
        await Todo.create({ text });
        res.json({ success: true, message: 'Added Task Successfully' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to add task' });
    }
});

// Get all tasks (sorted by latest)
app.get('/alltask', async (req, res) => {
    try {
        //const data = await Todo.find().sort({ date: -1 }); // Ensures latest tasks appear first
        const data = await Todo.find().sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to fetch tasks' });
    }
});


// Update task completion status
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    try {
        await Todo.findByIdAndUpdate(id, { completed });
        res.json({ success: true, message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/delete/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted Task' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to delete task' });
    }
});

// Edit a task (Update text)
app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    
    try {
        await Todo.findByIdAndUpdate(id, { text });
        res.json({ success: true, message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to update task' });
    }
});


// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
