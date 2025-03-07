
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DynamicRoute = () => {
  const [userdata, setUserdata] = useState([]);
  const { movieID } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://llbbackend.vercel.app/videos/getvideopost/${movieID}`
        );
        if (res.status === 200) {
          setUserdata(Array.isArray(res.data) ? res.data : [res.data]);
        } else {
          console.log("Error: Data could not be fetched");
        }
      } catch (error) {
        console.log("Axios error:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [movieID]);

  useEffect(() => {
    const userrole = async () => {
      try {
        const res = await axios.get("https://llbbackend.vercel.app/manager/managerrole");
        setIsAdmin(res?.status === 200);
      } catch (error) {
        console.log(error);
        setIsAdmin(false);
      }
    };
    userrole();
  }, []);

  const DeletePost = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `https://llbbackend.vercel.app/videos/deletevideo/${id}`
      );
      if (res?.status === 200) {
        toast.success("Post deleted successfully!");
        navigate("/post");
      } else {
        toast.error("Error occurred, try again!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 py-10">
        {loadingData ? (
          <div className="w-full max-w-full sm:max-w-4xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6">
            <Skeleton height={400} width="100%" />
            <Skeleton height={40} width="60%" style={{ marginTop: 16 }} />
            <Skeleton height={30} width="80%" />
            <Skeleton height={30} width="90%" />
            <Skeleton height={30} width="100%" />
          </div>
        ) : (
          userdata.map((data) => (
            <motion.div
              key={data?._id}
              className="w-full max-w-full sm:max-w-4xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="w-full h-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              >
                {data.video ? (
                  <video
                    src={data.video}
                    controls
                    autoPlay
                    className="w-full max-h-[500px] object-cover rounded-t-2xl"
                  ></video>
                ) : (
                  <Skeleton height={400} width="100%" />
                )}
              </motion.div>

              <motion.div
                className="p-4 sm:p-6 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {isAdmin && (
                  <div className="flex flex-col sm:flex-row-reverse justify-between items-center gap-4">
                    <button
                      className="bg-red-600 py-2 text-lg sm:text-xl rounded-lg px-4 cursor-pointer transition-all duration-300 ease-in hover:bg-red-700 text-white flex items-center justify-center"
                      onClick={(e) => DeletePost(e, data._id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ThreeDots width={40} height={20} color="white" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                    <p className="text-sm sm:text-lg text-yellow-400">
                      📅 {data.createdAt ? new Date(data.createdAt).toLocaleString() : <Skeleton width={100} />}
                    </p>
                  </div>
                )}
                <h1 className="text-2xl sm:text-4xl font-bold my-4 text-indigo-400">
                  {data.heading || <Skeleton width={200} />}
                </h1>
                <p className="text-sm sm:text-lg text-gray-300 leading-relaxed text-justify">
                  {data.statement || <Skeleton width={300} />}
                </p>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </SkeletonTheme>
  );
};

export default DynamicRoute;
