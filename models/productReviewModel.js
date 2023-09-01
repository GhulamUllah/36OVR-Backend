import mongoose from "mongoose";

const productreview = mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    require: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  rating: {
    type: String,
    required: true,
  },
});

const Productreview = mongoose.Model("ProductReviews", productreview);
export default Productreview;
