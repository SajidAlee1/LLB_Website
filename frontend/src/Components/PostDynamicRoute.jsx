
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Skeleton,{SkeletonTheme} from "react-loading-skeleton";

const PostDynamicRoute = () => {
  const [postdata, setPostdata] = useState([]);
  const [isdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://llbbackend.vercel.app/posts/idpost/${id}`);
        if (res?.status === 200) {
          setPostdata([res.data]); // Ensure it's always an array
        } else {
          console.log("Error: Could not fetch post data.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const Admin = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get("https://llbbackend.vercel.app/manager/managerrole", {
          withCredentials: true,
        });
        setIsAdmin(res?.status === 200);
      } catch (error) {
        console.log(error);
      }
    };
    Admin();
  }, []);

  const deletepost = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`https://llbbackend.vercel.app/posts/deletepost/${id}`);
      if (res?.status === 200) {
        setIsLoading(false);
        toast.success("Post Deleted Successfully");
        navigate("/post");
      } else {
        setIsLoading(false);
        toast.error("Error Occurred! Try Again.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <motion.div
      className="py-10 px-4 sm:px-8 lg:px-20 xl:px-40 bg-gray-900 text-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {postdata?.map((data) => (
        <motion.div
          key={data?._id}
          className="space-y-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Post Title */}
          <div className="text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-extrabold text-green-500 border-b-4 border-green-600 inline-block pb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.heading ? data.heading : <Skeleton width="60%" />}
            </motion.h1>
          </div>

          {/* Post Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Image Section */}
            <motion.div
              className="w-full lg:w-1/2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {data?.image ? (
  <img src={data.image} alt="Post" className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg" />
) : (
  <Skeleton height={200} width="80%" />
)}
              
            </motion.div>

            {/* Text Section */}
            <motion.div
              className="w-full lg:w-1/2 space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {data?.statement ? data.statement : <Skeleton width="60%" />}
              </p>

              {isdmin && (
                <div className="flex justify-between flex-row-reverse">
                  <motion.button
                    className="bg-red-600 py-1 px-4 cursor-pointer transition-all duration-300 ease-in hover:bg-red-700 rounded-lg text-white text-lg md:text-xl font-normal"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deletepost(data?._id)}
                  >
                    {isLoading ? <ThreeDots width={40} height={20} color="white" /> : "Delete"}
                  </motion.button>
                  <p className="text-sm text-gray-500 italic">📅 {data.createdAt ? new Date(data.createdAt).toLocaleString() : <Skeleton width={80} />}</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
    </SkeletonTheme>
  );
};

export default PostDynamicRoute;
