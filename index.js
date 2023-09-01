const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const delete_route = require('./Routes/deleteRoute')
const shopRoutes = require("./Routes/shopRoutes");
const AddressRoutes = require("./Routes/DeliveryAddressRoutes");
require("dotenv").config();

const catageryRoutes = require("./Routes/catageryRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const brandRoutes = require("./Routes/brandsRoutes");
const profileRoutes = require("./Routes/profileRoutes");
const ratingRoute = require("./Routes/ratingRoute");
const favouriteRoute = require("./Routes/favouriteRoute")
const stripeRoute = require('./Routes/stripeRoute')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin:true
}));


app.use("/user", userRoutes);
app.use("/shop", shopRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/deleteRec", delete_route);
app.use("/catagery", catageryRoutes);
app.use("/address", AddressRoutes);
app.use("/order", orderRoutes);
app.use("/brand", brandRoutes);
app.use("/profile", profileRoutes);
app.use("/favourite",favouriteRoute)
app.use("/payment",stripeRoute)
app.use("/rating",ratingRoute)

// app.use("/order", orderRoutes);

mongoose
  .connect(process.env.DATABASE_PATH, { useNewUrlParser: true })
  .then(() => {
    console.log("db connected");
  }).catch((err)=>console.log(err));
// mongoose
//   .connect("mongodb://0.0.0.0:27017/shp", { useNewUrlParser: true })
//   .then(() => {
//     console.log("db connected");
//   });

const port = process.env.PORT;  
app.listen(port, function () {
  console.log(`app running on ${port}`);
});
