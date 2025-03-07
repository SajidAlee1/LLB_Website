
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const initialState = {
  password: "",
  confirmpassword: ""
};

const ResetPassword = () => {
  const { token } = useParams();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmpassword } = state;

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!password.trim() || !confirmpassword.trim()) {
      return toast.error("Password is required!");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be at least 8 characters long, with one uppercase, one lowercase, one digit, and one special character."
      );
    }

    if (password !== confirmpassword) {
      return toast.error("Passwords do not match!");
    }

    // Send reset request
    try {
      setIsLoading(true);
      const res = await axios.patch(
        `https://llbbackend.vercel.app/auth/resetpassword/${token}`,
        { password }
      );

      if (res.status === 200) {
        toast.success("Password Updated Successfully!");
        navigate("/login");
      } else {
        toast.error("Error occurred! Try again");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-movingShapes"></div>

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl text-white font-extrabold mb-6 drop-shadow-lg text-center relative z-10"
      >
        Reset Password 🔒
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gray-100">
          <motion.img
            src="/image/resetpassword3.jpg"
            alt="Reset Password"
            className="w-80 h-auto object-cover rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        <div className="w-full md:w-1/2 h-full py-12 px-6 md:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-lg font-semibold">New Password:</label>
              <motion.input
                type="password"
                required
                className="w-full h-10 border border-gray-400 text-lg outline-none rounded-lg px-4 focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Your Password"
                autoComplete="off"
                whileFocus={{ scale: 1.02 }}
                value={state.password}
                onChange={handleChange}
                name="password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg font-semibold">Confirm Password:</label>
              <motion.input
                type="password"
                required
                className="w-full h-10 border border-gray-400 text-lg outline-none rounded-lg px-4 focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm Your Password"
                autoComplete="off"
                whileFocus={{ scale: 1.02 }}
                value={state.confirmpassword}
                onChange={handleChange}
                name="confirmpassword"
              />
            </div>
            <motion.button
              className="w-full bg-green-600 text-white text-xl px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-green-700 focus:ring-4 focus:ring-green-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Additional Background Styling */}
      <style jsx>{`
        @keyframes movingShapes {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .animate-movingShapes {
          background-size: 300% 300%;
          animation: movingShapes 5s ease-in-out infinite alternate;
          filter: blur(80px);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
