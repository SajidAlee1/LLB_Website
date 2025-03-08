
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../config/api";
const Navbar = () => {
  const navigate = useNavigate();
  const [drop, setDrop] = useState(false);
  const [loggin,setLoggin] = useState(false)
  const [isAdmin,setIsAdmin] = useState(false)
  const [isManager,setIsManager] = useState(false)
   const [userdata, setUserdata] = useState([]);
   const [isopen,setIsopen] = useState(false)
  // const loggin = true
  const Logout = async () => {
    try {

      const res = await api.get('/auth/logout', {
        withCredentials: true, 
        headers:{
          'Content-Type':'application/json'
        }
      });
      
      if (res?.status === 200) {
        navigate('/login'); // Redirect to login on successful logout
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      // You can show a toast or a more user-friendly message for errors
    }
  };
  useEffect(()=>{
    const verify = async ()=>{
      try {
        const res = await api.get('/auth/verify',{
          withCredentials:true,
        })
        if(res?.status===200){
          // window.location.reload();
          setLoggin(true);
          console.log('User is loggedIn');
        }else{
          setLoggin(false)
          // window.location.reload();
        }
      } catch (error) {
        console.log(error)
        setLoggin(false)
      }
    }
    verify();
  },[])
  useEffect(()=>{
    const Admin = async ()=>{
      try {
        const res = await api.get('/admin/adminrole')
        if(res?.status===200){
          setIsAdmin(true)
        }else{
          setIsAdmin(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    Admin();
  },[]);
  useEffect(()=>{
    const Manager = async ()=>{
      try {
        const res = await api.get('/manager/managerrole')
        if(res?.status===200){
          setIsManager(true)
        }else{
          setIsManager(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    Manager();
  },[])
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
  
  return (
    <>
    <div className="w-full h-full py-2 shadow-xl bg-white hidden md:block  sticky top-0 z-50">
      <nav className="flex justify-between items-center px-6">
        <div className="flex items-center">
          {/* <img src="./public/image/lawlogo.jpg" alt="Img" className="w-14 h-10 rounded-2xl" /> */}
          <h3 className=" font-bold text-lg md:text-xl">Department of (LLB)</h3>
        </div>
        <ul className="flex justify-between items-center gap-4">
          {
            loggin ? (
              <>
              <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/post"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/getnotes"}
              className={({ isActive }) =>
                isActive
                  ? " transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              GetNotes
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/uploadsnotes"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              Upload Notes
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/info"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              Info
            </NavLink>
            </li>
          {
            isAdmin && 
            <li>
            <NavLink
              to={"/admin"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              Admin
            </NavLink>
          </li>
          }
          {
            isManager && 
            <li>
            <NavLink
              to={"/manager"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                  : "text-black"
              }
            >
              Manager
            </NavLink>
          </li>
          }
          
          <div className="relative inline-block">
            {userdata.map((data, index) => (
              <div key={index}>
                <motion.img
                  src={data.image || "public/image/demo_image.jpg"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-4 border-purple-500 shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={()=>setDrop(!drop)}
                />
              </div>
            ))}
            
            {/* Dropdown Menu */}
            {drop && (
              <ul className="absolute -left-4 mt-2 w-20 bg-white shadow-lg rounded-lg border border-gray-300 z-50">
                <li>
                  <NavLink
                    to={"/profile"}
                    className={({ isActive }) =>
                      isActive
                        ? "block px-3 py-2 transition-all duration-150 ease-in text-black rounded-lg"
                        : "block px-3 py-2 text-black hover:bg-gray-100"
                    }
                  >
                    Profile
                  </NavLink>
                </li>
                <button onClick={Logout} className="block px-3 py-2 text-black hover:bg-gray-100 cursor-pointer">Logout</button>
              </ul>
            )}
          </div>
              </>
            ):(
              <>
              <li>
            <NavLink
              to={"/signup"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold"
                  : "text-black"
              }
            >
              SignUp
            </NavLink>
            </li>
              <li>
            <NavLink
              to={"/login"}
              className={({ isActive }) =>
                isActive
                  ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold"
                  : "text-black"
              }
            >
              Login
            </NavLink>
            </li>
              </>
            )
          }
           
        </ul>
      </nav>
    </div>


    {/* For small screens */}

    <div className="w-full h-full py-2 shadow-xl bg-white md:hidden sticky top-0 z-50">
  <nav className="flex flex-col justify-between items-center px-6">
    <div className="flex flex-row justify-between items-center w-full">
      {/* Profile & Dropdown (only when logged in) */}
      {loggin && (
        <div className="relative">
          {userdata.length > 0 ? (
            <motion.img
              src={userdata[0].image || "/public/image/demo_image.jpg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shadow-md cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => setDrop(!drop)}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => setDrop(!drop)}
            >
              <span className="text-gray-700 font-semibold">?</span>
            </div>
          )}

          {/* Dropdown Menu */}
          {drop && (
            <ul className="absolute -left-4 mt-2 w-24 bg-white shadow-lg rounded-lg border border-gray-300 z-50">
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "block px-3 py-2 text-black rounded-lg bg-gray-100"
                      : "block px-3 py-2 text-black hover:bg-gray-100"
                  }
                >
                  Profile
                </NavLink>
              </li>
              <button
                onClick={Logout}
                className="block px-3 py-2 text-black hover:bg-gray-100 cursor-pointer w-full text-left"
              >
                Logout
              </button>
            </ul>
          )}
        </div>
      )}

      {/* Navbar Title */}
      <h3 className="font-bold text-lg md:text-xl">Department of (LLB)</h3>

      {/* Hamburger Menu */}
      <button
        className="relative flex flex-col justify-between w-8 h-6 cursor-pointer focus:outline-none"
        onClick={() => setIsopen(!isopen)}
      >
        <span
          className={`block h-0.5 w-8 transition-all duration-1000 ease-in ${
            isopen ? "rotate-45 translate-y-4 bg-red-700" : "bg-black"
          }`}
        ></span>
        <span
          className={`block h-0.5 w-8 transition-all duration-1000 ease-in ${
            isopen ? "opacity-0" : "opacity-100 bg-black"
          }`}
        ></span>
        <span
          className={`block h-0.5 w-8 transition-all duration-1000 ease-in ${
            isopen ? "-rotate-45 -translate-y-1.5 bg-red-700" : "bg-black"
          }`}
        ></span>
      </button>
    </div>

    {/* Menu Items */}
    {isopen && (
      <ul className="flex flex-col justify-center items-center transition-all duration-700 ease-in gap-4 mt-4">
        {loggin ? (
          <>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                    : "text-black"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/post"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                    : "text-black"
                }
              >
                Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/getnotes"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                    : "text-black"
                }
              >
                Get Notes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/uploadsnotes"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                    : "text-black"
                }
              >
                Upload Notes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/info"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                    : "text-black"
                }
              >
                Info
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive
                      ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                      : "text-black"
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}
            {isManager && (
              <li>
                <NavLink
                  to="/manager"
                  className={({ isActive }) =>
                    isActive
                      ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg"
                      : "text-black"
                  }
                >
                  Manager
                </NavLink>
              </li>
            )}
          </>
        ) : (
          <>
            {/* Show only Signup & Login when not logged in */}
            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold"
                    : "text-black"
                }
              >
                SignUp
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "transition-all duration-150 ease-in bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold"
                    : "text-black"
                }
              >
                Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    )}
  </nav>
</div>

    </>
  );
};

export default Navbar;
