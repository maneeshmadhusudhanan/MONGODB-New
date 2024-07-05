const express = require('express');
const mongoose = require('mongoose');
const sample=require('./models/empDetails')
const dotenv=require('dotenv');
dotenv.config();
const app = express();
const path= require('path');
const uri=process.env.mongodb_uri;
mongoose.connect(uri);
const database = mongoose.connection;
database.on("error",(error) => {
    console.log(error);
});
database.once("connected", () =>{
    console.log("database connected");
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/addemployee', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_employee.html'))
})

app.get('/thankyou', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thankyou.html'))
})

app.get('/update_emp', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update_emp.html'))
})

app.get('/employee/:id', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'view_employee.html'));
})

app.get('/api/employee/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const details = await sample.findOne({ emp_id: id });
        if (!details) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/employee/:id', async(req, res) => {
    try{
    const id = req.params.id;
    const del=await sample.findByIdAndDelete(id);
    console.log(del);
    if (del) {
        res.status(200).json({message:'Deleted successfully'})
    }
    else{
        res.status(404).json({message:'document not found'})
    }
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
});
app.post('/employee', async(req, res) => {
    const data=req.body;
    const details=await sample.create(data)
    res.status(200).redirect('/thankyou')
   
});
port=3002;
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});