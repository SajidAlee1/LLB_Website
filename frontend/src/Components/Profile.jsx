
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from "react-hot-toast";
import Modal from './Modal';
import { ThreeDots } from 'react-loader-spinner';
import api from '../config/api';

const Profile = () => {
  const [userdata, setUserdata] = useState([]);
  const [showModal,setShowModal] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get('/auth/verify');
        if (res?.status !== 200) navigate('/login');
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };
    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/auth/Loggeduserdata');
        if (res?.status === 200) {
          setUserdata(Array.isArray(res.data) ? res.data : [res.data]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleDelete = async(e)=>{
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await api.delete('/auth/profile')
      if(res?.status===200){
        setIsLoading(false)
        toast.success('Account deleted successfully')
        window.location.reload();
        navigate('/signup')
      }else{
        toast.error('Error Occurred TryAgain!')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 text-center relative overflow-hidden"
      >
        {/* Remove absolute positioning from the background layer */}
        <div className="bg-gradient-to-br from-blue-400 to-pink-400 opacity-10 rounded-3xl absolute inset-0 pointer-events-none" />

        <motion.h1
          className="text-3xl font-extrabold text-gray-900 mb-4 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          User Profile
        </motion.h1>

        {userdata.length > 0 ? (
          userdata.map((data, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg z-10 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src={data.image || "public/image/demo_image.jpg"}
                console
                className="w-24 h-24 rounded-full shadow-lg border-4 border-purple-500 object-cover"
                alt=""
                whileHover={{ scale: 1.1 }}
              />
              <h2 className="text-2xl font-semibold text-purple-700 mt-3">{data.name}</h2>
              <p className="text-gray-600 text-sm">{data.email}</p>
              <div className="flex gap-4 mt-3">
                <p className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm">Role: {data?.role}</p>
                <p className="bg-pink-100 text-pink-700 px-3 py-1 rounded-lg text-sm">
                  Joined: {new Date(data?.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Buttons Section */}
              <div className="flex gap-4 mt-6">
                <motion.button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 relative z-20 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={handleDelete}
                >
                  {isLoading ? <ThreeDots width={40} height={20} color='white'/> : 'Delete Account'}
                </motion.button>

                <motion.button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 relative z-20 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={()=>setShowModal(true)}
                >
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-gray-500 text-lg mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Fetching user data...
          </motion.p>
        )}
       {showModal && <Modal onClose={()=>setShowModal(false)}/>}
      </motion.div>
      
    </div>
  );
};

export default Profile;
