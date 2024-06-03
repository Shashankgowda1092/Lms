import axios from "axios";
import React, { createElement, useState } from "react";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { myHeaders } from '../../Services/IpAddress';

export function BulkUploadForm({ setShowBulkUpload }) {
  const [file, setFile] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [cancel, setCancel] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;

      if (
        fileType === "application/vnd.ms-excel" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
      } else {
        alert("Please select a valid Excel file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = sessionStorage.getItem('auth');

      const response = await fetch(
        `${import.meta.env.VITE_API_GOWSIC}/user/upload`,
        {
          method: "POST",
          headers: {...myHeaders,
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus("Upload successful!");
      } else {
        setUploadStatus("Upload failed. Please try again later.");
      }
    } catch (error) {
      if (error.name === "SyntaxError") {
        console.error("Duplicate user data detected:", error);
        setUploadStatus("Some users already exist in the database.");
      } else {
        console.error("Error uploading file:", error);
        setUploadStatus("An error occurred. Please try again later.");
      }
    }
  };
  const handleCancel = () => {
    setShowBulkUpload(false);
  };

  const downloadFileAtUrl = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const token = sessionStorage.getItem('auth');
      const XLSX_URL = `${import.meta.env.VITE_API_GOWSIC}/user/format`;
  
      const response = await axios.get(XLSX_URL, {
        responseType: 'blob', // Set responseType to 'blob' for file download
        headers: {
          Authorization: `Bearer ${token}`, // Include authorization token in headers
        },
      });
  
      // Create a blob URL for the file
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary link and trigger the download
      const aTag = document.createElement("a");
      aTag.href = url;
      aTag.setAttribute("download", "filename.xlsx"); // Set filename as needed
      document.body.appendChild(aTag);
      aTag.click();
  
      // Cleanup
      document.body.removeChild(aTag);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle error if needed
    }
  };
  


  return (
    <div style={{ userSelect: "none" }}>
      <form>
        <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            type="submit"
            className="mr-2 bg-[#023047]  text-white font-bold py-2 px-4 rounded"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-[#023047]  text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          
            <button className="bg-[#023047]  text-white font-bold py-2 px-4 rounded ml-2" onClick={(e)=>downloadFileAtUrl(e)}>
              Download Excel Format
            </button>

        </div>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
      {cancel && <p>{cancel} </p>}
    </div>
  );
}

export default BulkUploadForm;
