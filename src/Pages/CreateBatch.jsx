import React from "react";
import { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom"; // Import useHistory hook directly
import { createBatch } from "../Services/BatchData";
import CreateBatchBackground from '../Assets/BatchForm.svg'
function CreateBatch() {
  const [batchName, setBatchName] = useState("");
  const [batchDescription, setBatchDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate(); // Initialize useHistory hook

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

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Set minimum selectable date for end date input
    document.getElementById("endDate").setAttribute("min", newStartDate);

    // If end date is before new start date, reset end date
    if (new Date(endDate) < new Date(newStartDate)) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await createBatch({
      batchName,
      batchDescription,
      startDate,
      endDate,
      batchSize,
    });

    if (success) {
      navigate("/lms/batches");
    } else {
      // Handle failure case if needed
    }
  };

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  const [errorMessage, setErrorMessage] = useState("");
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
    <div className="flex justify-center items-center h-full mt-10"  style={{
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
          Batch Creation
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
              min={today} // Set minimum selectable date to today's date
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
              min={startDate} // Set minimum selectable date as the start date
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
            Create Batch
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default CreateBatch;
