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
const Videopost = ({ onClose }) => {
  const navigate = useNavigate();
  const [state,setState] = useState(initialState)
  const [video,setVideo] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const modalRef = useRef();

  const CloseRef = (e) => {
    if (modalRef.current === e.target) {
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
      if(!heading.trim()||!statement.trim()){
        toast.error('All fields are required')
        return;
      }
      try {
        setIsLoading(true)
        const formdata = new FormData();
        formdata.append('video',video);
        formdata.append('heading',heading)
        formdata.append('statement',statement)
        const res = await api.post('/videos/videopost',formdata,{
          headers:{
            'Content-Type':'multipart/form-data',
          }
        })
        if(res?.status===200){
          setIsLoading(false)
          toast.success('Post Created Successfully')
          navigate('/post')
        }else{
          setIsLoading('Error Occurred TryAgain!')
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }finally{
        setIsLoading(false)
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      ref={modalRef}
      onClick={CloseRef}
      className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-lg"
    >
      {/* Modal Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a] shadow-xl px-8 py-6 rounded-3xl w-[90%] md:w-[40%] flex flex-col relative border border-white/20 backdrop-blur-lg"
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
        <h1 className="text-3xl md:text-4xl text-white border-b-2 border-yellow-400 font-extrabold pb-2 text-center">
          Upload Video
        </h1>

        {/* Input Fields */}
        <form onSubmit={handleSubmit}>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-lg text-white font-semibold">Heading</label>
            <input
              type="text"
              required
              name="heading"
              value={state.heading}
              onChange={handleChange}
              placeholder="Enter Video Heading"
              className="p-3 bg-white/10 text-white rounded-xl outline-none border border-transparent focus:border-yellow-400 transition duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-white font-semibold">Statement</label>
            <textarea
              type="text"
              required
              onChange={handleChange}
              name="statement"
              value={state.statement}
              placeholder="Enter Video Statement"
              className="p-3 bg-white/10 text-white rounded-xl outline-none border border-transparent focus:border-yellow-400 transition duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-white font-semibold">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              required
              onChange={(e)=>setVideo(e.target.files[0])}
              className="p-2 bg-white/10 text-white rounded-xl outline-none file:cursor-pointer file:border-0 file:bg-yellow-500 file:text-white file:px-3 file:py-2 file:rounded-lg hover:file:bg-yellow-600 transition duration-300"
            />
          </div>
        </div>
        {
          video &&
          <video className="w-full max-h-40  max-w-[300px] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg object-cover" src={URL.createObjectURL(video)} autoPlay controls loop></video>
        }

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255, 255, 0, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold cursor-pointer py-3 px-6 rounded-xl text-lg transition duration-300"
        >
          {isLoading?<ThreeDots width={40} height={20} color="white"/>:'Submit'}
        </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Videopost;
