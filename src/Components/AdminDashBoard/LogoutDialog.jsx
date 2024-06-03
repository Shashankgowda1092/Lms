import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
 
} from "@material-tailwind/react";

import Logoutpage from "./Logoutpage";
 
export function LogoutDialog({showLogoutPopup , setShowLogoutPopup}) {
 
 
  return (
    <div className=" " style={{ userSelect: "none" }}>
      <Dialog open={showLogoutPopup} >
        <DialogHeader className="bg-[#023047] text-white h-[300] font-bold py-3 px-5 rounded">Logout</DialogHeader>
        <DialogBody>
        <Logoutpage
        setShowLogoutPopup={setShowLogoutPopup}
        />
        </DialogBody>
       
      </Dialog>
    </div>
  );
}