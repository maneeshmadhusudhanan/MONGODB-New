const {Schema}= require('mongoose');
const {model}=require('mongoose');

const favouriteSchema = new Schema({
    title: String,
    image: String,
    recipeId: String
  }, { _id: false });
  

const cookschema=new Schema({
    username: {type: String,required: true,unique: true},
    
    email: {type: String,required: true,unique: true},
    
    password: {type: String,required: true},
    
    favourites: {type: [favouriteSchema ],default: []}
})

const cookbookmodel=model("recipedetails",cookschema);
module.exports=cookbookmodel;