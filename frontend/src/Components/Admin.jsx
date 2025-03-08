import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { motion } from "framer-motion"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'
import EntireNotes from './EntireNotes'
import Postsend from './Postsend'
import UserTable from './UserTable'
import Videopost from './Videopost'
const Admin = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    const admin = async ()=>{
      try {
        const res = await api.get('/admin/adminrole',{
          withCredentials:true
        })
        if(res?.status===200){
          console.log('Amin access for this page')
        }else{
          navigate('/')
        }
      } catch (error) {
        console.log(error)
        toast.error('You are not allowed to access this page')
        navigate('/')
      }
    }
    admin();
  },[])
  const [postOpen,setPostOpen] = useState(false)
  const [videoOpen,setVideoOpen] = useState(false)
  const [usertable,setUsertable] = useState(false)
  const [entireNotes,setEntireNotes] = useState(false)
  return (
    <div className='flex flex-col'>
      <div className='flex justify-center items-center'>
      <h1 className='bg-gradient-to-tr from-purple-600 to-pink-500 bg-clip-text text-transparent text-clip text-center text-4xl md:text-5xl font-extrabold border-b-4 border-green-600 leading-normal antialiased inline-block'>Admin Page</h1>
      </div>
      <div className='flex flex-col md:flex-row justify-around items-center gap-8 md:gap-0 py-6 md:py-4'>
        <button className=' rounded-4xl' onClick={()=>setPostOpen(true)}>
        <Card sx={{ maxWidth: 345 }} className='rounded-2xl'>
      <CardActionArea>
        <motion.img src='/public/image/postimage2.avif' alt='img' animate={{y:[0,-14,0]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}}/>
          
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Post Panel
          </Typography>
          <Typography variant="body2"  className=' leading-relaxed text-yellow-500'>
          This panel serves as a dynamic control hub for managing all posts, including exciting events, passionate discussions, and enthusiastic engagements.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </button>
        <button className=' rounded-4xl' onClick={()=>setUsertable(true)}>
        <Card sx={{ maxWidth: 345 }} className='rounded-2xl'>
      <CardActionArea>
        <motion.img src='/public/image/userprofile4.avif' alt='img' animate={{y:[0,-14,0]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}}/>
          
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Userdata Panel
          </Typography>
          <Typography variant="body2"  className=' leading-relaxed text-yellow-500'>
          "This panel features a dynamic table showcasing user profiles, complete with administrative controls to manage and delete users effortlessly."
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </button>
      </div>
      <div className='flex flex-col md:flex-row justify-around items-center gap-8 md:gap-0 py-6 md:py-4'>
        <button className=' rounded-4xl'onClick={()=>setVideoOpen(true)}>
        <Card sx={{ maxWidth: 345 }} className='rounded-2xl'>
      <CardActionArea>
        <motion.img src='/public/image/video.avif' alt='img' animate={{y:[0,-14,0]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}}/>
          
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Video Panel
          </Typography>
          <Typography variant="body2"  className=' leading-relaxed text-yellow-500'>
          "This panel is designed to showcase inspiring event and activity videos, motivating aspiring students to grow, excel, and shine!"
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </button>
        <button className=' rounded-4xl' onClick={()=>setEntireNotes(true)}>
        <Card sx={{ maxWidth: 345 }} className='rounded-2xl'>
      <CardActionArea>
        <motion.img src='/public/image/notesadmin4.avif' alt='img' animate={{y:[0,-14,0]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}}/>
          
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Notes Administrative Panel
          </Typography>
          <Typography variant="body2"  className=' leading-relaxed text-yellow-500'>
          This panel is equipped with essential controls to manage website notes efficiently, ensuring that only accurate and valuable information is delivered
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </button>
        {
          postOpen &&
        <Postsend onClose={()=>setPostOpen(false)}/>
        }
        {
          videoOpen && 
          <Videopost onClose={()=>setVideoOpen(false)}/>
        }
        {
          usertable && 
          <UserTable onClose={()=>setUsertable(false)}/>
        }
        {
          entireNotes &&
          <EntireNotes onClose={()=>setEntireNotes(false)}/>
        }
        
      </div>
    </div>
  )
}

export default Admin
