const express = require('express')
const bodyParser = require('body-parser')
const delete_route = express.Router()
const {getalluserDelRec,getallDelRec} = require('../Controllers/deleteController')


const {auth} = require('../middleware/auth')



// Routes
delete_route.get('/', auth, getallDelRec)
delete_route.get('/user', auth, getalluserDelRec)


// Exports
module.exports = delete_route