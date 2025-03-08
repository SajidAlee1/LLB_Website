
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { motion } from "framer-motion";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const steps = ["Fill Details", "Upload Notes", "Confirmation"];

// Create Context
const FormContext = createContext();

const UploadNotes = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    year: "",
    semester: "",
    subjectName: "",
    description: "",
    name:"",
    phone:"",
    file: null,
  });

  const handleSubmit= async (e)=>{
    e.preventDefault();
    try {
      const {department,year,semester,subjectName,description,name,phone,file} = formData;
      if(!department.trim()||!year.trim()||!semester.trim()||!subjectName.trim()||!description.trim()||!name.trim()||!phone.trim()||!file){
        toast.error('All fields are required')
        return;
      };
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
      const descriptionRegex = /^[A-Za-z0-9\s.,'";:!?()-]{10,300}$/;
      if(!descriptionRegex.test(description)){
        toast.error('Description must be between 10-300 characters and can only contain letters, numbers, spaces, and common punctuation')
        return;
      }
      const phoneRegex = /^\d{11}$/;
      if(!phoneRegex.test(phone)){
        toast.error('Phone number must be exactly 11 digits long')
        return;
      }
      try {
        const formdata = new FormData();
        if(formData.file) formdata.append('file',file);
        if(formData.department) formdata.append('department',department);
        if(formData.name) formdata.append('name',name);
        if(formData.description) formdata.append('description',description);
        if(formData.phone) formdata.append('phone',phone);
        if(formData.semester) formdata.append('semester',semester);
        if(formData.subjectName) formdata.append('subjectName',subjectName);
        if(formData.year) formdata.append('year',year);
        
        const res = await api.post('/notes/uploadnotes',formdata)
        if(res?.status===200){
          toast.success('Notes Uploaded Successfully');
          navigate('/')
          window.location.reload();
        }else{
          toast.error('Error Occurred TryAgain!')
        }
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get("/auth/verify");
        if (res?.status !== 200) {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };
    verify();
  }, [navigate]);

  const handleNext = async (e) => {
    if (activeStep === steps.length - 1) {
      setLoading(true); // Start loading
      await handleSubmit(e); // Submit form
      setLoading(false); // Stop loading after submission
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <FormContext.Provider value={{ formData, setFormData,handleSubmit }}>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-blue-500 to-green-400 overflow-hidden p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative z-10 bg-white bg-opacity-40 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden w-full max-w-[1200px] flex flex-col-reverse md:flex-row-reverse md:h-auto border border-gray-300"
        >
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2 p-10 flex flex-col justify-center"
          >
            <Box sx={{ width: "100%", mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <StepContent activeStep={activeStep} />
            <div className="flex justify-between mt-6">
              <Button onClick={handleBack} disabled={activeStep === 0} className="px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 transition rounded-lg">
                Back
              </Button>
              <Button
  onClick={handleNext}
  disabled={loading}
  className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded-lg flex items-center"
>
  {loading ? (
    <ThreeDots height="20" width="40" color="blue" />
  ) : (
    activeStep === steps.length - 1 ? "Finish" : "Next"
  )}
</Button>
            </div>
          </motion.div>
          <motion.div className="w-full md:w-1/2 flex justify-center items-center bg-gray-800 bg-opacity-30 p-8 relative overflow-hidden">
          <motion.img
            src="/image/lawlogo2.webp"
            alt="Law Logo"
            className="w-full h-auto object-contain max-w-sm md:max-w-md"
            animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
          />
          </motion.div>
        </motion.div>
      </div>
    </FormContext.Provider>
  );
};

const StepContent = ({ activeStep }) => {
  const { formData, setFormData } = useContext(FormContext);

  return (
    <>
      <h2 className="text-4xl font-extrabold text-black text-center lg:text-left drop-shadow-lg">Welcome</h2>
      <p className="text-lg text-gray-800 mt-2 text-center lg:text-left">
        {activeStep === 0 ? "Fill in the details below to upload your notes." :
         activeStep === 1 ? "Upload your notes in the given format." : "Confirm your submission."}
      </p>

      {activeStep === 0 && (
        <form className="mt-6 space-y-6">
          <InputField required label="Department" value={formData.department} onChange={(val) => setFormData({ ...formData, department: val })} />
          <InputField required label="Year" value={formData.year} onChange={(val) => setFormData({ ...formData, year: val })} />
          <InputField required label="Semester" value={formData.semester} onChange={(val) => setFormData({ ...formData, semester: val })} />
          <InputField required label="Subject Name" value={formData.subjectName} onChange={(val) => setFormData({ ...formData, subjectName: val })} />
        </form>
      )}

      {activeStep === 1 && (
        <form className="mt-6 space-y-6">
        <InputField required label="Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
        <InputField required label="Phone" value={formData.phone} onChange={(val) => setFormData({ ...formData, phone: val })} />
          <TextAreaField label="Description" value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} />
          <FileInputField label="Upload File" onChange={(file) => setFormData({ ...formData, file })} />
        </form>
      )}

      {activeStep === 2 && (
        <div className="mt-6 space-y-4">
          <p><strong>Department:</strong> {formData.department}</p>
          <p><strong>Year:</strong> {formData.year}</p>
          <p><strong>Semester:</strong> {formData.semester}</p>
          <p><strong>Subject Name:</strong> {formData.subjectName}</p>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Description:</strong> {formData.description}</p>
          <p><strong>Uploaded File:</strong> {formData.file ? formData.file.name : "No file uploaded"}</p>
          
        </div>
      )}
    </>
  );
};

const InputField = ({ label, value, onChange }) => (
  <motion.div className="flex flex-col space-y-1">
    <label className="font-medium text-black">{label}*</label>
    <input
      type="text"
      placeholder={`Enter your ${label.toLowerCase()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-400 bg-white text-black placeholder-gray-600 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 shadow-md transition"
    />
  </motion.div>
);

const TextAreaField = ({ label, value, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label className="font-medium text-black">{label}*</label>
    <textarea
      placeholder={`Enter ${label.toLowerCase()}`}
      value={value}
      required
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-400 bg-white text-black placeholder-gray-600 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 shadow-md transition"
    />
  </div>
);

const FileInputField = ({ label, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label className="font-medium text-black">{label}*</label>
    <input required type="file" accept=".pdf" onChange={(e) => onChange(e.target.files[0])} />
  </div>
);

export default UploadNotes;
