import React, { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
// import { AppBar, Toolbar } from "@material-ui/core";
import BatchComponent from "./BatchComponent";
import logo from "../../Assets/logo.svg";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import { myHeaders } from "../../Services/IpAddress";
export function ButtonVariants() {
  const [batches, setBatches] = useState([]);
  const { auth } = useAuth();
  const [isBatchComponentOpen, setIsBatchComponentOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null); // State variable to hold the selected batch ID
  // const employeeId = 7463;
  const employeeId = auth.empID;

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = () => {
    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/employee/batches/${employeeId}`, {
        headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
    })
      .then((response) => setBatches(response.data))
      .catch((error) => console.error("Error fetching batches:", error));
  };

  const handleBatchClick = (batch) => {
    setSelectedBatchId(batch.batchId); // Set the selected batch ID
    setIsBatchComponentOpen(true);
  };

  const handleCloseBatchComponent = () => {
    setIsBatchComponentOpen(false);
    setSelectedBatchId(null); // Reset the selected batch ID when closing the BatchComponent
  };

  return (
    <div>
      {isBatchComponentOpen &&
        selectedBatchId !== null && ( // Check if selectedBatchId is not null before rendering BatchComponent
          <BatchComponent
            employeeId={employeeId}
            selectedBatchId={selectedBatchId}
            onClose={handleCloseBatchComponent}
          />
        )}
      {!isBatchComponentOpen && (
        <>
          <div position="fixed">
            <div
              style={{
                backgroundColor: "#023047",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={logo} alt="" height="150" width="150" />
                <Typography
                  variant="h2"
                  style={{ color: "white", marginLeft: "420px" }}
                >
                  Evaluation Scores
                </Typography>
              </div>
            </div>
          </div>
          <div className="mt-20 ml-10">
            <div className="flex flex-col space-y-4">
              {batches.map((batch, index) => (
                <Button
                  key={index}
                  variant="filled"
                  size="xl"
                  className={`h-16 transition-transform transform hover:scale-105 ${
                    index % 2 === 0 ? "bg-blue-gray-100" : "bg-gray-100"
                  }`}
                  style={{ backgroundColor: "#8ECAE6", color: "#023047" }}
                  onClick={() => handleBatchClick(batch)}
                >
                  {batch.batchName}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
