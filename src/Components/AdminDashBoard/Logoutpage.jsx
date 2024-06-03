import React, { useState } from "react";

 const  Logoutpage = ({ setShowLogoutPopup }) => {
  
  const confirmLogout = () => {
    console.log("Logout confirmed");
    setShowLogoutPopup(false);
  };

  const cancelLogout = () => {
    console.log("Logging out...");
    window.location.href = '/login';
  };
  return (
    <div className="logout-popup bg-white" style={{ userSelect: "none" }}>
      <p>Are you sure you want to logout?</p>
      <button onClick={cancelLogout} className="bg-[#023047]  text-white font-bold py-2 px-4 rounded ml-2">Yes</button>
      <button onClick={confirmLogout} className="bg-[#023047]  text-white font-bold py-2 px-4 rounded ml-2">No</button>
    </div>
  );
};
export default Logoutpage;