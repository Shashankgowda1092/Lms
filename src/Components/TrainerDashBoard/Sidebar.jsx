import React from 'react';
import { IoIosHome } from "react-icons/io";
import { FaLayerGroup, FaChevronRight,FaStickyNote } from "react-icons/fa";
import { Link } from 'react-router-dom';
 
import logo from '../../Assets/logo.svg';
 
const Sidebar = () => {
   
    return (
        <div className=" w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-100/5 bg-[#023047] text-white h-full">
 
            <div className="flex items-center justify-center py-6">
            <img src={logo} alt="logo" className="w-full h-auto text-white bg-white" />
            </div>
            <div className='flex items-center gap-[15px] py-[20px] cursor-pointer'>
                <IoIosHome color='white' />
                <Link to="/" className='text-[17px] leading-[20px] font-bold text-white'>Home</Link>
            </div>
            <div className='pt-[15px]'>
                <Link to="/courses" className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <FaLayerGroup color='white' />
                    <p className='text-[17px] leading-[20px] font-normal text-white'>Course List</p>
                    <FaChevronRight color='white' />
                </Link>
            </div>

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
    )
}
 
export default Sidebar;