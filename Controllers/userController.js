const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const Cart = require("../models/cartModel");
var nodemailer = require("nodemailer");
const Profile = require("../models/profileModel");
const crypto = require('crypto');
const { error } = require("console");

// Function to generate a random OTP
const generateOTP = () => {
  const OTP_LENGTH = 4; // Set the length of the OTP as per your requirement

  // Generate a random string of numbers
  const otp = crypto.randomBytes(Math.ceil(OTP_LENGTH / 2))
  .toString('hex')
  .slice(0, OTP_LENGTH);
  return otp;
}; 

const hashfun=async(password)=>{
const p = await bcrypt.hash(password,12)
return p
}

const accountSid = "AC92215b8200a05164eb11679e579a6674";
const authToken = "9e6bcf317888cd37175093e11b8e09d6";
const client = require("twilio")(accountSid, authToken);

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service:'gmail',
  port: 465,
  secure:true,
  auth: {
    user: "ghulamullahkhan84@gmail.com",
    pass: "otweygmltxnodjsf",
  },
});
exports.admin = async (req, res) => {
  try {
    const p = await bcrypt.hash("hammad8941", 12);
    const user = await new User({
      username: "Admin",
      password: p,
      role: "admin",
      email: "ghulamullah@admin.com",
    });
  let admin=  await user.save();
    return res.status(200).json({success:true, message: "admin created successfully",admin });
  } catch (error) {
    console.log(error);
  }
};
exports.getallusers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
};
exports.deleteuser = async (req, res) => {
  try {
    const users = await User.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({success:true, message: "User Deleted",users });
  } catch (error) {
    console.log(error);
    return res.status(400).json({success:false, message: error.message });

  }
};
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const fuser = await User.findOne({ email: email });
    if (fuser) {
      console.log(fuser);
      return res.status(400).json({
        success: false,
        message: "Email already registered please login to continue",
      });
    }
    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Username" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must have 8 characters" });
    }



    const p = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: p });
    const cart = new Cart({ user: user });
    await cart.save();
    const profile = new Profile({ user: user });
    await profile.save();

    const otp = generateOTP(); // Generate the OTP
    const mail = await transporter.sendMail({
   

      to: user.email,
      from: "varify.com",
      subject: "Email Verification",
      html: `
      <html>
        <head>
          <style>
            /* CSS styles for the email body */
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background-color: #f2f2f2;
              padding: 20px;
            }
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 10px;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #007bff;
            }
            .otp-instructions {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Email Verification - OTP</h1>
          <p>Dear User,</p>
          <p>Thank you for signing up. To complete your email verification, please enter the following One-Time Password (OTP) in the provided field:</p>
          <p class="otp-code">${otp}</p>
          <p class="otp-instructions">Please enter the OTP within the next 5 minutes to verify your email address.</p>
          <p>If you did not create an account or did not request this verification, please ignore this email.</p>
          <p>Thank you,</p>
          <p>The Verify.com Team</p>
        </body>
      </html>
    `,
    });

    if (mail) {
      const p = await bcrypt.hash(password, 12);
      const hashotp= await bcrypt.hash(otp,12)
      const user = new User({ username, email, password: p, verifyemailtoken: hashotp });
      // ... save the user ...
       let userid= await user.save()
      return res.status(200).json({
        success: true,
        otp,
        email:user.email,
        user:userid._id,
        message:
          "Account created successfully. Please check your email for verification.",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "There is a Problem in Sending Email" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resentotp =async(req,res)=>{
  try{
  const {email} =req.body;
  const otp=generateOTP();
  const topi= await bcrypt.hash(otp,12)
  const mail = await transporter.sendMail({
   

    to: email,
    from: "varify.com",
    subject: "Email Verification",
    html: `
    <html>
      <head>
        <style>
          /* CSS styles for the email body */
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f2f2f2;
            padding: 20px;
          }
          h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            margin-bottom: 10px;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
          }
          .otp-instructions {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Email Verification - OTP</h1>
        <p>Dear User,</p>
        <p>Thank you for signing up. To complete your email verification, please enter the following One-Time Password (OTP) in the provided field:</p>
        <p class="otp-code">${otp}</p>
        <p class="otp-instructions">Please enter the OTP within the next 5 minutes to verify your email address.</p>
        <p>If you did not create an account or did not request this verification, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Verify.com Team</p>
      </body>
    </html>
  `,
  });
  if(mail){
    const user = await User.findOneAndUpdate({email:email},{verifyemailtoken: topi },{new:true});
 await user.save()

 return res.status(200).json({
  success: true,
  otp,
  email,
  user:user._id,
  message:
    "Resent OTP Successfully",
});
} else {
return res
  .status(400)
  .json({ success: false, message: "There is a Problem in Sending Email" });
}
  

} catch (error) {
  // Handle error
  console.error(error);
  return res.status(500).json({success:false, message: 'Failed to resend OTP' });
}



}


exports.verifyuser = async (req, res) => {
  const { otp, id } = req.body;
  console.log(req.body);
  try {

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Otp",
      });
    }
   else if (otp.length < 4 || otp.length > 4) {
      return res.status(400).json({
        success: false,
        message: "OTP Should Have 4 Digits",
      });

    }
    const fuser = await User.findOne({ _id: id });
   




    bcrypt.compare(otp, fuser.verifyemailtoken, async(err, isMatch) => {
      if (err) {
        // Handle the error
        console.error(err);
      } else if (isMatch) {



         
      const user = await User.findByIdAndUpdate(
        { _id: id },
        { isverifiedemail: true, verifyemailtoken: null },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Email Varified Successfully..! You Can Now Varified User",
        user,
      });
       
      } else {
        return res
        .status(400)
        .json({ success: false, message: "Wrong OTP" });
      }
    });}
     catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        return res
          .status(200)
          .json({ success: true, message: "Login Success", data: user, token });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Crediantials" });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Email is no Register",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.loaduser = async (req, res) => {
  try {
    const user = req.user;
    const token = req.token;
    if (user) {
      return res.status(200).json({ success: true, data: user, token });
    }

    return res.status(400).json({ success: false, message: "Invalid Attempt" });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};
exports.sellerverify = async (req, res) => {
  try {
    const { phone } = req.body;
    const send = await client.messages.create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: "+17579928430",
      to: phone,
    });

    return res.status(200).json({ success: true, send });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};
