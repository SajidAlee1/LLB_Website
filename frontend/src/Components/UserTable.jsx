
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import api from '../config/api';

const UserTable = ({ onClose }) => {
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const modelref = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/getuser');
        if (res.status === 200) {
          setUserdata(Array.isArray(res.data) ? res.data : [res.data]);
        }
      } catch (error) {
        console.error('Error fetching users:', error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const closeMenu = (e) => {
    if (modelref.current && !modelref.current.contains(e.target)) {
      onClose();
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/deleteuser/${id}`);
      setUserdata(userdata.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data || error.message);
    }
  };

  const handleAddAsManager = async (id, e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/auth/addmanager/${id}`);
      if (res?.status === 200) {
        setUserdata(userdata.map(user => 
          user._id === id ? { ...user, role: "Manager" } : user
        ));
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user role:", error?.response?.data || error.message);
    }
  };

  return (
    <div onClick={closeMenu} className="fixed inset-0 backdrop-blur-md flex justify-center items-center bg-black/50 p-4">
      <motion.div 
        ref={modelref}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-3xl"
      >
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <h1 className="text-xl text-white font-semibold">User Management</h1>
          <button onClick={onClose} className="text-white text-2xl font-bold hover:text-gray-300 cursor-pointer">×</button>
        </div>

        <TableContainer component={Paper} className="p-4">
          <Table sx={{ minWidth: 700 }} aria-label="user table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell align="right"><strong>Email</strong></TableCell>
                <TableCell align="right"><strong>Role</strong></TableCell>
                <TableCell align="right"><strong>Joined</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell align="right"><Skeleton /></TableCell>
                    <TableCell align="right"><Skeleton /></TableCell>
                    <TableCell align="right"><Skeleton /></TableCell>
                    <TableCell align="right"><Skeleton width={100} /></TableCell>
                  </TableRow>
                ))
              ) : userdata.length > 0 ? (
                userdata.map((user) => (
                  <TableRow 
                    key={user._id} 
                    component={motion.tr}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">{user.role || "User"}</TableCell>
                    <TableCell align="right">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex gap-2">
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </Button>
                        {user.role !== "manager" && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setSelectedUser(user)}
                          >
                            Manager
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {selectedUser && (
        <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
          <DialogTitle>Make {selectedUser.name} a Manager?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setSelectedUser(null)} color="secondary">
              Cancel
            </Button>
            <Button onClick={(e) => handleAddAsManager(selectedUser._id, e)} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default UserTable;
