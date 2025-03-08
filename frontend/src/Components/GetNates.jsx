
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux'
import { notesdata } from "../redux/counter/counterSlice";
import api from '../config/api';

const initialSate = {
  department:'',
  year:'',
  semester:'',
  subjectName:''
}
const GetNotes = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [notes,setNotes] = useState([])
  const [state,setState] = useState(initialSate)
  const [isLoading,setIsLoading] = useState(false)
  useEffect(()=>{
    const verify = async ()=>{
      try {
        const res = await api.get('/auth/verify');
        if(res?.status===200){
          console.log('User is loggedIn')
        }else{
          navigate('/login')
        }
      } catch (error) {
       console.log(error) 
       navigate('/login')
      }
    }
    verify();
  },[]);

  const handleChange = (event)=>{
    setState({...state,[event.target.name]:event.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {department,year,semester,subjectName} = state;
    if(!department.trim()|| !year.trim()|| !semester.trim()||!subjectName.trim()){
      toast.error('All fields are required')
      return;
    }
    const departmentRegex = /^[A-Za-z\s&-]{3,50}$/; 
      if(!departmentRegex.test(department)){
        toast.error('Department name must be 3-50 characters long and can only contain letters, spaces, hyphens (-), and ampersands (&)')
        return;
      }
      const yearRegex = /^\d{4}$/;
      if(!yearRegex.test(year)){
        toast.error('Year must be a 4-digit number')
        return;
      }
      const semesterRegex = /^(1st|2nd|3rd|[4-8]th)$/;
      if(!semesterRegex.test(semester)){
        toast.error("Semester must be in the format: '1st', '2nd', '3rd', '4th', ..., '8th'.")
          return;
      }
      const subjectNameRegex = /^[A-Za-z\s-]{3,50}$/;
      if(!subjectNameRegex.test(subjectName)){
        toast.error('Subject name must be between 3-50 characters and can only contain letters, spaces, and hyphens')
        return;
      }
    try {
        setIsLoading(true);
        const res = await api.post('/notes/findnotes', state);

        if (res.status === 200) {
            console.log('API Response:', res.data);
            setIsLoading(false);
            toast.success('We got your choice successfully');
            setNotes(res.data);
            dispatch(notesdata(res.data));
            console.log('Navigating to /shownotes');
            navigate('/shownotes');
        } else {
            toast.error('Sorry, we do not have your desired notes');
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        setIsLoading(false);
        toast.error('Sorry, we do not have your desired notes');
    }
};

  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-[1200px] flex flex-col-reverse md:flex-row-reverse md:h-auto"
      >
        
        {/* Right Section - Form */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full md:w-1/2 p-6 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center lg:text-left">Welcome</h2>
          <p className="text-lg text-gray-600 mt-2 text-center lg:text-left">
            Please fill the following to get your note.
          </p>
          <p className="text-red-600 text-lg mt-2 text-center lg:text-left">
            Note: Must follow form format.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Department */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col space-y-1"
            >
              <label htmlFor="department" className="font-medium text-gray-700">Department*</label>
              <input
                id="department"
                type="text"
                placeholder="Enter your department"
                value={state.department}
                onChange={handleChange}
                name="department"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </motion.div>

            {/* Year */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className="flex flex-col space-y-1"
            >
              <label htmlFor="year" className="font-medium text-gray-700">Year*</label>
              <input
                id="year"
                type="text"
                placeholder="Enter your year"
                required
                value={state.year}
                onChange={handleChange}
                name="year"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </motion.div>

            {/* Semester */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
              className="flex flex-col space-y-1"
            >
              <label htmlFor="semester" className="font-medium text-gray-700">Semester*</label>
              <input
                id="semester"
                type="text"
                name="semester"
                required
                value={state.semester}
                onChange={handleChange}
                placeholder="Enter your semester"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </motion.div>

            {/* Subject Name */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              className="flex flex-col space-y-1"
            >
              <label htmlFor="subjectName" className="font-medium text-gray-700">Subject Name*</label>
              <input
                id="subjectName"
                type="text"
                placeholder="Enter subject name"
                required
                name="subjectName"
                value={state.subjectName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </motion.div>

            {/* Animated Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 cursor-pointer transition duration-300"
            >
              <div className="flex justify-center items-center">
              {isLoading ? <ThreeDots height={20} width={40} color="white"/>:'Submit'}
              </div>
            </motion.button>
          </form>
        </motion.div>

        {/* Left Section - Image */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex justify-center items-center bg-gray-200 p-4"
        >
          <motion.img
            src="/image/lawlogo2.webp"
            alt="Law Logo"
            className="w-full h-auto object-contain"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default GetNotes;
