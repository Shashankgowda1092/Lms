import React, { useEffect, useState } from 'react';
import profile from "../../Assets/pro.png";
import useAuth from '../../Hooks/useAuth';
import axios from "../../Api/axios";
 
const UserProfileDetails = ({ onClose }) => {
  const {auth}  = useAuth();
 
  const [users, setUsers] = useState([]);
  const [employeeID, setEmployeeId] = useState("");
  const [batches, setBatches] = useState([]);
  // const { auth } = useAuth();
  const [user, setUser] = useState("");
 
  function handleUserDialog() {
    setIsUserDialogOpen(false);
  }
 
  const fetchUserDetails = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_GOWSIC}/user/all`)
      .then((response) => {
        //  console.log(response.data[0].firstName);
        // console.log(response.data);
        setUsers(response.data);
        fetchUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  const fetchUser = () => {
    const foundUser = users.find((user) => user.firstName === auth.username);
    if (foundUser) {
      setEmployeeId(foundUser.employeeId);
      setUser(foundUser);
    } else {
      console.error("User not found");
    }
  };
 
  const userBatchList = () => {
    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/employee/batches/${employeeID}`)
      .then((response) => {
        // console.log(response.data);
        setBatches(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  console.log(employeeID);
  console.log(typeof employeeID);
 
  useEffect(() => {
    fetchUserDetails();
  }, []);
 
  useEffect(() => {
    fetchUser();
  }, [users]);
 
  useEffect(() => {
    userBatchList();
  }, [user]);
 
 
  return (
    <>
      {/* Semi-transparent background overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
      {/* User details card */}
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg shadow-lg p-6 max-w-md z-50'>
        {/* Close button */}
        <button className="absolute top-0 right-0 px-3 py-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
          {/* Replace this with your close icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* User profile content */}
        <img src={profile} alt="" />
        <p className='text-blue-800 text-lg font-semibold mb-4'>Profile Information</p>
        <div className="flex flex-col space-y-2">
          <p><span className="font-semibold">Name:</span>{auth.username} </p>
          <p><span className="font-semibold">Email:</span>{auth.email} </p>
          <p><span className="font-semibold">Employee ID:</span> EmployeeId: {auth.empID}</p>
        </div>
      </div>
    </>
  );
}
 
export default UserProfileDetails;
 