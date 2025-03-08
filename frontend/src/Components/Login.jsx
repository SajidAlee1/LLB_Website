import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";
const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = state;
    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter valid email");
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Passwords must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"
      );
      return;
    }
    try {
      setIsLoading(true);
      const userdata = { email, password };
      const res = await api.post(
        `/auth/login`,
        userdata
      );
      if (res?.status === 200) {
        setIsLoading(false);
        toast.success("Logged Successfully");
        window.location.reload();
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error occurred? try again");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setIsLoading(false)
    }
  };
  useEffect(()=>{
    const verify = async ()=>{
      try {
        const res = await api.get(`/auth/verify`, {
          withCredentials: true,
        });
        if(res?.status===200){
          navigate('/')
        }else{
          console.log('User is not LoggedIn')
        }
      } catch (error) {
       console.log(error) 
      } 
    }
    verify();
  },[])
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
        Login
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gray-100">
          <motion.img
            src="/image/loginimg.jpg"
            alt="Login"
            className="w-80 h-auto object-cover rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        <div className="w-full md:w-1/2 h-full py-12 px-6 md:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-lg font-semibold">Email:</label>
              <motion.input
                type="email"
                required
                className="w-full h-10 border border-gray-400 text-lg outline-none rounded-lg px-4 focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Your Email"
                autoComplete="off"
                whileFocus={{ scale: 1.02 }}
                value={state.email}
                onChange={handleChange}
                name="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg font-semibold">Password:</label>
              <motion.input
                type="password"
                required
                className="w-full h-10 border border-gray-400 text-lg outline-none rounded-lg px-4 focus:ring-2 focus:ring-purple-500"
                autoComplete="off"
                placeholder="Enter Your Password"
                whileFocus={{ scale: 1.02 }}
                name="password"
                value={state.password}
                onChange={handleChange}
              />
            </div>
            <motion.a
              href="/forgotpassword"
              className="block text-right text-purple-600 hover:underline text-sm transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Forgot Password?
            </motion.a>
            <motion.button
              className="w-full bg-green-600 text-white text-xl px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-green-700 focus:ring-4 focus:ring-green-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? "Logging..." : "Login"}
            </motion.button>
            <p className="text-center mt-3 text-gray-600">
              Already have an account?
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:underline ml-1"
              >
                SignUp here
              </Link>
            </p>
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

export default Login;
