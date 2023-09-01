const mongoose = require('mongoose')
const { schema } = require('./catageryModel')
const favouriteSchema = new mongoose.Schema({
    favourite:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products",
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
})

module.exports = mongoose.model("Favourite",favouriteSchema)