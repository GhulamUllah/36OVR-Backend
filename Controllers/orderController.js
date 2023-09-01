const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Payment = require("../models/payment");
const Shop = require("../models/shopModel");
const DeleteRec = require('../models/deleteModel')
const moment = require("moment");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.initorder = async (req, res) => {
  const { deliverydetails, cartids, paymentid, amount } = req.body;
  if (!deliverydetails) {
    return res
      .status(400)
      .json({ success: false, message: "Please Select Delivery Address" });
  }
  if (!paymentid) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter Payment Info" });
  }
  if (!amount) {
    return res
      .status(400)
      .json({ success: false, message: "Someting Went Wrong" });
  }
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount * 1000,
      currency: "USD",
      description: "Payment",
      payment_method: paymentid,
      confirm: true,
    });
    if (payment) {
      console.log(payment);
      const promises = [];
      console.log(cartids);
      for (let index = 0; index < cartids.length; index++) {
        const element = cartids[index];
        console.log(element);

        let p = new Promise((resolve, reject) => {
          Cart.findById({ _id: element })
            .populate([
              {
                path: "store",
                model: "Shops",
              },
              {
                path: "cartItems.product",
                // Get friends of friends - populate the 'friends' array for every friend
                populate: { path: "shop" },
              },
            ])
            .exec()
            .then(async (cart) => {
              // console.log(cart);
              const order_ = await new Order({
                to: cart.store.owner,
                from: cart.user,
                ordertotal: cart.carttotal,
                items: [...cart.cartItems],
                deliverydetails: deliverydetails,
                ispaid: "Paid",
              });
              const order = await order_.save();

              resolve(order);
            })

            .catch((err) => console.log(err));
        });
        promises.push(p);
        await Cart.findByIdAndDelete({ _id: element });
      }
      Promise.all(promises)
        .then((p) => {
          return res
            .status(200)
            .json({ success: true, message: "Orders Create Successfully" });
        })
        .catch((err) => console.log(err));
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getorderc = async (req, res) => {
  const order = await Order.find({ from: req.user }).populate("to");
  return res.json({ order: order });
};
exports.getorders = async (req, res) => {
  const order = await Order.find({ to: req.user }).populate([
    "from",
    "to",
    "deliverydetails",
  ]);
  return res.json({ order: order });
};
exports.getallorders = async (req, res) => {
  const order = await Order.find().populate(["from", "to", "deliverydetails"]);
  return res.json({ order: order });
};
exports.getsingleorder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id }).populate([
    "to",
    "from",
    "items.product",
    "deliverydetails",
  ]);
  return res.json({ order: order });
};

exports.updateorder = async (req, res) => {
  try {
    const { orderstatus, deliverystatus } = req.body;
    const order_ = await Order.findOne({ _id: req.params.id });
    if (order_.iscompleted) {
      return res
        .status(400)
        .json({ success: false, message: "Order Status is Completed" });
    }
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      { orderstatus, deliverystatus },
      { new: true }
    ).populate(["to", "from", "items.product"]);

    return res.status(200).json({ order: order });
  } catch (error) {
    console.log(error);
  }
};
exports.selleracount = async (req, res) => {
  const user = req.user;

  try {
    if (!user.stripeid) {
      const account = await stripe.accounts.create({ type: "express" });
      user.stripeid = account.id;
      const user_ = await user.save();
      const accountLink = await stripe.accountLinks.create({
        account: user_.stripeid,
        refresh_url:
          "https://shop-ultimate-client.vercel.app/dashboard/payouts",
        return_url: "https://shop-ultimate-client.vercel.app/dashboard/payouts",
        type: "account_onboarding",
      });
      return res
        .status(200)
        .json({ message: "account assigned", account_: accountLink });
    }
    const account_ = await stripe.accounts.retrieve(user.stripeid);
    if (account_.charges_enabled) {
      return res.status(200).json({
        message: "account exists",
        charges_enabled: true,
      });
    }
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeid,
      refresh_url: "https://shop-ultimate-client.vercel.app/dashboard/payouts",
      return_url: "https://shop-ultimate-client.vercel.app/dashboard/payouts",
      type: "account_onboarding",
    });
    return res.status(200).json({
      message: "Continue",
      account_: accountLink,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.check = async (req, res) => {
  try {
    const user = req.user;
    if (!user.stripeid) {
      return res.status(400).json({
        success: false,
        message: "Account Not Exists",
      });
    }
    const account = await stripe.accounts.retrieve(user.stripeid);
    return res.status(200).json({
      success: true,
      account,
      message: "Account Found",
    });
  } catch (error) {
    console.log(err);
  }
};
exports.ordercomplete = async (req, res) => {
  try {
    const order_ = await Order.findOne({ _id: req.params.id });
    if (order_.iscompleted) {
      return res
        .status(400)
        .json({ success: false, message: "Order Status is Completed" });
    }
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      {
        iscompleted: true,
        orderstatus: "completed",
        deliverystatus: "Delivered",
      },
      { new: true }
    ).populate(["to", "from", "items.product"]);
    const payment = await new Payment({
      order: order._id,
      to: order.to,
      amount: order.ordertotal,
    });
    const payment_ = await payment.save();
    console.log(payment_);
    return res.status(200).json({ order: order });
  } catch (error) {
    console.log(error);
  }
};

exports.getpayments = async (req, res) => {
  try {
    const payments = await Payment.find({ to: req.user }).sort({
      createdat: -1,
    });
    return res.json({ message: "wroking", payments });
  } catch (error) {
    console.log(error);
  }
};
exports.getallpayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      createdat: -1,
    });
    return res.json({ payments });
  } catch (error) {
    console.log(error);
  }
};

