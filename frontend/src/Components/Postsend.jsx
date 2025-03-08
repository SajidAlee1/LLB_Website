import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
const initialState = {
  heading:'',
  statement:''
}
const Postsend = ({ onClose }) => {
  const navigate = useNavigate();
  const modelref = useRef();
  const [state,setState]= useState(initialState)
  const [image,setImage] = useState(null)
  const [isLoading,setIsLoading] = useState(false)

  const closeModal = (e) => {
    if (modelref.current === e.target) {
      onClose();
    }
  };
  const handleChange = (event)=>{
    setState({...state,[event.target.name]:event.target.value})
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const {heading,statement} = state;
      if(!heading.trim()|| !statement.trim() ){
        toast.error('All Fields are required')
        return;
      }
      const formdata = new FormData();
formdata.append("image", image);
formdata.append("heading", heading);
formdata.append("statement", statement);

try {
  setIsLoading(true);
  const res = await api.post("/posts/createpost", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.status === 200) {
    setIsLoading(false);
    toast.success("Post created successfully");
    navigate("/post");
  } else {
    toast.error("Something went wrong, Try Again!");
  }
} catch (error) {
  console.error("Axios error:", error);
  toast.error(error.response?.data?.message || "Failed to create post");
} finally {
  setIsLoading(false);
}

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      ref={modelref}
      onClick={closeModal}
      className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm"
    >
      {/* Modal Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl px-8 py-6 rounded-3xl w-[90%] md:w-[40%] flex flex-col relative"
      >
        {/* Close Button */}
        <motion.button
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  onClick={onClose}
                  className="absolute top-4 right-6 text-yellow-400 hover:text-yellow-600 text-3xl font-bold cursor-pointer"
                >
                  ×
                </motion.button>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl text-white border-b-2 border-yellow-500 font-extrabold pb-2 text-center">
          Create Post
        </h1>
        <form onSubmit={handleSubmit}>
        {/* Input Fields */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-lg text-white font-semibold">Heading</label>
            <input
              type="text"
              name="heading"
              value={state.heading}
              onChange={handleChange}
              required
              placeholder="Enter Post Heading"
              className="p-3 bg-gray-700 text-white rounded-xl outline-none border border-transparent focus:border-yellow-400 transition duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-white font-semibold">Statement</label>
            <textarea
              type="text"
              placeholder="Enter Post Statement"
              required
              value={state.statement}
              name="statement"
              onChange={handleChange}
              className="p-3 bg-gray-700 text-white rounded-xl outline-none border border-transparent focus:border-yellow-400 transition duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-white font-semibold">Select Image</label>
            <input
              type="file"
              accept="image/*"
              required
              className="p-2 bg-gray-700 text-white rounded-xl outline-none file:cursor-pointer file:border-0 file:bg-yellow-500 file:text-white file:px-3 file:py-2 file:rounded-lg hover:file:bg-yellow-600 transition duration-300"
              onChange={(e)=>setImage(e.target.files[0])}
            />
            {
              image && 
              <img 
  className="w-full max-w-[300px] h-auto sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg object-cover" 
  src={URL.createObjectURL(image)} 
  alt="postimage" 
/>

            }
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition duration-300 cursor-pointer"
        >
          {isLoading ?<ThreeDots width={40} height={20} color="white"/>:'Submit'}
        </motion.button>
        </form>
      </motion.div>
      
    </div>
  );
};

export default Postsend;
