import React, { useState, useEffect } from "react";
import { Card, IconButton, Typography } from "@material-tailwind/react";
import { Evaluation } from "./TakeEvaluation";
import axios from "axios";
import { myHeaders } from "../../Services/IpAddress";

const Evaluations_dash = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [evaluationType, setEvaluationType] = useState("Evaluation");
  const [evaluationCompletionStatus, setEvaluationCompletionStatus] = useState(
    {}
  );
  const [batchData, setBatchData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [evaluationData, setEvaluationData] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/name/id`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      })
      .then((response) => {
        setBatchData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching batch data:", error);
      });
    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/evaluation/getAll`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      })
      .then((response) => {
        setEvaluationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching evaluation data:", error);
      });
  }, [selectedTrainee]);

  const handleSelectBatch = (event) => {
    const selectedBatchId = event.target.value;
    setSelectedBatch(selectedBatchId);
    axios
      .get(
        `${
          import.meta.env.VITE_BATCH_SERVICE_URL
        }/batch/batch-details/employees/${selectedBatchId}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      )
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });

    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/evaluation/getAll`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      })
      .then((response) => {
        setEvaluationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching evaluation data:", error);
      });
  };

  const handleEvaluation = (employeeId, action) => {
    setSelectedTrainee(employeeId);
    const employee = employeeData.find((emp) => emp.employeeId === employeeId);
    setSelectedEmployeeName(`${employee.firstName} ${employee.lastName}`);
    setEvaluationType(
      action === "reevaluation" ? "Re-Evaluation" : "Evaluation"
    );
    setSelectedAction(action);
    console.log("Evaluation type:", evaluationType);
  };

  const renderButtons = (employeeId, action) => {
    if (action === "evaluation") {
      return (
        <button
          className="bg-[#023047] hover:scale-110 hover:bg-[#023047] cursor-pointer ease-in-out duration-100  text-white font-bold py-1 px-2 rounded"
          onClick={() => handleEvaluation(employeeId, action)}
        >
          Evaluation
        </button>
      );
    } else if (action === "reevaluation") {
      return (
        <button
          className="bg-[#023047] hover:scale-110 hover:bg-[#023047] cursor-pointer ease-in-out duration-100 text-white font-bold py-1 px-2 rounded"
          onClick={() => handleEvaluation(employeeId, action)}
        >
          Re-Evaluation
        </button>
      );
    }
    return null;
  };

  const handleEvaluationCompletion = (employeeId) => {
    setEvaluationCompletionStatus((prevState) => ({
      ...prevState,
      [employeeId]: true,
    }));
  };

  const filteredRows = employeeData.filter(
    (row) =>
      row.employeeId.toString().includes(searchQuery) ||
      (row.firstName + " " + row.lastName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getGradeForEmployee = (employeeId, type) => {
    const evaluation = evaluationData.find(
      (evalItem) =>
        evalItem.batch.batchId === parseInt(selectedBatch) &&
        evalItem.batch.employee.employeeId === employeeId &&
        evalItem.batch.employee.typeOfEvaluation === type
    );
    return evaluation ? evaluation.batch.employee.overAllGrade : "N/A";
  };

  return (
    <div>
      {selectedTrainee === null ? (
        <>
          <nav className="bg-[#023047] p-4 rounded-lg">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-[#FB8500] text-3xl font-semibold">Evaluations</h1>
              <div className="flex  items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-l px-2 py-1 text-white bg-gray-700"
                  style={{ marginRight: "23rem" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  value={selectedBatch}
                  onChange={handleSelectBatch}
                  className="border rounded-r px-2 py-1 text-white bg-[#f7ae2791]"
                >
                  <option value="" disabled>
                    Select Batch
                  </option>
                  {batchData.map((batch) => (
                    <option key={batch.batchId} value={batch.batchId}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </nav>

          <div className="container mx-auto mt-4">
            <h2 className="text-xl font-semibold mb-2">
              <div className="text-green-900">(Evaluation)</div>
              <div className="text-left">
                Trainees of{" "}
                {
                  batchData.find(
                    (batch) => batch.batchId === parseInt(selectedBatch)
                  )?.batchName
                }{" "}
                :
              </div>
            </h2>

            <Card className="h-full w-full overflow-scroll"  style={{background:'linear-gradient(135deg, white, 0%, white 50%, #f7ae2791 100%)',marginRight:'20px',marginLeft:'0',padding:'15px',borderRadius:'15px'}}>
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {[
                      "Employee ID",
                      "Employee Name",
                      "Evaluation Type",
                      "Grades",
                    ].map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!selectedBatch ? (
                    <tr>
                      <td colSpan="5" className="border px-4 py-2 text-center">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          Please select a batch to view trainees.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((trainee) => (
                      <tr
                        key={trainee.employeeId}
                        className="even:bg-blue-gray-50/50"
                      >
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {trainee.employeeId}
                          </Typography>
                        </td>
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {trainee.firstName} {trainee.lastName}
                          </Typography>
                        </td>
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {renderButtons(trainee.employeeId, "evaluation")}
                          </Typography>
                        </td>
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {getGradeForEmployee(
                              trainee.employeeId,
                              "Evaluation"
                            )}
                          </Typography>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="container mx-auto mt-4">
            <h2 className="text-xl font-semibold mb-2">
              <div className="text-red-900">(Re-Evaluation)</div>
            </h2>
            <Card className="h-full w-full overflow-scroll"  style={{background:'linear-gradient(135deg, white, 0%, white 50%, #f7ae2791 100%)',marginRight:'20px',marginLeft:'0',padding:'15px',borderRadius:'15px'}}>
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {[
                      "Employee ID",
                      "Employee Name",
                      "Evaluation Type",
                      "Grades",
                    ].map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!selectedBatch ? (
                    <tr>
                      <td colSpan="5" className="border px-4 py-2 text-center">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          Please select a batch to view trainees.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((trainee) => (
                      <tr
                        key={trainee.employeeId}
                        className="even:bg-blue-gray-50/50"
                      >
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {trainee.employeeId}
                          </Typography>
                        </td>
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {trainee.firstName} {trainee.lastName}
                          </Typography>
                        </td>
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {renderButtons(trainee.employeeId, "reevaluation")}
                          </Typography>
                        </td>
                        <td className="border px-4 py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {getGradeForEmployee(
                              trainee.employeeId,
                              "Re-Evaluation"
                            )}
                          </Typography>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      ) : (
        <div>
          <Evaluation
            onSaveResponse={(response) => {
              console.log(response);
              handleEvaluationCompletion(selectedTrainee);
            }}
            evaluationType={evaluationType}
            selectedTrainee={selectedTrainee}
            selectedEmployeeName={selectedEmployeeName}
            selectedBatch={selectedBatch}
            selectedBatchName={
              batchData.find(
                (batch) => batch.batchId === parseInt(selectedBatch)
              )?.batchName
            }
            setSelectedTrainee={setSelectedTrainee}
            selectedAction={selectedAction}
          />
        </div>
      )}
    </div>
  );
};

export default Evaluations_dash;
