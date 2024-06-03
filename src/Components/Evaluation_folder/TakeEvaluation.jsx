
import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Textarea,
  Button,
  CardBody,
  Card,
} from "@material-tailwind/react";
 
import logo from "../../Assets/logo.svg";
import axios from "axios";
import { myHeaders } from "../../Services/IpAddress";
import useAuth from "../../Hooks/useAuth";
export function Evaluation({
  onSaveResponse,
  evaluationType,
  selectedTrainee,
  selectedEmployeeName,
  setSelectedTrainee,
  selectedBatch,
  selectedBatchName,
  isEditing,
}) {
  const [courseResponses, setCourseResponses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFeedbackEmpty, setIsFeedbackEmpty] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMoreCourses, setShowAddMoreCourses] = useState(false);
  const [grade, setGrade] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingResponseIndex, setEditingResponseIndex] = useState(null);
  const [evaluationId, setEvaluationId] = useState(null);
  const {auth}= useAuth();
 
 
 
  useEffect(() => {
    fetchData();
  }, []);
 
 const fetchData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/evaluation/getAll`, {
      headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
      },
  });
    const evaluationData = response.data.filter(
      (item) =>
        item.batch.employee.employeeId === selectedTrainee &&
        item.batch.employee.typeOfEvaluation === evaluationType // Check evaluation type
    );
    if (evaluationData.length > 0) {
      setEvaluationId(evaluationData[0].id); // Store the evaluation ID
      setCourseResponses(evaluationData[0].batch.employee.courses);
      setFeedback(evaluationData[0].batch.employee.feedback);
    }
  } catch (error) {
    console.error("Error fetching evaluation data:", error);
  }
};
 
 
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/course`, {
        headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
    })
      .then((response) => {
        const fetchedCourses = response.data.map((course) => ({
          id: course.courseId,
          name: course.courseName,
        }));
        setCourses(fetchedCourses);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);
 
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setFormVisible(true);
  };
 
  const handleEditGrade = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit this response?"
    );
    if (isConfirmed) {
      const responseToEdit = courseResponses[index];
      setSelectedCourse(responseToEdit.courseName);
      setQuestions(responseToEdit.questions);
      setAnswers(responseToEdit.answers);
      setFeedback(responseToEdit.feedback);
      setGrade(responseToEdit.grade);
      setFormVisible(true);
      setEditingResponseIndex(index);
      setShowAddMoreCourses(true);
    }
  };
 
  const handleSaveResponse = () => {
    const response = {
      courseName: selectedCourse,
      questions: questions,
      answers: answers,
      grade: grade,
      trainerId: selectedBatch,
    };
 
    if (editingResponseIndex !== null) {
      const updatedResponses = [...courseResponses];
      updatedResponses[editingResponseIndex] = response;
      setCourseResponses(updatedResponses);
      setEditingResponseIndex(null);
    } else {
      setCourseResponses([...courseResponses, response]);
    }
 
    setQuestions("");
    setAnswers("");
    setGrade("");
    setFormVisible(false);
  };
 
  const handleDeleteResponse = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this response? It won't delete response from Database"
    );
 
    if (isConfirmed) {
      const updatedResponses = [...courseResponses];
      updatedResponses.splice(index, 1);
      setCourseResponses(updatedResponses);
    }
  };
 
  const handleExit = () => {
    const isConfirmed = window.confirm("Are you sure you want to exit this page?");
    if (isConfirmed) {
      setSelectedTrainee(null);
    }
  };
 
  const postEvaluation = async (postBody) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BATCH_SERVICE_URL}/evaluation/post`,postBody,  {
        headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
    });
      console.log("response", response);
      console.log("sent");
    } catch (error) {
      console.log(error);
    }
  };
  const putEvaluation = async (putBody) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BATCH_SERVICE_URL}/evaluation/update/${selectedBatch}/${selectedTrainee}/${evaluationType}`,
        putBody,
        {
          headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          },
      },
      );
      console.log("response", response);
      console.log("updated");
    } catch (error) {
      console.log(error);
    }
  };
 
 
  const handleSubmit = () => {
    const isConfirmed = window.confirm("Are you sure you want to submit the evaluation?");
    if (isConfirmed) {
      setSelectedTrainee(null);
 
      onSaveResponse({ feedback, selectedTrainee });
      const postBody = {
        id: null,
        batch: {
          batchId: selectedBatch,
          batchName: selectedBatchName,
          employee: {
            employeeId: selectedTrainee,
            employeeName: selectedEmployeeName,
            courses: courseResponses,
            typeOfEvaluation: evaluationType,
            feedback: feedback,
            overAllGrade: null,
          },
        },
      };
 
      if (evaluationId) {
        putEvaluation(postBody);  // Use PUT if evaluation exists
      } else {
        postEvaluation(postBody);  // Use POST if evaluation does not exist
      }
 
      setCourseResponses([]);
      setFeedback("");
      setLoading(true);
    }
  };
 
  const handleChange = (e) => {
    const value = e.target.value;
    setFeedback(value);
    setIsFeedbackEmpty(value.trim() === "");
  };
 
  return (
    <>
      <div>
        <div position="static">
          <div className="bg-[#023047] flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="" height="150" width="150" />
              <Typography
                variant="h2"
                style={{ color: "#FB8500", marginLeft: "460px" }}
              >
                {evaluationType}
              </Typography>
            </div>
          </div>
        </div>
        <List>
          <div className="m5 text-left">
            Take Evaluations for :-
            <span className="text-blue-700">{selectedTrainee}_{selectedEmployeeName}</span>
            , Batch ID -
            <span className="text-blue-700 mr-2">{selectedBatch}</span>
          </div>
          <div className="m5 text-left">
            Evaluator ID:{" "}
            <span className="text-blue-700 mr-2">{auth.empID}</span>
          </div>
          <div className="flex flex-wrap justify-start items-center gap-4">
            {courseResponses.map((response, index) => (
              <Card
                key={index}
                className="mt-6 w-full max-w-96 hover:scale-95 hover:bg-[#d5e3eb] cursor-pointer ease-in-out duration-100"
              >
                <CardBody>
                  <div className="flex flex-col items-center">
                    <Typography variant="h4" align="center">
                      {response.courseName}
                    </Typography>
                    <Typography variant="subtitle1">
                      Grade: {response.grade}
                    </Typography>
                    <div className="flex justify-between">
                      <Button
                        variant="contained"
                        className="bg-[#023047] hover:bg-gray-700"
                        onClick={() => handleDeleteResponse(index)}
                        disabled={isEditing}
                      >
                        Delete
                      </Button>
                      <div className="w-4"></div>
                      <Button
                        variant="contained"
                        className="bg-[#023047] hover:bg-gray-700"
                        onClick={() => handleEditGrade(index)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <ListItem>
            <div className="mr-3 text-left">Select Course :</div>
            <ListItemPrefix>
              <div className="relative">
                <select value={selectedCourse} onChange={handleCourseChange} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                  <option value="" disabled>Select Course</option>
                  {courses.map((course) => (<option key={course.id} value={course.name}>{course.name}</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M10 13.5l-6-6h12z" />
                  </svg>
                </div>
              </div>
            </ListItemPrefix>
          </ListItem>
          {formVisible && selectedCourse && (
            <div>
              <Typography variant="h6">{selectedCourse}</Typography>
              <Textarea
                size="lg"
                label={
                  <span>
                    Questions<span className="text-red-500"> *</span>
                  </span>
                }
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Textarea
                size="lg"
                label={
                  <span>
                    Answers<span className="text-red-500"> *</span>
                  </span>
                }
                value={answers}
                onChange={(e) => setAnswers(e.target.value)}
                fullWidth
                margin="normal"
              />
              <div fullWidth margin="normal">
                <label htmlFor="grade" className=" text-sm font-medium text-gray-700 flex items-center">
                  <span>Grade</span><span className="text-red-500"> *</span>
                </label>
 
                <select
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option
                    value="Select Grade"
                    disabled={grade === "Select Grade"}
                    className="bg-black text-white"
                  >
                    Select Grade Based on his/her performance:
                  </option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                  <option value="Very Poor">Very Poor</option>
                </select>
 
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveResponse}
                disabled={!questions || !answers || !grade}
                className="mt-4" // Adding margin top
 
              >
                Save Response
              </Button>
            </div>
          )}
          <Textarea
            size="lg"
            label={
              <span>
                Feedback<span className="text-red-500"> *</span>
              </span>
            }
            value={feedback}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </List>
        <Button c
          variant="contained"
          className="bg-[#023047]"
          onClick={handleSubmit}
          style={{ marginRight: "10px" }}
          disabled={isFeedbackEmpty}
        >
          Submit
        </Button>
        <Button variant="contained" className="bg-[#023047]" onClick={handleExit}>
          Exit
        </Button>
      </div>
    </>
  );
}
export default Evaluation