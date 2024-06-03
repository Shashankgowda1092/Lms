import React from 'react'
import { FaTachometerAlt, FaRegSun, FaBookOpen , FaStickyNote, FaRegChartBar, FaRegCalendarAlt, FaChevronRight, FaChevronLeft, FaBolt, FaLayerGroup } from "react-icons/fa"
import { IoNotifications } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";
import { Link } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import logo from '../../Assets/logo.svg';
const Sidebar = () => {
    const {auth}  = useAuth();
    return (
        <>
       
        <div  className=" w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-100/5 bg-[#023047] text-white h-full">
           
            <img src={logo} className='bg-white' alt="logo"/>
           
            <div className='px-[15px] py-[30px] flex items-center justify-center '>
            </div>
            <div className='flex items-center gap-[15px] py-[20px]  '>
                <FaTachometerAlt color='white' />
                <p className='text-[14px] leading-[20px] font-bold text-white '>Dashboard</p>
            </div>
            <div>
               
                <Link to="/lms/batch" className='flex items-center justify-between gap-[10px] py-[15px] hover:scale-125 ease-in-out duration-300 cursor-pointer'>
                    <div className='flex items-center gap-[10px]  '>
                        <GiProgression  color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Progress</p>
                    </div>
                    <FaChevronRight color='white' />
                </Link>
             <Link to="#" className='flex items-center justify-between gap-[10px] py-[15px] hover:scale-125 ease-in-out duration-300  cursor-pointer'>
                <div className='flex items-center gap-[10px]'>
                    <IoNotifications color='white' />
                    <p className='text-[14px] leading-[20px] font-normal text-white'>Notifications</p>
                </div>
                <FaChevronRight color='white' />
            </Link>
            </div>
            <div >
               
               <Link to="#" className='flex items-center justify-between gap-[10px] py-[15px] hover:scale-125 ease-in-out duration-300  cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaStickyNote color='white' />
                        <p className='text-[14px] leading-[20px] font-normal text-white'>Report</p>
                    </div>
                    <FaChevronRight color='white' />
                </Link>
               
                <Link to="#" className='flex items-center justify-between gap-[10px] py-[15px]  hover:scale-125 ease-in-out duration-300 cursor-pointer'>
                <div className='flex items-center gap-[10px]'>
                        <FaLayerGroup color='white' />
                        <p className='text-[14px] leading-[20px] font-normal text-white'>Batches</p>
                    </div>
                    <FaChevronRight color='white' />
                </Link>
               
               
            </div>
           
           
           
        </div>
        </>
    )
}
 
export default Sidebar