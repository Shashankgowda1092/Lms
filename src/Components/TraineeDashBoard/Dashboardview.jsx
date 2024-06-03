// Dashboardview.js
import React, { useState } from 'react';
import { FaSearch, FaRegBell } from "react-icons/fa";
import profile from "../../Assets/pro.png";
import UserProfileDetails from './UserProfileDetails'; // Import the UserProfileDetails component
import LogoutConfirmationDialog from './LogoutConfirmationDialog'; // Import the LogoutConfirmationDialog component
import AuthService from '../../Api/services/AuthService';
import useAuth from '../../Hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import lms1 from '../../Assets/lms1.png'



const Dashboardview = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openProfileDetails, setOpenProfileDetails] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State to control logout popup
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // State to control logout confirmation dialog
    const {auth,setAuth} = useAuth();
    const {navigate} = useNavigate();
    const toggleDropdown = () => {
        setOpenDropdown(!openDropdown);
        setOpenProfileDetails(false); // Close profile details when dropdown is toggled
    }

    const toggleProfileDetails = () => {
        setOpenProfileDetails(!openProfileDetails);
    }

    

    const closeProfileDetails = () => {
        setOpenProfileDetails(false);
    }

    const handleLogout = () => {
        setShowLogoutConfirmation(true); 
        setOpenDropdown(false); 
    }

    const confirmLogout = () => {
      
        setShowLogoutPopup(true); 
        setTimeout(() => setShowLogoutPopup(false), 2000); 
        setShowLogoutConfirmation(false); 
        AuthService.logout(setAuth, navigate);
    }

    const cancelLogout = () => {
        setShowLogoutConfirmation(false); 
    }

    return (
        <div  style={{userSelect:"none"}}>
            <div className='flex items-center justify-between
             h-[70px] shadow-lg px-[55px] ' >
                {/* <div className='flex items-center rounded-[5px]'>
                    <input type="text" className='bg-[#F8F9FC] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal' placeholder='Search for...' />
                    <div className='bg-black h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]'>
                        <FaSearch color='white' />
                    </div>
                </div> */}
              <div className='flex items-center rounded-[5px]'>
              <div className=' w-[150px]  bg-[#4E73DF]    relative z-40' >
              {/* <h1 className='text-black  leading-[24px] font-extrabold cursor-pointer text-4xl'>LMS </h1>  */}
              <img src={lms1} alt="lms1" className='absolute w-24 h-18 top-[-5px]' />
              </div>
                </div>
                <div className='flex items-center gap-[20px]'>
                
                    <div className='flex items-center gap-[25px] border-r-[1px] pr-[25px]'>
                       
                    </div>
                    <div className='flex items-center gap-[15px] relative'>
                        {/* <p>{auth.username} </p> */}
                        <div className='h-[50px] w-[50px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative z-40' onClick={toggleDropdown}>
                            <img src={profile} alt="" />
                        </div>
                        {openDropdown && (
                            <div className='bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]'>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={toggleProfileDetails}>Profile</p>
                                <p className='cursor-pointer hover:text-blue-500 font-semibold'><Link to="/change-password">Change Password</Link></p>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={handleLogout}>Logout</p> {/* Logout button */}
                            </div>
                        )}
                        {showLogoutPopup && ( // Display Logout Successful popup
                            <div className="bg-white border rounded-lg shadow-md absolute bottom-[-40px] right-0 z-20 p-2">
                            <p className="text-sm font-medium text-gray-800">Logout Successful</p>
                        </div>
                        
                        )}
                        {openProfileDetails && <UserProfileDetails onClose={closeProfileDetails} />}
                    </div>
                </div>
            </div>
            {showLogoutConfirmation && (
                <LogoutConfirmationDialog onConfirm={confirmLogout} onCancel={cancelLogout} />
            )}
        </div>
    );
}

export default Dashboardview;
