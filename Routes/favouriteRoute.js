const express = require('express')
const favourite_route = express.Router()
const favouriteController = require('../Controllers/favouriteContrller')
const {auth} = require('../middleware/auth')


//Routes
favourite_route.get('/user',auth,favouriteController.getuserFavourite)
favourite_route.get('/',auth,favouriteController.getallFavourite)
favourite_route.post('/add-favourite',auth,favouriteController.addFavourite)
favourite_route.delete('/delete-favourite/:id',auth,favouriteController.removeFavorite)

//Export
module.exports = favourite_route