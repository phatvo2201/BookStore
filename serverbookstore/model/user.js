const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({

    username:String,
    password:String,
    name:String,
    email:String,
    radom:String,
    active:String
    //permission

})  
module.exports=mongoose.model("User",userSchema)

