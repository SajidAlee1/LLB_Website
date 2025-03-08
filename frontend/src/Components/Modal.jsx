
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner"; // Import loader
import api from "../config/api";

const initialState = {
  name: "",
};

const Modal = ({ onClose }) => {
  const modalRef = useRef();
  const [userdata, setUserdata] = useState([]);
  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/auth/Loggeduserdata");
        if (res?.status === 200) {
          setUserdata(Array.isArray(res.data) ? res.data : [res.data]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const formData = new FormData();
      if (file) formData.append("image", file);
      if (state.name) formData.append("name", state.name);
      

      const res = await api.post("/auth/profile", formData, {
        withCredentials: true,
      });

      if (res?.status === 200) {
        toast.success("Profile Updated Successfully");
        window.location.reload();
      } else {
        toast.error("Error occurred, Try Again!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile!");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    let objectUrl;
    if (file) {
      objectUrl = URL.createObjectURL(file);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        onClick={closeModal}
        className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 w-[90%] sm:w-[400px] text-white shadow-xl relative"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-2xl font-bold text-white hover:text-gray-200 transition duration-300 cursor-pointer"
          >
            ×
          </button>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center mb-5">Update Profile</h1>

          {/* Form */}
          <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
            {/* Profile Image */}
            {userdata.map((data, index) => (
              <div key={index}>
                <motion.img
                  src={file ? URL.createObjectURL(file) : data.image || "/image/demo_image.jpg"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
            ))}

            {/* File Input */}
            <div className="w-full">
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            {/* Name Input */}
            <div className="w-full">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                name="name"
                value={state.name}
                onChange={handleChange}
              />
            </div>

            {/* Update Button / Loader */}
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.1 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className={`w-full font-bold py-2 rounded-lg shadow-md transition duration-300 cursor-pointer ${
                isLoading
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <ThreeDots height="25" width="40" color="#4f46e5" ariaLabel="loading" />
                </div>
              ) : (
                "Update"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
