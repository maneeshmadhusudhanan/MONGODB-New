const express = require('express');
const path= require('path');
const app = express();
const sample=require('./models/vehicledetails')
const dotenv=require('dotenv');
dotenv.config();
const mongoose = require('mongoose')
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

app.get('/vehicle', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'))
})

app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit.html'))
})

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewblog.html'))
})

app.get('/viewallblogs', (req, res) => {
    res.send(blogPosts)
})

app.get('/blog/:id', (req,res) => {
    // const id = req.params.id;
    // const blogs = blogPosts.find((blog) => blog.BlogID == id);
    // if (!blogs) {
    //   return res.status(404).send("Blog not found");
    // }
  
    res.sendFile(path.join(__dirname, 'public', 'viewblog.html'));
})

app.get('/api/blog/:id', async (req,res) => {
    const id = req.params.id;
    const blogs = await sample.findOne({BlogID:id})

    // const blogs = blogPosts.find(blog => blog.BlogID == id);
    // if (!blogs) {
    //     return res.status(404).json({ error: 'Blog not found' });
    // }
    res.json(blogs);
})

app.post('/blog', async (req,res) => {
   try{ 
    const data= req.body;
    const result= await sample.create(data);
    // const newPost = {BlogID, title, author, content };
    // blogPosts.push(newPost);
    // console.log(blogPosts);
    res.redirect('/submitted');
}
catch(error){
    console.log(error);
    res.status(500).json();
}
})

app.listen(3000, () => {
    console.log("The server is starting")
})