exports.passwordchange = async (req, res) => {
  try {
    const user = req.user;
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Old Password" });
    }
    if (!newpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter New Password" });
    }
    const check = await bcrypt.compare(oldpassword, user.password);
    if (check) {
      const p = await bcrypt.hash(newpassword, 12);
      const nuser = await User.findByIdAndUpdate(
        { _id: user._id },
        { password: p },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Password Changed Successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Passwords not match" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetpasswordlink = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email does not exists" });
    }
    
    const token = user._id + Math.random().toString(36).substring(2, 7);
    user.resettoken = token;
    await user.save();
    const mail = await transporter.sendMail({
      to: user.email,
      from: "no-replay@insta.com",
      subject: "PASSWORD RESET",
      html: `<style>
      b{font-size:22px;
      text-transform:uppercase;
      }
      </style>
            <b>You requested for password reset</b>
            <h5>click on this <a href="https://ecommerce-tau-umber.vercel.app/passwordreset/${token}">Change Password</a> to reset password</h5>
            `,
    });
    if (mail) {
      return res.status(200).json({
        success: true,
        message: "Please Check your email to reset your password",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Something went wrong please try again",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetpassword = async (req, res) => {
  const {otp} = req.params
  const {newpassword,confirmpassword}=req.body
  if(!newpassword || !confirmpassword) res.status(200).send({success:false,message:"Fields Cannot be Empty"})
  else if(newpassword !== confirmpassword) res.status(200).send({success:false,message:"Password Didnn't Match"})
  else{
    const pass = await hashfun(confirmpassword)
    try {
      const data = await User.findOne({resettoken:otp})
      if(data){
      const user = await User.findOneAndUpdate({resettoken:otp},{$set:{resettoken:'',password:pass}},{new:true})
      res.status(200).send({success:true,message:"Password has been Successfully Reset",data:user})

      }
      else{
        res.status(200).send({success:false,message:"Invalid OTP"})

      }
    } catch (error) {
      res.status(400).send({success:false,message:error.message})
    }
}
};
function random(len) {
  let result = Math.floor(Math.random() * Math.pow(10, len));

  return result.toString().length < len ? random(len) : result;
}
exports.becomeaseller = async (req, res) => {
  try {
    const user = req.user;

    const email = req.user.email;
    console.log(email);
    const key = random(5);

    user.verifyemailtoken = key;
    await user.save();
    const mail = await transporter.sendMail({
      to: email,
      from: "no-replay@insta.com",
      subject: "Seller Varification",
      html: `
            <p>yout email otp is ${key}</p>
            `,
    });
    if (mail) {
      return res.status(200).json({
        success: true,
        message: "Otp has been sent to your email",
        user:user,
        key,
      });
    }
    if (email) {
      let user_ = await User.findByIdAndUpdate(
        { _id: req.user._id },
        { seller_request: true },
        { new: true }
      );
      return res.status(200).json({ user: user_ });
    }
    return res.status(400).json({ message: "somethng went wrong" });
    
  } catch (error) {
    console.log(error);
  }
};

exports.emailverify = async (req, res) => {
  const { otp } = req.body;
  const user = req.user;
  try {
    const { id } = req.body;
    const user_ = await User.findByIdAndUpdate(
      { _id: id },
      { isverifiedemail: true, role: "seller", verifyemailtoken: "" },
      { new: true }
    );
    if (!otp) {
      return res.status(400).json({succes:true, message: "Please Enter Otp" });
    }
    if (user.verifyemailtoken == otp) {
      const user_ = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { isverifiedemail: true, role: "seller", verifyemailtoken: "" },
        { new: true }
      );
      return res.status(200).json({success:true, message: "You are Seller Now", user_ });
    }
    return res.status(200).json({success:true, message: "Seller Approved", user: user_ });
  } catch (error) {
    console.log(error);
  }
};
