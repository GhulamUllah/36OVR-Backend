const express = require('express')
const route = express.Router()
const ratingController = require('../Controllers/ratingController')
const {auth}= require('../middleware/auth')


// Routes
route.get('/',ratingController.getAllRatedProducts)
route.get('/user',auth,ratingController.getuserRatedProducts)
route.post('/add-rating/:id',auth,ratingController.addRating)
route.delete('/delete-rating/:id',auth,ratingController.deleteRating)


// Exports
module.exports = route