
import React from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const initialState = {
  name: "",
  email: "",
  password: "",
};

const SignUp = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = state;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    const nameRegex = /^[A-Za-z]{4,}$/;
    if (!nameRegex.test(name)) {
      toast.error("Invalid name. It must contain only letters and be at least 4 characters long");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Passwords must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"
      );
      return;
    }

    try {
      setIsLoading(true);
      const userdata = { name, email, password };
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, userdata);

      if (res?.status === 200) {
        setIsLoading(false);
        toast.success("Registered Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error("Error occurred, could not be registered");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    axios.defaults.withCredentials=true;
    const verify = async ()=>{
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`,{
          withCredentials:true,
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
  const googlehandle = ()=>{
    window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/google/callback`,"_self")
  }

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl text-white font-extrabold mb-6 drop-shadow-lg text-center"
      >
        Welcome Again
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden"
      >
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gray-100">
          <motion.img
            src="/image/signupimg3.jpg"
            alt="Sign Up"
            className="w-80 h-auto object-cover rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        <div className="w-full md:w-1/2 h-full py-12 px-6 md:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-lg font-semibold">Name:</label>
              <motion.input
                type="text"
                required
                className="w-full h-10 border border-gray-400 text-lg outline-none rounded-lg px-4 focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Your Name"
                autoComplete="off"
                whileFocus={{ scale: 1.02 }}
                name="name"
                value={state.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-lg font-semibold">Email:</label>
              <motion.input
                type="email"
                required
                className="w-full h-10 border border-gray-400 text-lg outline-none rounded-lg px-4 focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Your Email"
                autoComplete="off"
                whileFocus={{ scale: 1.02 }}
                name="email"
                value={state.email}
                onChange={handleChange}
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

            <motion.button
              className="w-full bg-green-600 text-white text-xl px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-green-700 focus:ring-4 focus:ring-green-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? "Registering..." : "Register"}
            </motion.button>

            <motion.button
              className="w-full flex justify-center items-center gap-3 border border-gray-400 text-lg px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={googlehandle}
            >
              <FcGoogle size={24} />
              <span className="text-sm sm:text-lg">Login with Google</span>
            </motion.button>

            {/* Already have an account? Login link */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-all"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
