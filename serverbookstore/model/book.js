const mongoose=require('mongoose')

const BookSchema= new mongoose.Schema({
    name:String,

    image:String,
    file:String
})
module.exports=mongoose.model("Book",BookSchema)

