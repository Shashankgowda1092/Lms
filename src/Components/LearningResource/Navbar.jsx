import React, { useState } from "react";
import { Navbar, Typography, Button, IconButton, Alert } from "@material-tailwind/react";
import { SimpleRegistrationForm } from "./UploadForm";
import { CustomTable } from "./CustomTable";
 
export default function NavbarDefault() {
  const [openNav, setOpenNav] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formDataList, setFormDataList] = useState([]);
  //const [editRowIndex, setEditRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCloseTimer, setAutoCloseTimer] = useState(null);
 
  const handleUploadButtonClick = () => {
    setShowForm(true);
  };
 
  const handleCloseForm = () => {
    setShowForm(false);
  };
 
  const handleFormSubmit = (data) => {
    const newRowData = { ...data, id: Date.now() };
    setFormDataList([...formDataList, newRowData]);
    setShowForm(false);
    setOpen(true);
    setAutoCloseTimer(setTimeout(() => {
      setOpen(false);
    }, 5000));
  };
 
  const handleDeleteRow = (id) => {
    const updatedFormDataList = formDataList.filter((item) => item.id !== id);
    setFormDataList(updatedFormDataList);
  };
 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
 
  const handleCloseAlert = () => {
    setOpen(false);
    clearTimeout(autoCloseTimer);
  };
 
  return (
    <>
      <Navbar className="w-full ml-16 bg-[#023047] px-4 py-2 lg:px-8 lg:py-4 flex justify-between items-center">
        <Typography
          as="a"
          href="#"
          className="cursor-pointer py-1.5 font-medium text-black-500 text-2xl"
        >
          Learning Resources
        </Typography>
 
 
        <div className="flex-grow flex justify-center ">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border rounded-md px-4 py-2 w-full sm:w-80 focus:outline-none text-black focus:border-black border-gray-400"
            style={{ color: 'black' }}
          />
        </div>
 
        <div>
        <Button  size="sm" className="bg-[#8ECAE6] hover:scale-110 ease-in-out duration-100 inline-block" onClick={handleUploadButtonClick}>      
             <span>Upload</span>
          </Button>
       
        </div>
      </Navbar>
 
      {showForm && (
        <div className="fixed inset-1 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <SimpleRegistrationForm
              setAlert={setOpen}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
 
      {!showForm && (
        <CustomTable
          tableRows={formDataList}
          onDeleteRow={handleDeleteRow}
          searchQuery={searchQuery}
        />
      )}
 
      {!showForm && (
        <Alert open={open} onClose={handleCloseAlert} className="absolute top-3 right-[380px] w-2/5">
          Successfully Uploaded...
        </Alert>
      )}
    </>
  );
}