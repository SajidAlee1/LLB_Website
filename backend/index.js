import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routers/user.js';
import passport from 'passport';
import session from 'express-session';
import cloudinary from 'cloudinary'
import { User } from './Models/UserSchema.js';
import jwt from 'jsonwebtoken'
import { Strategy } from 'passport-google-oauth2';
import nodemailer from 'nodemailer'
import adminrouter from './routers/Admin.js';
import managerrouter from './routers/Manager.js';
import uploadrouter from './routers/UploadNotes.js';
import postrouter from './routers/Posts.js';
import videorouter from './routers/Videopost.js';
config({path:'./.env.local'});
const app = express();
app.use(cors({
    origin:'https://llbwebsite.vercel.app',
    methods:["POST","GET","PATCH","PUT","DELETE"],
    credentials:true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_SECRET_KEY
})
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRETID,
    callbackURL: 'https://llbbackend.vercel.app/auth/google/callback',
    scope: ['email', 'profile']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });  // ✅ FIXED: Use findOne()
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            });
            await user.save();
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
                  to: profile.emails[0].value,
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
                    <h1 class="text-3xl font-extrabold text-gray-800">Congratulations ${profile.displayName}, Superstar! 🚀</h1>
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
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// ✅ Ensure serializeUser & deserializeUser are set BEFORE routes
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', passport.authenticate("google", { session: true }), async (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRET_KEY, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect("http://localhost:5173/");
    } catch (error) {
        console.error("Error generating token:", error);
        res.redirect("http://localhost:5173/signup");
    }
});
app.use('/auth',router);
app.use('/admin',adminrouter);
app.use('/manager',managerrouter)
app.use('/notes',uploadrouter)
app.use('/posts',postrouter)
app.use('/videos',videorouter)

export default app;
