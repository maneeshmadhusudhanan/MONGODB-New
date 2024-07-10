const express = require('express');

const path = require('path');

const loginroute = express.Router();


loginroute.use(express.json())

loginroute.use(express.urlencoded({extended:false}))

loginroute.use(express.static(path.join(__dirname, '../../public')))



const mongoose=require('mongoose');
// const url=process.env.mongodb_uri;
mongoose.connect(
    "mongodb://localhost:27017/CookBook_DB"
)

const database=mongoose.connection;
database.on("error",(error)=>
{
    console.log(error)
});
database.once("connected",()=>
{
    console.log("database connected");
})



const cookdb=require('../../models/cookBook')


loginroute.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/static', 'signup.html'))
})

loginroute.post('/signup', async(req, res) => {
    const {username, email, password} = req.body;
    const newuser={username, email, password, favourites: [] } 
    try{
        const exist=await cookdb.findOne({username:username})
        if(exist){
            res.send("User already exists. Click login")
        }else{
            // cookdb[username]= {email: email, password: password, favourites: []}
            const data=await cookdb.create(newuser)
            req.session.username = username;
            req.session.favourites = data.favourites;
            res.redirect('/home');
        }
      
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }

    
})

loginroute.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/static', 'login.html'))
})

loginroute.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await cookdb.findOne({ username: username });
      if (!user) {
        return res.send("Invalid username or password. Please signup first");
      }
  
      if (user.password === password) { // In a real-world scenario, you should hash and compare passwords
        req.session.username = username;
        req.session.favourites = user.favourites;
        return res.redirect('/home');
      } else {
        return res.send("Invalid username or password. Please signup first");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });



loginroute.post('/add/favourites', async(req,res) => {
    const {title, image, recipeId} = req.body;

    const username = req.session.username;
try {
    const user = await cookdb.findOne({ username: username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.favourites.push({ title, image, recipeId });
    await user.save();

    req.session.favourites = user.favourites; // Update session with new favourites
    
    res.json({ message: 'Recipe added to favourites' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

loginroute.get('/api/favourite', async (req, res) => {
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).send('User not logged in');
    }
  
    try {
      const user = await cookdb.findOne({ username: username });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.json(user.favourites);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

loginroute.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

module.exports = loginroute