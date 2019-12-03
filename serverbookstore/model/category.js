const mongoose=require('mongoose')

const categorySchema= new mongoose.Schema({

    name:String,
    Book_id:[{type:mongoose.Types.ObjectId}]
})
module.exports=mongoose.model("category",categorySchema)

