const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const sample =  require('./Models/create.js')

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();
const url = process.env.mongodb_uri;
mongoose.connect(  "mongodb://localhost:27017/TO-DO-LIST-DATAB"
    
);

const database = mongoose.connection;
database.on("error", (error) =>{
    console.log(error)
});
database.once("connected", () =>{
    console.log("Database Connected");
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'home.html'));
});

app.get('/task', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'task.html'));
});

app.post('/success',async(req, res) => {
    try{
        const data=req.body;
        console.log(data)
        const details=await sample.create(data);
        res.status(201).redirect('./success');
    }
    catch(error){
        console.log(error);
        res.status(500).json();
    }
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'success.html'));
});

app.get('/task/:id', (req, res) => {
    // const id = req.params.id;
    // const task = tasks.find(task => task.id === parseInt(id));
    // if (!task) {
    //     return res.status(404).send('Task not found');
    // }
    res.sendFile(path.join(__dirname, 'Public', 'task.html'));
});



app.get('/updateTask/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'updateTask.html'));
});



// app.get('/api/tasks', (req, res) => {
//     res.json(tasks);
// });
app.get('/api/tasks', async (req, res) => {
    try {
        // Fetch all tasks from the MongoDB database
        const tasks = await sample.find();
        // Return the tasks as JSON
        res.json(tasks);
        console.log(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.get('/api/task/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const details = await sample.findOne({ id: id });
        console.log("details",details);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});



app.put('/api/task/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    try {
        const updatedTask = await sample.findOneAndUpdate(
            { id: id },
            { title, description },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

app.delete('/api/task/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTask = await sample.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(3009, () => {
    console.log("Server is running on port 3009");
});