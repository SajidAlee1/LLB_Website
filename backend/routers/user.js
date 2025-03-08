import express from "express";
import { User } from "../Models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import cloudinary from 'cloudinary'
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existuser = await User.findOne({ email });
    if (existuser) {
      res.status(400).json("User Already Exists");
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedpassword });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Congritulation to signup on LLB_website",
      html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Welcome to LLB Website! 🎉</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
        }
    </style>
</head>
<body class="bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center min-h-screen">
    <div class="bg-white max-w-lg p-8 rounded-lg shadow-2xl text-center animate-fadeIn">
        <div class="text-5xl mb-4">🎊🎉</div>
        <h1 class="text-3xl font-extrabold text-gray-800">Congratulations ${name}, Superstar! 🚀</h1>
        <p class="text-lg text-gray-600 mt-4">You have successfully signed up on <strong>LLB Website</strong>. We are thrilled to have you join our learning community! 🌟</p>
        <p class="text-md text-gray-700 mt-4">Here at <strong>LLB Website</strong>, we believe that knowledge is the key to success, and we're here to help you reach for the stars. 🌌 Whether you're exploring new topics, gaining deep insights, or enhancing your skills, we've got you covered! 📚💡</p>
        <p class="text-lg text-gray-700 mt-4 font-semibold">Get ready to elevate your learning experience to new heights! 🚀✨</p>
        <p class="text-sm text-gray-500 mt-6">🌐 Visit our website: <a href="#" class="text-blue-500 hover:underline font-bold">www.llbwebsite.com</a></p>
        <div class="mt-6 text-3xl">📖💡📚</div>
    </div>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res
      .status(200)
      .json({ message: "User account created successfully" });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { name: user.name, id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
// checking user is loggedin or not
const verifytoken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Token not-found" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};
router.get("/verify", verifytoken, (req, res) => {
  res.status(200).json({ message: "User is loggedIn" });
});

//logout
router.get("/logout", async (req, res) => {
  await req.session.destroy();
  const token = await req.cookies.token;
  if (!token) {
    res.status(400).json({ message: "Token not-found" });
  }
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body; // ✅ Now this will work
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const token = jwt.sign(
      { name: user.name, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "5m" }
    );

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      // text: `http://localhost:5173/resetpassword/${token}`
      // text:`🔒 [Reset Your Password](http://localhost:5173/resetpassword/${token})`
      html: `<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password 🔒</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; text-align: center;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" width="500px" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); padding: 20px;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <img src="https://i.imgur.com/A5bA5vT.png" alt="🔑" width="80">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" style="color: #333333; font-size: 24px; font-weight: bold;">
                            Forgot Your Password? 😢
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td align="center" style="color: #555555; font-size: 16px; padding: 15px;">
                            No worries! Click the button below to reset your password. This link will expire in **15 minutes**.
                        </td>
                    </tr>

                    <!-- Reset Button -->
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <a href="http://localhost:5173/resetpassword/${token}"
                               style="background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; text-decoration: none;
                                      font-size: 18px; font-weight: bold; padding: 14px 30px; border-radius: 25px; display: inline-block;">
                               🔒 Reset Password
                            </a>
                        </td>
                    </tr>

                    <!-- Security Notice -->
                    <tr>
                        <td align="center" style="color: #777777; font-size: 14px; padding: 15px;">
                            If you didn’t request this, you can safely ignore this email. Your password will not change.
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top: 20px; font-size: 12px; color: #999999;">
                            💡 Need help? <a href="mailto:support@example.com" style="color: #ff416c; text-decoration: none;">Contact Support</a>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.patch('/resetpassword/:token',async(req,res)=>{
  try {
    const {token} = req.params;
    const {password} = req.body;
    if(!token){
      res.status(400).json({message:'Token is not provided'})
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    const id = decoded.id;
    const hashedpassword = await bcrypt.hash(password,10)
    const user = await User.findByIdAndUpdate(id, { password: hashedpassword }, { new: true });
    if(!user){
      return res.status(404).json({message:'User not Found'})
    }
    return res.status(200).json({message:'Password Updated Successfully'})
  } catch (error) {
    console.log(error)
  }
})

router.get('/Loggeduserdata',async(req,res)=>{
  try {
    const token = req.cookies.token;
    if(!token){
      return res.status(400).json({message:'Token is not Provided'})
    }
    const decoded =  jwt.verify(token,process.env.SECRET_KEY)
    const id = decoded.id;
    const user = await User.findById(id).select('-password').sort({createdAt:-1});
    if(!user){
      return res.status(404).json({message:'User not-found'})
    }
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server Error' });
  }
})
// delete user
router.delete('/delete',async(req,res)=>{
  try {
    const token = req.cookies.token;
    if(!token){
       res.status(400).json({message:'Token is not provided'})
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    const id = decoded.id;
    await User.findByIdAndDelete(id)
    res.clearCookie('token',{
      httpOnly:true
    })
    return res.status(200).json({message:'User deleted successfully'})
  } catch (error) {
    console.log(error)
  }
})
//cloudinary update
const storage = multer.memoryStorage();
const upload = multer({storage:storage})
router.post("/profile", upload.single('image') , async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Token is not Provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const id = decoded.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      let image = user.image;
      const { name, removeImage } = req.body;

      // Remove existing image if requested
      if (removeImage === "true" && user.image) {
        try {
          const publicId = user.image.split("/").pop().split(".")[0];
          await cloudinary.v2.uploader.destroy(`LLB_Website/${publicId}`);
          image = null;
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      // Upload new image if file exists
      if (req.file) {
        if (user.image) {
          try {
            const publicId = user.image.split("/").pop().split(".")[0];
            await cloudinary.v2.uploader.destroy(`LLB_Website/${publicId}`);
          } catch (error) {
            console.error("Error deleting previous image:", error);
          }
        }

        // Upload new image
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "LLB_Website", resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        image = uploadResult;
      }

      // Update user info
      user.name = name || user.name;
      user.image = image || user.image;

      const updatedUser = await user.save();

      return res.status(200).json({
        _id: updatedUser.id,
        name: updatedUser.name,
        image: updatedUser.image,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Authentication Error" });
  }
});
router.delete("/profile", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Token is not provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const id = decoded.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // **Delete profile image from Cloudinary (if exists)**
    if (user.image){
      try {
        const publicId = user.image.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(`LLB_Website/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    // **Delete user from database**
    await User.findByIdAndDelete(id);

    // Clear authentication cookie
    res.clearCookie("token");

    // Send response
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error Occurred, account could not be deleted",
    });
  }
});
router.get('/getuser', async (req, res) => {
  try {
    const users = await User.find({});  // Find all users

    if (users.length === 0) {
      return res.status(404).json({ message: 'No Users Exist' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);  // Log error properly
    return res.status(500).json({ message: 'Internal Server Error' }); 
  }
});
router.delete('/deleteuser/:id',async(req,res)=>{
  try {
    const {id} = req.params;
    const clouduser = await User.findById(id);
    if(!clouduser){
      return res.status(404).json({message:'User Not Fount'});
    }
    const image = clouduser.image
    try {
      const publicId = await clouduser.image.split('/').pop().split('.')[0];
      await cloudinary.v2.uploader.destroy(`LLB_Website/${publicId}`)
    } catch (error) {
      console.log(error)
    }
    const user = await User.findByIdAndDelete(id);
    if(!user){
      return res.status(404).json({message:'User Not Found'})
    }
    return res.status(200).json({message:'User Deleted Successfully'})
  } catch (error) {
    console.log(error)
  }
});

router.patch('/addmanager/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Check if the requester is an admin (e.g., from JWT token or session)
    const requester = req.user; // Assuming the user info is stored in req.user after authentication

    if (!requester || requester.role !== 'Admin') {
      return res.status(403).json({ message: 'Access Denied: Admins only' });
    }

    // Assign 'Manager' role
    user.role = 'Manager'; 

    await user.save();  // Save the updated user
    return res.status(200).json({ message: 'Added as Manager Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});






export default router;
