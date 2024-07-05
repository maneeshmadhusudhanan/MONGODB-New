const {Schema}= require('mongoose');
const {model}=require('mongoose');
const demo=new Schema({
    emp_id:{type:Number,required:true},
    emp_name:{type:String,required:true},
    emp_role:{type:String,required:true},
    doj:{type:String,required:true},
});
const empDetails=model ('Emp_details',demo)
module.exports=empDetails;