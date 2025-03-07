
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ThreeDots } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EntireNotes = ({ onClose }) => {
  const [notesData, setNotesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const refModel = useRef();

  const closeMenu = (e) => {
    if (refModel.current === e.target) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('https://llbbackend.vercel.app/notes/allnotes');
        if (res?.status === 200) {
          setNotesData(Array.isArray(res.data) ? res.data : [res.data]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchNotes();
  }, []);

  const Delete = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`https://llbbackend.vercel.app/notes/deletenotes/${id}`);
      if (res?.status === 200) {
        setNotesData((prevData) => prevData.filter((note) => note._id !== id));
        toast.success('Deleted Successfully');
      } else {
        toast.error('Error: Notes could not be deleted');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={refModel}
        onClick={closeMenu}
        className="fixed inset-0 backdrop-blur-md flex justify-center items-center bg-black/50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white text-black p-6 rounded-2xl shadow-lg w-full max-w-4xl h-auto max-h-[90vh] overflow-y-auto relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <button onClick={onClose} className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer">
            <X size={28} />
          </button>
          <h2 className="text-xl font-semibold text-center mb-4">Notes Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {isFetching ? (
              Array(3).fill().map((_, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <Skeleton height={160} />
                  <Skeleton height={20} className="mt-2" />
                  <Skeleton height={15} className="mt-1" />
                  <Skeleton height={15} className="mt-1" />
                  <Skeleton height={15} className="mt-1" />
                  <Skeleton height={40} className="mt-3" />
                </div>
              ))
            ) : (
              notesData?.map((data) => (
                <motion.div
                  key={data?._id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <img className="w-full h-40 object-cover rounded-lg mb-2" src="public/image/notesimg8.jpg" alt="Notes" />
                  <h3 className="text-lg font-bold">Subject: {data.subjectName}</h3>
                  <p className="text-sm text-gray-700">Department: {data.department}</p>
                  <p className="text-sm text-gray-700">Semester: {data.semester}</p>
                  <p className="text-sm text-gray-700">Year: {data.year}</p>
                  <div className="flex gap-3 mt-3">
                    <a href={data.file} rel="noopener noreferrer">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition" target="_blank">View Notes</button>
                    </a>
                    <button onClick={() => Delete(data?._id)} className="bg-red-500 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-red-600 transition">
                      {isLoading ? <ThreeDots width={40} height={20} color='white' /> : 'Delete'}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EntireNotes;
