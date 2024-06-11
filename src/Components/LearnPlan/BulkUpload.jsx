import { Alert, Button, Card, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { myHeaders } from '../../Services/IpAddress';

export default function BulkUpload() {
  const UploadIcon = () => {
    return (
      <svg
        height="30px"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        />
      </svg>
    );
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [customErrorMessage, setCustomErrorMessage] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const navigate = useNavigate();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".xlsx")) {
        setSelectedFile(file);
        console.log("File selected:", file.name);
      } else {
        setCustomErrorMessage("Please select a file with the .xlsx extension.");
        console.error("Please select a file with the .xlsx extension.");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      axios
        .post(`${import.meta.env.VITE_API_URL}/course/upload`, formData, {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          setSuccessAlert("File uploaded successfully");
          setTimeout(() => {
            setSuccessAlert(false);
            navigate("/dashboard/admin");
          }, 1200);
          console.log("File uploaded successfully", response);
        })
        .catch((error) => {
          setCustomErrorMessage(error.message);
          setTimeout(() => {
            setCustomErrorMessage(false);
          }, 1200);
          console.error("Error occurred while uploading file:", error);
        });
    } else {
      setCustomErrorMessage("No File Selected for upload");
      setTimeout(() => {
        setCustomErrorMessage(false);
      }, 1200);
      console.error("No file selected for upload");
    }
  };

  const handleDownloadSampleFile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/download`, {
        responseType: 'blob',
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const aTag = document.createElement("a");
      aTag.href = url;
      aTag.setAttribute("download", "sample_file.xlsx");
      document.body.appendChild(aTag);
      aTag.click();
      document.body.removeChild(aTag);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading the sample file:", error);
    }
  };

  const openImageModal = () => setImageModalOpen(true);
  const closeImageModal = () => setImageModalOpen(false);

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-100">
      {successAlert && (
        <Alert
          color="green"
          className="absolute top-1 right-2 animate-fadeOut w-1/4"
        >
          Courses Added Successfully
        </Alert>
      )}
      {customErrorMessage && (
        <Alert
          color="red"
          className="absolute top-1 right-2 animate-fadeOut w-[28%]"
        >
          <svg
            style={{ display: "inline", marginRight: "10px" }}
            fill="#ffffff"
            width="24px"
            height="34px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g id="SVGRepo_tracerCarrier"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm1-3H11V16h2Zm0-4H11V6h2Z"></path>
            </g>
          </svg>
          {customErrorMessage}
        </Alert>
      )}
      <Card className="w-[30%] mx-auto h-[62%] flex justify-evenly items-center p-5 rounded-xl">
        <h1 className="text-lg absolute top-1 left-[10px] text-black">
          Upload and attach excel files
        </h1>
        <input
          type="file"
          id="file"
          name="file"
          accept=".xlsx"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div
          style={{ cursor: "pointer", userSelect: "none" }}
          className="flex flex-col gap-3 items-center justify-center text-center text-sm background-transparent h-[50%] w-[80%] mx-auto relative border border-2 border-black border-dashed"
          onClick={handleClick}
        >
          <UploadIcon />
          Download the Sample Format and Upload File
        </div>

        {selectedFile && (
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm">Selected File: {selectedFile.name}</p>
              <p className="text-sm">
                Size: {(selectedFile.size / 1024).toFixed(2)}Kb
              </p>
            </div>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={handleRemoveFile}
            >
              &#10005;
            </button>
          </div>
        )}

        <div className="w-[80%] flex flex-col text-center">
          <div className="row1">
            <Button
              size="sm"
              className="relative bg-[#023047] text-white"
              onClick={handleDownloadSampleFile}
            >
              Download sample format
            </Button>
          </div>
          <Button
          className="px-0 py-1 mt-2 text-xs w-[60%] flex justify-center items-center text-center mx-auto"
            color="blue"
            onClick={openImageModal}
            // className="px-0 py-1 mt-1 text-xs" // Adjust padding and text size
          >
            Preview Sample Format
          </Button>
        </div>

        <div className="w-[90%] flex items-end justify-between relative bottom-[-20px] mt-0.5">
        <Link to="/dashboard/admin">
          <Button variant="outlined" className="bg-[#023047] text-white w-[100%]">
          Cancel
          </Button>
          </Link>
          <Button
            variant="outlined" className="bg-[#023047] text-white w-[30%]"
            onClick={handleUpload}
          >
            Finish
          </Button>
        </div>
      </Card>

      {/* Image modal */}
      <Dialog open={imageModalOpen} handler={closeImageModal} size="xl">
        <DialogHeader>Image Preview</DialogHeader>
        <DialogBody divider>
          <div className="flex justify-center">
            <img src="src\Assets\bulkcourse1.png" alt="Preview" className="max-w-full h-auto" style={{ maxHeight: '60vh' }} />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="red" onClick={closeImageModal}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
