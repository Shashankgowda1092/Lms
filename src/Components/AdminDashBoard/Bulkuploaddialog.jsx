import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
 
} from "@material-tailwind/react";
import BulkUploadForm from "./Bulkupload";
 
export function Bulkuploaddialog({BulkuploadOpen , setShowBulkUpload}) {
 
 
  return (
    <div >
      <Dialog open={BulkuploadOpen} >
        <DialogHeader className="bg-[#023047] text-white h-[300] font-bold py-3 px-5 rounded">Bulkupload Users</DialogHeader>
        <DialogBody>
        <BulkUploadForm setShowBulkUpload={setShowBulkUpload}/>
        </DialogBody> 
       
      </Dialog>
    </div>
  );
}