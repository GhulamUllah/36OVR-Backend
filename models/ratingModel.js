const mongoose = require('mongoose')


const ratingModel = mongoose.Schema({
   
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
       
        required:true
    }],
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products",
        required:true
    },
    rate:[{
        type:Number,
        required:true
    }]
   
},{timestamps:true})


module.exports = mongoose.model("Rating",ratingModel)