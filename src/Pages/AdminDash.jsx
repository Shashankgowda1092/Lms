import { Button } from "@material-tailwind/react";
import React from "react";
import { Link, Route, Router, Routes } from "react-router-dom";
import Dashboard from "../Components/AdminDashBoard/Dashboard";
import UserListPage from "../Components/AdminDashBoard/Userslist";

const AdminDash = () => {
  return (
    <div className=" flex justify-center items-center w-full h-screen">
    
        <Dashboard />
    
    
    </div>
  );

//   <div className=" flex justify-center items-center w-full h-screen">
//   <h1 className="text-4xl">Admin Dash</h1>
//   <Link to="/batch-list">
//     <Button>batch list</Button>
//   </Link>
//   <Routes>
//     <Route path="/dashboard/admin" element={<Dashboard />} />
//     <Route path="/dashboard/admin/userlist" element={<UserListPage />} />
//   </Routes>
// </div>

  // return (
  //   <div className="flex justify-center h-screen">
  //     <Routes>
  //       <Route path="/dashboard/admin" element={<Dashboard />} />
  //       <Route path="/dashboard/admin/userlist" element={<UserListPage />} />
  //     </Routes>
  //   </div>
  // );
};

export default AdminDash;
