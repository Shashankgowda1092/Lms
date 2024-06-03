import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import checkmark from "../Assets/completed.gif";
import PropTypes from "prop-types";
import { sendExcelUserFile } from "../Services/allEmployee";
import "../styles/checkmarkAnimation.css";
import { fetchBatchSize } from "../Services/allEmployee.js";
import * as XLSX from "xlsx"; // Import XLSX library
import ExcelFormatBulkUpload from "../Assets/ExcelFormatBulkUpload.png";
import { downloadFile } from "../Services/allEmployee";
import { MdAttachFile } from "react-icons/md";
const FileModal = ({ handleOpen, open, handleClose, data, setFetch }) => {
  const [file, setFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [currentSize, setCurrentSize] = useState(0);
  const [rowCount, setRowCount] = useState(0); // New state to store the number of rows
  const [previewOpen, setPreviewOpen] = useState(false); // State to control the preview dialog
  const [selectedFileName, setSelectedFileName] = useState(null); // State to store the selected file name

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFileName(selectedFile ? selectedFile.name : null); // Update the selected file name in state
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      setFileSelected(true);
      // Calculate the number of rows when a file is selected
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet).length;
        setRowCount(rows);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      alert("Please select a valid Excel file.");
      e.target.value = null;
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    if (rowCount > currentSize) {
      alert(
        "You have exceeded the batch size limit. Please contact your administrator."
      );
      return;
    }
    try {
      setUploading(true);
      const id = sessionStorage.getItem("id");
      await sendExcelUserFile(file, id);
      setFetch((prev) => !prev);
      setUploadComplete(true);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const id = sessionStorage.getItem("id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBatchSize(id);
        if (data) {
          setCurrentSize(data.batchSize - data.employeeCount);
        } else {
          throw new Error("Couldn't fetch batch Size");
        }
      } catch (error) {
        console.error("Error fetching batchSize:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>{data.title}</DialogHeader>
        <DialogBody>
          {data.message}
          <div className="relative h-1/2">
            <label
              htmlFor="file-upload"
              className="bg-blue-900 text-white px-1 py-1 rounded-md cursor-pointer inline-flex items-center space-x-2"
              style={{background:'#023047'}}
            >
              <MdAttachFile size={24} />
              <span className="truncate">
                {selectedFileName ? selectedFileName : "Choose File"}
              </span>{" "}
              {/* Display selected file name or default text */}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {rowCount > currentSize && (
            <div className="text-red-600">
              Number of employees exceeds batch size: Available Size is{" "}
              {currentSize}, you are trying to add {rowCount} employees
            </div>
          )}
          <div className="flex">
            <button
              onClick={() => setPreviewOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <RiFileExcel2Fill size={24} style={{ marginRight: "8px" }} />{" "}
              {/* Icon with increased size */}
              <span
                style={{
                  fontSize: "18px",
                  textDecoration: "underline",
                  color: "blue",
                  marginRight: "8px",
                }}
              >
                Preview Excel Format
              </span>{" "}
              {/* Text */}
            </button>
            <button onClick={downloadFile}>
              <MdFileDownload size={24} style={{ verticalAlign: "middle" }} />
            </button>{" "}
          </div>
          {/* Download icon */}
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} style={{ maxWidth: '90%', width: 'auto', margin: 'auto' }}>
  <DialogHeader>Preview Excel Format</DialogHeader>
  <DialogBody style={{ textAlign: 'center' }}>
    <img src={ExcelFormatBulkUpload} alt="Excel Format" style={{ maxWidth: '100%', height: 'auto' }} />{" "}
    {/* Replace "/path/to/excel/format/image" with the actual path to your image */}
  </DialogBody>
  <DialogFooter>
    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
  </DialogFooter>
</Dialog>

        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
            disabled={uploading || uploadComplete}
          >
            <span>Cancel</span>
          </Button>
          {fileSelected && !uploading && !uploadComplete && (
            <Button
              variant="gradient"
              color={`${data.delete ? "red" : "green"}`}
              onClick={handleFileUpload}
            >
              <span>{data.actionText}</span>
            </Button>
          )}
          {uploading && <div>Uploading...</div>}
          {uploadComplete && (
            <div className="checkmark-animation">
              <img src={checkmark} alt="Checkmark GIF" />
            </div>
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
};

FileModal.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  setFetch: PropTypes.func.isRequired,
};

export default FileModal;