exports.clearpayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" });
    const date = moment().format("DD/MM/YYYY");
    for (let index = 0; index < payments.length; index++) {
      const element = payments[index];
      // const datac = moment(element.createdat).add(7, "d").format("DD/MM/YYYY");
      // console.log(date > datac);
      // if (date == datac) {
      await Payment.findByIdAndUpdate(
        { _id: element._id },
        { status: "available" },
        { new: true }
      );

      // }
    }

    return res.json({ message: "payments cleared" });
  } catch (error) {
    console.log(error);
  }
};

exports.transferfunds = async (req, res) => {
  try {
    const payments = await Payment.find({
      to: req.user,
      status: "available",
    }).populate("to");
    if (payments.length) {
      const account = payments[0].to.stripeid;
      let amount = 0;
      for (let index = 0; index < payments.length; index++) {
        const element = payments[index];
        amount += element.amount;
      }

      const transfer = await stripe.transfers.create({
        amount: amount,
        currency: "usd",
        destination: account,
        transfer_group: "Order45",
      });
      for (let index = 0; index < payments.length; index++) {
        const element = payments[index];
        await Payment.findOneAndUpdate(
          { _id: element?._id },
          { status: "completed" },
          { new: true }
        );
      }
      console.log(transfer, amount);
      return res.json({ transfer });
    }
    return res.status(400).json({ message: "No available funds" });
  } catch (error) {
    console.log(error);
  }
};




exports.myOrder = async (req,res) =>{
  const {deliveryaddress,amount,cartid} = req.body
  if(!deliveryaddress || !amount || !cartid) res.status(200).send({success:false,message:"Some Details Are missing"})
  else try {
     const check = await Order.findOne({cart:cartid})
     if(check){
      res.status(200).send({success:false,message:"Order Already Exist"})
     }
     else{
      const order = await new Order({
        from:req.user._id,
        cart:cartid,
        ordertotal:amount,
        deliverydetails:deliveryaddress
      })
      const data = await order.save()
      res.status(200).send({success:true,message:"Your Order has been Placed Successfully",data:data})
     }
    

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}

exports.deletemyOrder = async (req,res) =>{
  const {id} = req.params
  if(!id) res.status(200).send({success:false,message:"Some Details Are missing"})
  else try {
     const check = await Order.findOneAndDelete({_id:id})
     if(check && req.admin || req.user && check){
      const delrecord = await new DeleteRec({user:req.user._id,orders:id})
      await delrecord.save()
      res.status(200).send({success:false,message:"Order Deleted Successfully",data:check})
     }
     else{
      res.status(200).send({success:false,message:"Your Order Cannot Deleted"})
     }
    

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}

exports.getmydeleteOrder = async (req,res) =>{
   try {
     const check = await Order.find({from:req.user})
     if(check && req.admin || req.user && check){
      res.status(200).send({success:false,message:"Deleted Orders:",data:check})
     }
     else{
      res.status(200).send({success:false,message:"Deleted Order Cannot Loaded"})
     }
    

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}
exports.getalldeleteOrder = async (req,res) =>{
   try {
     const check = await Order.find()
     if(check && req.admin){
      res.status(200).send({success:false,message:"Deleted Orders:",data:check})
     }
     else{
      res.status(200).send({success:false,message:"Only Admin Can Access this Api"})
     }
    

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}



exports.updateuserOrder = async (req,res) =>{
  const {id} = req.params
  if(!id) res.status(200).send({success:false,message:"Some Details Are missing"})
  else try {
     const check = await Order.findOne({_id:id})
     if(check && req.admin || req.user && check){
      const update = await Order.findOneAndUpdate({_id:id},{$set:{
        orderstatus:"completed",
        deliverystatus:"Delivered",
        iscompleted:true
      }},{new:true})
      await update.save()
      res.status(200).send({success:false,message:"Order Updated Successfully",data:update})
     }
     else{
      res.status(200).send({success:false,message:"No Order Found"})
     }
    

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}

exports.getmyUserorders = async (req,res) =>{
   try {
     
     const userOrder = await Order.find({from:req.user._id}).populate("from")

      res.status(200).send({success:true,message:"Your Order has been Placed Successfully",data:userOrder})
     
    

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}
exports.getmyallorders = async (req,res) =>{
   try {
     
   if(req.admin){
    const userOrder = await Order.find().populate("from")

    res.status(200).send({success:true,message:"Your Order has been Placed Successfully",data:userOrder})
   
  
   }
   else{
    res.status(200).send({success:false,message:"Only Admin Can Access this API"})
   }

  } catch (error) {
    res.status(400).send({success:false,message:error.message})
  }
}





