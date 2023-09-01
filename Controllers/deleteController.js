const mongoose = require('mongoose')
const DeleteRec = require('../models/deleteModel')



const getalluserDelRec = async(req,res)=>{
    try {
        const delrec = await DeleteRec.aggregate([
            {$match:{
                user:mongoose.Types.ObjectId(req.user._id)
            }},
            {
                $lookup:{
                    from:"users",
                    localField:"user",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"products",
                    foreignField:"_id",
                    as:"products"
                }
            },
            {
                $lookup:{
                    from:"favourites",
                    localField:"favourites",
                    foreignField:"_id",
                    as:"favourites"
                }
            },
            {
                $lookup:{
                    from:"orders",
                    localField:"orders",
                    foreignField:"_id",
                    as:"orders"
                }
            },
        ])
        res.status(200).send({success:true,data:delrec})
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}


const getallDelRec = async(req,res)=>{
    try {
        const delrec = await DeleteRec.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"user",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"products",
                    foreignField:"_id",
                    as:"products"
                }
            },
            {
                $lookup:{
                    from:"favourites",
                    localField:"favourites",
                    foreignField:"_id",
                    as:"favourites"
                }
            },
            {
                $lookup:{
                    from:"orders",
                    localField:"orders",
                    foreignField:"_id",
                    as:"orders"
                }
            },
        ])
        res.status(200).send({success:true,data:delrec})
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}

module.exports = {
    getallDelRec,
    getalluserDelRec
}