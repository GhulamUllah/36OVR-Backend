const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
exports.additemtocart = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate(
      "shop"
    );
    const cartitem = {
      product: req.params.id,
      quantity: 1,
    };
    console.log(req.user)
    const user = await User.findOne({ _id: req.user });
    if (!user) {
    }
    const cart = await Cart.findOne({
      user: req.user._id,
      store: product.shop,
    }).populate(["cartItems.product", "store"]);

    if (cart) {
      console.log(cart)
      if (cart.cartItems.length > 0) {
        for (let index = 0; index < cart.cartItems.length; index++) {
          const element = cart.cartItems[index];
          // console.log(element.product.user.equals(product.user));
          if (element.product.user.equals(product.user) === false) {
            return res.status(400).json({ message: "Something went wrong" });
          }
        }
      }
      let prod = await Product.findOne({ _id: req.params.id })
      const cartitem = {
        product: prod,
        quantity: 1,
      };
      for (let index = 0; index < cart.cartItems.length; index++) {
        const element = cart.cartItems[index];
        if (req.params.id == element.product._id) {
          element.quantity += 1;
          cart.carttotal += element.product.price;
          const mcart = await cart.save();
          return res.status(200).json({ data: mcart, product });
        }
      }
      await cart.cartItems.push(cartitem);
      cart.carttotal += product.price;
      const mcart = await cart.save();
      console.log(mcart)
      return res
        .status(200)
        .json({ data: mcart, product, message: "Item Added To Cart" });
    }
    const uuucart = await new Cart({ user: req.user, store: product.shop });
    await uuucart.cartItems.push(cartitem);
    uuucart.carttotal += product.price;
    await uuucart.save();
    const mcart = await Cart.find({
      user: req.user._id,
      store: product.shop,
    }).populate([
      {
        path: "store",
        model: "Shops",
      },
      {
        path: "cartItems.product",
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: "shop" },
      },
    ]);
    return res.status(200).json({ data: mcart, product });
  } catch (error) {
    console.log(error);
  }
};
exports.removeitemfromcart = async (req, res) => {
  console.log(req.user, req.body.store)
  try {
    const ucart = await Cart.findOne({
      user: req.user._id,
      store: req.body.store, // Fix: Use req.body.store instead of req.user.storeid
    }).populate(["store", "cartItems.product"]);
    console.log(ucart)
    if (!ucart) {
      console.log("Cart not found");
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log("Before cartItems loop");

    for (let i = 0; i < ucart.cartItems.length; i++) {
      const cartItem = ucart.cartItems[i];
      console.log(cartItem)
      if (cartItem.product._id == req.params.id) {
        ucart.cartItems.splice(i, 1); // Remove the item from the array
        ucart.carttotal -= cartItem.product.price * cartItem.quantity;
        break; // Exit the loop since we found the item
      }
    }


    const cart = await ucart.save();


    return res.status(200).json({ data: cart, message: "Item Removed From Cart" });
  } catch (error) {
    // Check if req.user is available
    if (!req.user || !req.user._id) {
      console.log("User not authenticated");
      return res.status(401).json({ message: "User not authenticated", user: req.user, store: req.body.store });
    }
    console.log("Error in removeitemfromcart:", error, req.user, req.body.store);
    return res.status(500).json({ message: "Internal server error", user: req.user, store: req.body.store });
  }

};



exports.getusercart = async (req, res) => {
  try {
    // let total = 0;
    let ucart = await Cart.find({ user: req.user._id }).populate({
      path: "cartItems.product",
      // Get friends of friends - populate the 'friends' array for every friend

    });
    if (ucart) {
      for (let index = 0; index < ucart.length; index++) {
        if (ucart[index].cartItems.length == 0) {
          const cartt = await Cart.findOneAndDelete({ _id: ucart[index]._id });
        }
      }
      ucart = await Cart.find({ user: req.user }).populate([
        {
          path: "store",
        },
        {
          path: "cartItems.product",
        },
      ]);

      // .populate({
      //   path: "cartItems.product",
      //   // Get friends of friends - populate the 'friends' array for every friend
      //   populate: { path: "shop" },
      // });
      for (let index = 0; index < ucart.length; index++) {
        let total = 0;

        const element = ucart[index];
        for (let indexx = 0; indexx < element.cartItems.length; indexx++) {
          const elementt = element.cartItems[indexx];
          console.log(elementt)
          total = total + elementt.product.price * elementt.quantity;
          // element.carttotal = total;
          // console.log(total);
        }
        await Cart.findByIdAndUpdate(
          { _id: element._id },
          { carttotal: total }
        );
      }

      return res.status(200).json({ data: ucart, message: "cart" });
    }

    const uuucart = await new Cart({ user: req.user });
    const cart = await uuucart.save();
    return res.status(200).json({ data: cart });
    // console.log(cart)
    // if (cart) {
    //     const productid = req.params.id
    //     const product = await Product.findOne({_id:req.params.id})
    //     await cart.cartItems.push(product)
    //    const c= await cart.save()
    //     console.log(cart)
    // const cartt = await Cart.findOneAndUpdate({user:req.user._id},{"$push":{"cartItems":req.body.cartItems}})
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message })

  }
};

exports.cartitemincreament = async (req, res) => {
  console.log(req.params)
  try {
    let quantitytosend = 0;
    const ucart = await Cart.findOne({
      user: req.user._id,
      store: req.params.storeid,
    }).populate(["store", "cartItems.product"]);
    console.log(ucart);
    for (let index = 0; index < ucart.cartItems.length; index++) {
      const element = ucart.cartItems[index];
      if (element.product._id == req.params.id) {
        quantitytosend = element.quantity += 1;
        ucart.carttotal += element.product.price;
      }
    }
    const cart = await ucart.save();
    return res.status(200).json({
      data: cart,
      message: "Quantity Increased",
      carttotal: cart.carttotal,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message })

  }
};
exports.cartitemdescreament = async (req, res) => {
  try {
    let quantitytosend = 0;
    const ucart = await Cart.findOne({
      user: req.user._id,
      store: req.params.storeid,
    }).populate(["store", "cartItems.product"]);
    console.log(ucart);
    if (ucart.cartItems.length <= 0) {
      await ucart.delete();
    }
    for (let index = 0; index < ucart.cartItems.length; index++) {
      const element = ucart.cartItems[index];
      if (element.product._id == req.params.id) {
        quantitytosend = element.quantity -= 1;
        ucart.carttotal -= element.product.price;
      }
    }
    const cart = await ucart.save();
    return res.status(200).json({
      data: cart,
      message: "Quantity Decreased",
      carttotal: cart.carttotal,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message })
  }
};


exports.clearCart = async (req, res) => {
  try {
    const deldata = await Cart.deleteMany({ user: req.user._id })
    console.log(deldata)
    if (deldata) {
      res.status(200).send({ success: true, message: "Cart is Now Empty" })
    }
    else {
      res.status(200).send({ success: false, message: "Something Went Wrong" })

    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message })
  }
}

exports.clearCartAdmin = async (req, res) => {
  try {
   if(req.admin){
    const deldata = await Cart.deleteMany()
    console.log(deldata)
    if (deldata) {
      res.status(200).send({ success: true, message: "Every One's Cart is Now Empty" })
    }
    else {
      res.status(200).send({ success: false, message: "Something Went Wrong" })

   }

    }
    else{
      res.status(200).send({success:false,message:"Only admin Can Access this Api"})
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message })
  }
}
