import React from "react";
import { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getBatchDetails, updateBatch } from "../Services/BatchData";
import {fetchBatchSize } from "../Services/allEmployee.js";
import CreateBatchBackground from '../Assets/BatchForm.svg'

function EditBatch() {
  const [batchName, setBatchName] = useState("");
  const [batchDescription, setBatchDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [duration, setDuration] = useState("");
  const [currentSize,setCurrentSize]=useState(0);
  const id = sessionStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBatchDetails(id);
      if (data) {
        setBatchName(data.batchName);
        setBatchDescription(data.batchDescription);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setBatchSize(data.batchSize);
        calculateDuration(data.startDate, data.endDate);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    calculateDuration();
  }, [startDate, endDate]);

  const calculateDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      let diffInDays = 0;
      let currentDate = start;

      // Iterate over each day between start and end dates
      while (currentDate <= end) {
        // Check if the current day is not Saturday or Sunday
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          diffInDays++;
        }
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDuration(`${diffInDays} days`);
    } else {
      setDuration("");
    }
  };
  useEffect(()=>{
    calculateDuration();
  })

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    calculateDuration(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    calculateDuration(startDate, newEndDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(currentSize>batchSize){
      setErrorMessage("Batch size cannot be less than current Employees size which is "+currentSize+". Please delete some employees to reduce the batch size");
      return;
    }
    const success = await updateBatch(id, {
      batchName,
      batchDescription,
      startDate,
      endDate,
      batchSize,
    });

    if (success) {
      navigate("/lms/batches/batchDetails");
    } else {
      // Handle failure case if needed
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBatchSize(id);
        if(data){
          setCurrentSize(data.employeeCount);
        }else{
          throw new Error("Couldn't fetch batch Size")
        }
      
      } catch (error) {
        console.error("Error fetching batchSize:", error);
      }
    };

    fetchData();
  }, [id]);
  const handleBatchSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    if (!isNaN(newSize) && newSize >= 1 && newSize <= 5000) {
      setBatchSize(newSize);
      setErrorMessage(""); // Clear any previous error message
    } else if (isNaN(newSize) || newSize < 1) {
      setBatchSize("");
      setErrorMessage("Batch size must be between 1 and 5000.");
    } else {
      setErrorMessage("Batch size must be between 1 and 5000.");
    }
  };
  
  
  return (
    <div className="flex justify-center items-center h-full mt-10"   style={{
      marginTop: '-70px',
      backgroundImage: `url(${CreateBatchBackground})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      height: '100vh', // Adjust height as needed
    }}>
      <Card className="w-full max-w-lg p-8">
        <Typography variant="h4" color="blue-gray" className="mb-6">
          Edit Batch
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="batchName">Batch Name:</label>
            <Input
              id="batchName"
              size="lg"
              placeholder="Batch Name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="batchDescription">Batch Description:</label>
            <Input
              id="batchDescription"
              size="lg"
              placeholder="Batch Description"
              value={batchDescription}
              onChange={(e) => setBatchDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="startDate">Start Date:</label>
            <Input
              id="startDate"
              type="date"
              size="lg"
              placeholder="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate">End Date:</label>
            <Input
              id="endDate"
              type="date"
              size="lg"
              placeholder="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="batchSize">Batch Size:</label>
            <Input
              id="batchSize"
              type="number"
              size="lg"
              placeholder="Batch Size"
              value={batchSize}
              onChange={handleBatchSizeChange}
              required
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <Typography variant="lead" color="gray">
            Duration: {duration}
          </Typography>
          <Button type="submit" size="lg" style={{background:'#023047'}}>
            Update Batch
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default EditBatch;
