import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button } from "@material-tailwind/react";
import axios from 'axios';
import { myHeaders } from "../../Services/IpAddress";

function BatchComponent({ employeeId, onClose, selectedBatchId }) {
  const [evaluationData, setEvaluationData] = useState([]);
  const [reEvaluationData, setReEvaluationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        console.log("Fetching evaluation data for batch ID:", selectedBatchId);
        const response = await axios.get(
          `${import.meta.env.VITE_BATCH_SERVICE_URL}/evaluation/employee/${employeeId}`,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            },
          }
        );

        console.log("Raw API response:", response.data);
        const filteredData = response.data.filter(item => item.batch.batchId === selectedBatchId);
        console.log("Filtered data:", filteredData);

        const evaluation = filteredData.filter(item => item.batch.employee.typeOfEvaluation === "Evaluation");
        const reEvaluation = filteredData.filter(item => item.batch.employee.typeOfEvaluation === "Re-Evaluation");
        console.log("reevaluation data:", reEvaluation);
        setEvaluationData(evaluation);
        setReEvaluationData(reEvaluation);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching evaluation data:", error);
        setError(error.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, [employeeId, selectedBatchId]);

  const handleClose = () => {
    onClose();
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity duration-1000">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-row gap-4 items-center justify-center">
          <Card className="bg-[#023047]">
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl mb-2 text-[#FFB703]">Evaluation Grades</h2>
            </div>
            <Card>
              <CardBody>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Course Name</th>
                      <th className="border px-4 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationData.length === 0 ? (
                      <tr>
                        <td className="border px-4 py-2 text-center" colSpan="2">N/A</td>
                      </tr>
                    ) : (
                      evaluationData.map((batch, index) => (
                        <React.Fragment key={index}>
                          {batch.batch.employee.courses.map((course, index) => (
                            <tr key={index}>
                              <td className="border px-4 py-2">{course.courseName}</td>
                              <td className="border px-4 py-2">{course.grade}</td>
                            </tr>
                          ))}
                          <tr>
                            <td className="border px-4 py-2 font-bold">Overall Grade</td>
                            <td className="border px-4 py-2">{batch.batch.employee.overAllGrade}</td>
                          </tr>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Card>

          <Card className="bg-[#023047]">
            <div className="p-4 flex flex-row items-center justify-center h-full">
              <h2 className="text-3xl mb-2 text-[#FFB703]">Re-Evaluation Grades</h2>
            </div>
            <Card>
              <CardBody>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Course Name</th>
                      <th className="border px-4 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reEvaluationData.length === 0 ? (
                      <tr>
                        <td className="border px-4 py-2 text-center" colSpan="2">N/A</td>
                      </tr>
                    ) : (
                      reEvaluationData.map((batch, index) => (
                        <React.Fragment key={index}>
                          {batch.batch.employee.courses.map((course, index) => (
                            <tr key={index}>
                              <td className="border px-4 py-2">{course.courseName}</td>
                              <td className="border px-4 py-2">{course.grade}</td>
                            </tr>
                          ))}
                          <tr>
                            <td className="border px-4 py-2 font-bold">Overall Grade</td>
                            <td className="border px-4 py-2">{batch.batch.employee.overAllGrade}</td>
                          </tr>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Card>
        </div>
        <Button
          onClick={handleClose}
          style={{ backgroundColor: '#023047', color: "#FFB703" }}
          className="ml-60 mt-4 transition-opacity duration-1000"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default BatchComponent;
