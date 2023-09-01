const Rating = require('../models/ratingModel')

// Get All Rated Products
const getAllRatedProducts = async(req,res)=>{
    try {
        const data = await Rating.find()
        if(data){
            res.status(200).send({success:true,data:data})
        }
        else{
            res.status(200).send({success:false,message:"Cannot Load Rated Products...! Please Try Again"})
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}



// Get User Rated Products
const getuserRatedProducts = async(req,res)=>{
    try {
        const data = await Rating.find({user:req.user._id})
        if(data){
            res.status(200).send({success:true,data:data})
        }
        else{
            res.status(200).send({success:false,message:"Cannot Load Rated Products...! Please Try Again"})
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}
// Get User Rated Products
const deleteRating = async(req,res)=>{
    if(!req.params.id) res.status(200).send({success:false,message:"Product is Required"})
    else try {
        const data = await Rating.find({user:req.user._id} && {product:req.params.id})
        if(data){
            const deldata = await Rating.findOneAndDelete({product:req.params.id})
            res.status(200).send({success:true,message:"Rating Has been Deleted Successfully",data:deldata})
        }
        else{
            res.status(200).send({success:false,message:"Unable to Delete Rating...! Please Try Again"})
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}


// Add Rating To Product
const addRating = async(req,res)=>{
    const {rate} = req.body
    if(!rate) res.status(200).send({success:false,message:"Rating is Required"})
    else if(!req.params.id) res.status(200).send({success:false,message:"Product is Required"})
    else try {

        const data = await Rating.findOne({product:req.params.id})
        if(data){
            if(data.user.length > 0 && !data.user.includes(req.user._id)){
                const updateRating = await Rating.findOneAndUpdate({product:req.params.id},{$set:{rate:[...data.rate,rate],user:[...data.user,req.user._id]}},{new:true})
                res.status(200).send({success:true,message:"Rating Added Successfully",data:updateRating})

            }
            else if(data.user.includes(req.user._id)){
                const index = data.user.findIndex(p=> p.toString() === req.user._id.toString())
                await data.rate.splice(index,1,rate)
                const updateRating = await Rating.findOneAndUpdate({product:req.params.id},{$set:{rate:data.rate}},{new:true})
                res.status(200).send({success:true,message:"Rating Updated Successfully",data:updateRating})
            }
            else{
                console.log(data)
                const updateRating = await Rating.findOneAndUpdate({product:req.params.id},{$set:{rate:[...data.rate,rate],user:[...data.user,req.user._id]}},{new:true})
                res.status(200).send({success:true,message:"Rating Added Successfully",data:updateRating})
            }

           
        }
        else{
             const rating = await Rating({
                user:req.user._id,
                product:req.params.id,
                rate:rate
             })
             await rating.save()
             console.log(rating)
            res.status(200).send({success:true,message:"Product Rated Successfully",data:rating})
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}


module.exports = {
    getAllRatedProducts,
    getuserRatedProducts,
    addRating,
    deleteRating
}