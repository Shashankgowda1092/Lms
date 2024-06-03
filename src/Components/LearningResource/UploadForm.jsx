import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Input } from "@material-tailwind/react";
import axios from "axios";
import { myHeaders } from "../../Services/IpAddress";
 
export function SimpleRegistrationForm({ onSubmit, onCancel, initialFormData, setAlert }) {
  const [formData, setFormData] = useState({
    batchName: "",
    courseName: "",
    topicName: "",
    fileName: [],
    source: "",
  });
  const [batchList, setBatchList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [topicListForSelectedCourse, setTopicListForSelectedCourse] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    fetchBatchDetails();
    fetchCourseDetails();
}, []);

const fetchBatchDetails = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/name/id`, {
            headers: {
                ...myHeaders,
                Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            },
        });
        setBatchList(response.data);
    } catch (error) {
        console.error("Error fetching batch details:", error);
    }
};

const fetchCourseDetails = async (batchId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/batch-course/batch/${batchId}`, {
            headers: {
                ...myHeaders,
                Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            },
        });
        setCourseList(response.data.courses);
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};

 
 
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "source") {
      const urlRegex = /^(https:\/\/www\.|https:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
      if (!urlRegex.test(value)) {
        setErrorMessage("Please enter a valid URL starting with https://");
      } else {
        setErrorMessage("");
      }
    }
    if (name === "fileName") {
      const fileData = Array.from(files).map((file) => ({
        name: file.name,
        file: file,
      }));
      const oversizedFiles = fileData.filter(file => file.file.size > 10 * 1024 * 1024); // 10MB limit
      if (oversizedFiles.length > 0) {
        setErrorMessage("Files larger than 10MB are not allowed.");
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        fileName: [...prevFormData.fileName, ...fileData],
      }));
      setErrorMessage("");
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
   
    if (name === "batchName") {
      const selectedBatch = batchList.find((batch) => batch.batchName === value);
      if (selectedBatch) {
        fetchCourseDetails(selectedBatch.batchId); // Pass batchId to fetch course details
      }
    }
 
 
    if (name === "courseName") {
      const selectedCourse = courseList.find((course) => course.courseName === value);
      if (selectedCourse) {
        const topicsForSelectedCourse = selectedCourse.topics;
        setTopicListForSelectedCourse(topicsForSelectedCourse);
      }
    }
  };
 
  const handleAddFile = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const validateFields = () => {
      if (!formData.batchName || !formData.courseName || !formData.topicName) {
        setErrorMessage("Please fill in all mandatory fields.");
        return false;
      } else if (formData.fileName.length === 0 && !formData.source) {
        setErrorMessage("Please upload files or enter a URL.");
        return false;
      } else if (formData.fileName.length > 0 && formData.source) {
        setErrorMessage("Please upload files or enter a URL, but not both.");
        return false;
      } else if (errorMessage) {
        return false;
      }
      return true;
    };
 
    if (!validateFields()) return;
 
    const { selectedBatch, selectedCourse, selectedTopic } = fetchSelectedItems();
 
    if (!selectedBatch || !selectedCourse || !selectedTopic) {
      setErrorMessage("Error in fetching details.");
      return;
    }
    setLoading(true);
 
 
 
 
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("links", formData.source || "");
 
      if (formData.fileName.length > 0) {
        formData.fileName.forEach((fileData) => {
          formDataToSend.append("files", fileData.file);
        });
      }
 
      const endpoint = `${import.meta.env.VITE_PROGRESS_SERVICE_URL}/resource/${selectedBatch.batchId}/${selectedCourse.courseId}/${selectedTopic.topicId}`;
 
      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      });
      console.log("Resource saved successfully!", response.data);
      // Update resourceId with the value from the response
      formDataToSend.resourceId = response.data.resourceId;
      onSubmit(formDataToSend);
      setAlert(true);
      setErrorMessage("");
      console.log("submitted");
    } catch (error) {
      console.error("Error saving resource:", error);
      setErrorMessage("Error saving resource.");
    } finally {
      setLoading(false); // Set loading to false
    }
 
 
  };
 
  const fetchSelectedItems = () => {
    const selectedBatch = batchList.find((batch) => batch.batchName === formData.batchName);
    const selectedCourse = courseList.find((course) => course.courseName === formData.courseName);
    const selectedTopic = topicListForSelectedCourse.find((topic) => topic.topicName === formData.topicName);
 
    return { selectedBatch, selectedCourse, selectedTopic };
  };
 
  const handleDeleteFile = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fileName: prevFormData.fileName.filter((_, i) => i !== index),
    }));
  };
 
  const handleCancel = () => {
    onCancel();
  };
 
 
 
  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-blue-50 bg-opacity-50 flex items-center justify-center z-50">
          <Typography variant="h4" color="black">
            Loading...
          </Typography>
        </div>
      )}
      <Card color="transparent"   shadow={false}>
        <form onSubmit={handleSubmit} className="mt-1 mb-2 w-80 max-w-screen-lg sm:w-96">
          <Typography variant="h4" color="white" className="bg-[#023047] p-4 mb-4">
            {initialFormData ? "Edit Resource" : "Upload Resources"}
          </Typography>
          <Typography variant="h6" color="blue-gray" className="-mb-1">
            Batch Name<span className="text-red-500">*</span>
          </Typography>
          <div className="mb-2 flex flex-col gap-4 border border-gray-400 rounded-md">
            <select
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 border-none bg-transparent"
            >
              <option key="0" value="">Select Batch</option>
              {batchList.map((batch) => (
                <option key={batch.batchId} value={batch.batchName}>{batch.batchName}</option>
              ))}
            </select>
          </div>
          <Typography variant="h6" color="blue-gray" className="-mb-1">
            Course Name<span className="text-red-500">*</span>
          </Typography>
          <div className="mb-2 flex flex-col gap-4 border border-gray-400 rounded-md">
            <select
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 border-none bg-transparent"
            >
              <option key="0" value="">Select Course</option>
              {courseList.map((course) => (
                <option key={course.courseId} value={course.courseName}>{course.courseName}</option>
              ))}
            </select>
          </div>
          <Typography variant="h6" color="blue-gray" className="-mb-1">
            Topic Name<span className="text-red-500">*</span>
          </Typography>
          <div className="mb-2 flex flex-col gap-4 border border-gray-400 rounded-md ">
            <select
              name="topicName"
              value={formData.topicName}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 border-none bg-transparent"
            >
              <option value="">Select Topic</option>
              {topicListForSelectedCourse.map((topic) => (
                <option key={topic.topicId} value={topic.topicName}>
                  {topic.topicName}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && (
            <Typography variant="small" color="red" className="mb-2">
              {errorMessage}
            </Typography>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-1">
            Upload Files (PDF or PPT)
          </Typography>
          <div className="mb-2 flex flex-col gap-4 border-b border-gray-400 rounded-md">
            <input
              id="fileInput"
              type="file"
              size="md"
              placeholder="Upload Files"
              name="fileName"
              onChange={handleChange}
              className="hidden"
              accept=".pdf,.ppt,.pptx"
              multiple
            />
       <Button type="button" onClick={handleAddFile} className="border border-blue-gray-200 focus:border-gray-900 bg-[#023047]">
  Add File
</Button>
 
            {formData.fileName.map((file, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-2">{file.name}</div>
                <Button type="button" onClick={() => handleDeleteFile(index)} size="sm" color="blue">
                  X
                </Button>
              </div>
            ))}
          </div>
          <Typography variant="h6" color="blue-gray" className="-mb-1">
            URL Upload
          </Typography>
          <div className="mb-2 flex flex-col gap-4 border border-gray-400 rounded-md">
            <Input
              size="md"
              placeholder="Enter URL"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 border-none bg-transparent"
              labelProps={{
                className: "before:content-none after:content-none ",
              }}
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" className="w-1/3 bg-[#023047]" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="w-1/3  from-[#023047] to-[#023047] text-white">
  {initialFormData ? "Save Changes" : "Submit"}
</Button>
 
          </div>
        </form>
      </Card>
    </div>
  );
}