const mongoose = require('mongoose')


const deleteModel = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    orders:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",

    },
    favourites:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Favourite",

    },
    products:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",

    },
},{timestamps:true})

module.exports = mongoose.model("DeleteRec",deleteModel)