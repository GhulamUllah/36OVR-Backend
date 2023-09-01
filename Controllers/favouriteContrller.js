const Favourite = require('../models/favouriteModel')
const Product = require('../models/productModel')
const DeleteRec = require('../models/deleteModel')

// User Favorite
const getuserFavourite = async (req, res) => {
    if (!req.user) res.status(200).send({ success: false, message: "Login First to Access this Api" })
   else try {
        const favItems = await Favourite.find({ user: req.user._id }).populate(["favourite", "user"])
        console.log(favItems)
        res.status(200).send({ success: true, message: "Favourite Item Details", data: favItems })

    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}

// Get all fovourites
const getallFavourite = async (req, res) => {
 if(req.admin){
    try {
        const alluserdata = await Favourite.find().populate(["favourite", "user"])
        if (alluserdata) {
            res.status(200).send({ success: true, data: alluserdata })
        }
        else {
            res.status(200).send({ success: true, message: "Cannot Load Favourite Items" })

        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
 }
 else{
    res.status(400).send({success:false,message:"Only Admin Can Access this Api"})
 }
}


// add Favourite Item
const addFavourite = async (req, res) => {
    try {
        const { favourite } = req.body
        const favdata = await Favourite.find({ user: req.user._id })
        if (favdata.length > 0) {
            let check = false
            for (let i = 0; i < favdata.length; i++) {
                console.log("In for Loop")

                const data = favdata[i]
                if (data['favourite'].toString() === favourite) {
                    check=true
                    res.status(200).send({ success: false, message: "Product Already in Favourite List" })
                    break;
                }
               
            }
            if(check === false) {

                const myfav = await new Favourite({
                    favourite: favourite,
                    user: req.user._id
                })
                console.log(myfav)

                await myfav.save()
                const resfav = await Favourite.findOne({ favourite: favourite }).populate("favourite")

            res.status(200).send({ success: true, message: 'Added to Favourites', data: resfav })
                
            }

        }
        else {

            const myfav = await Favourite({
                favourite: favourite,
                user: req.user._id
            })
            console.log(myfav)

            await myfav.save()
            const resfav = await Favourite.findOne({ favourite: favourite }).populate("favourite")

            res.status(200).send({ success: true, message: 'Added to Favourites', data: resfav })
        }
    } catch (error) {

        res.status(400).send({ success: false, message: error.message })
    }
}

//Remove From Favorite List

const removeFavorite = async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(200).send({ success: false, message: "Favourite id is Mandatory" })
    }
    else {
        try {
            const deldata = await Favourite.findOneAndDelete({ favourite: id })
            console.log(deldata)
            if (deldata) {
             res.status(200).send({success:false,message:"Removed from favourites"})
            }
            else {
                res.status(200).send({ success: false, message: "Something Went Wrong, Please Try again" })
            }
        } catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }
}

// User Favourite Delete Record getting Logic is mensioned Below

const getuserdelFav = async(req,res)=>{
    const data = await Favourite.find({user:req.user})
    if(data){
        res.stat
    }
}

//Exports
module.exports = {
    getuserFavourite,
    getallFavourite,
    addFavourite,
    removeFavorite
}