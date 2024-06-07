
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { myHeaders } from '../../Services/IpAddress';
export function ExistingPlan() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [planDetails, setPlanDetails] = useState(null);
  const [courseDates, setCourseDates] = useState({}); // State to hold course start and end dates
  const [courseDatesCorrectFormat, setCourseDatesCorrectFormat] = useState({}); // State to hold course start and end dates
  const [assignedInternalTrainers, setAssignedInternalTrainers] = useState([]);
  const [courseStates, setCourseStates] = useState([]); // State for individual course cards
  const navigate = useNavigate();
  const [HideAddNewPlan, setHideAddNewPlan] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [endDateErrors, setEndDateErrors] = useState([false]);
  const [alert, setAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);





  useEffect(() => {
    // Fetch internal trainers on component mount
    fetchInternalTrainers();

  }, []);



  const fetchLearningPlans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/learning-plan`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          // Add other headers if necessary
        },
      });
      setLearningPlans(response.data);
    } catch (error) {
      setAlert("Error fetching learning plans");
      setTimeout(() => {
        setAlert(false);
      }, 1200);
      console.error("Error fetching learning plans:", error);
    }
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  // Update the initial state setting in the useEffect
  useEffect(() => {
    if (selectedPlanId) {
      const fetchPlanDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/learning-plan/${selectedPlanId}`, {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
              // Add other headers if necessary
            },
          });
          setPlanDetails(response.data);
          setHideAddNewPlan(true);
          // Initialize courseStates with default values
          setCourseStates(
            response.data.courses.map((course) => ({
              showInternalTrainers: false,
              showExternalTrainers: false,
              internalTrainer: "",
              internalTrainerId: 0, // Add this line
              externalTrainerName: "",
              selfPacedLearning: "",
            }))
          );
        } catch (error) {
          setHideAddNewPlan(false);
          setAlert("Error fetching plan details");
          console.error("Error fetching plan details:", error);
        }
      };

      fetchPlanDetails();
    } else {
      // Reset planDetails and courseStates if no plan is selected
      setPlanDetails(null);
      setCourseStates([]);
    }
  }, [selectedPlanId]);

  const handleSelectPlan = (selectedValue) => {
    setSelectedPlanId(selectedValue);
  };

  const openInternalTrainer = (index) => {
    setCourseStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = {
        ...newState[index],
        showInternalTrainers: true,
        showExternalTrainers: false,
      };
      return newState;
    });
  };

  const openExternalTrainer = (index) => {
    setCourseStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = {
        ...newState[index],
        showInternalTrainers: false,
        showExternalTrainers: true,
      };
      return newState;
    });
  };

  const fetchInternalTrainers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_GOWSIC}/user/role/trainer`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          // Add other headers if necessary
        },
      });
      setAssignedInternalTrainers(response.data);
      console.log('Fetched Internal Trainers:', response.data); // Log the list of trainers
    } catch (error) {
      console.error('Error fetching internal trainers:', error);
    }
  };

  // Update handleInternalTrainerName function
  // Update handleInternalTrainerName function
  const handleInternalTrainerName = (index, value) => {
    const selectedTrainer = assignedInternalTrainers.find(
      (trainer) => trainer.firstName + trainer.lastName === value
    );

    // Log statement to check selectedTrainer and internalTrainerId
    console.log("Selected Trainer:", selectedTrainer);
    console.log("Selected Trainer Id:", selectedTrainer?.employeeId);

    if (selectedTrainer) {
      setCourseStates((prevStates) => {
        const newState = [...prevStates];
        newState[index] = {
          ...newState[index],
          internalTrainer: value,
          internalTrainerId: selectedTrainer.employeeId, // Set internalTrainerId to employeeId
        };
        return newState;
      });
    }
  };



  const handleExternalTrainerName = (index, value) => {
    setCourseStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = { ...newState[index], externalTrainerName: value };
      return newState;
    });
  };

  const selfBased = (index) => {
    setCourseStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = {
        ...newState[index],
        selfPacedLearning: "Self-paced Learning",
      };
      return newState;
    });
  };
  const handleDateChange = (index, dateType, date) => {
    if (dateType === "startDate") {
      const today = new Date();
  
      // Ensure start date is not earlier than today
      if (date < today) {
        date = today;
      }
  
      // Ensure start date is not on Saturday (6) or Sunday (0)
      while (date.getDay() === 6 || date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
      }
  
      setStartDate(date);
      setCourseDates((prevDates) => ({
        ...prevDates,
        [index]: {
          ...prevDates[index],
          [dateType]: date,
        },
      }));
  
      const courseDuration = planDetails.courses[index].courseDuration; // Assuming courseDuration is in days
  
      if (courseDuration && date) {
        let endDate = new Date(date);
        let daysToAdd = courseDuration - 1; // Start date is not included, so we subtract 1
        let count = 0;
  
        // Loop through each day and skip weekends
        while (daysToAdd > 0) {
          endDate.setDate(endDate.getDate() + 1);
  
          // Check if it's not a weekend
          if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
            daysToAdd--;
          }
  
          count++;
          // Safety check to avoid infinite loop
          if (count > courseDuration * 2) {
            break;
          }
        }
  
        setEndDate(endDate); // Update endDate in state
  
        const endDateString = dateFormater(endDate);
        const endDateYearFormat = formatDate(endDateString);
  
        setCourseDatesCorrectFormat((prevDates) => ({
          ...prevDates,
          [index]: {
            ...prevDates[index],
            endDate: endDateYearFormat,
          },
        }));
      }
    } else {
      // Handle endDate change
      setEndDate(date);
  
      const startDateString = dateFormater(courseDates[index]?.startDate);
      const endDateString = dateFormater(date);
  
      const endDateYearFormat = formatDate(endDateString);
  
      setCourseDatesCorrectFormat((prevDates) => ({
        ...prevDates,
        [index]: {
          ...prevDates[index],
          [dateType]: endDateYearFormat,
        },
      }));
  
      if (startDateString && endDateString) {
        const startDate = new Date(courseDates[index]?.startDate);
        const endDate = new Date(date);
  
        if (endDate < startDate) {
          setEndDateErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = true;
            return newErrors;
          });
        } else {
          setEndDateErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = false;
            return newErrors;
          });
        }
      }
  
      setCourseDates((prevDates) => ({
        ...prevDates,
        [index]: {
          ...prevDates[index],
          [dateType]: date,
        },
      }));
    }
  };
  




  function formatDate(inputDate) {
    const parts = inputDate.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return formattedDate;
  }

  const dateFormater = (value) => {
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString("en-GB");
    // console.log(formattedDate);
    return formattedDate;
  };

  //   useEffect(() => {
  //     if (startDate && endDate) {
  //       const startDateFormat = dateFormater(startDate);
  //       const endDateFormat = dateFormater(endDate);

  //       const dateChecker =
  //         startDateFormat.replace(/\//g, "") - endDateFormat.replace(/\//g, "");
  //       if (dateChecker < 0) {
  //       }
  //     }
  //   });

  //   console.log("start", startDate);
  //   console.log("end", endDate);

  //   useEffect(() => {
  //     const startDateString = dateFormater(startDate);
  //     const endDateString = dateFormater(endDate);

  //     if (startDateString && endDateString) {
  //       const dateChecker =
  //         startDateString.replace(/\//g, "") - endDateString.replace(/\//g, "");
  //       console.log(dateChecker);
  //       if (dateChecker < 0) {
  //         console.log("correct dates");

  //         setEndDateErrors(false);
  //       } else {
  //         console.log("wrong dates");
  //         setEndDateErrors(true);
  //       }
  //     }
  //   }, [endDate]);


  const handleSubmit = async () => {
    const batchCourseData = planDetails.courses.map((course, index) => {
      const courseState = courseStates[index];
      return {
        batchCourseId: {
          batchId: sessionStorage.getItem("id"),
          learningPlan: {
            learningPlanId: selectedPlanId,
          },
          course: {
            courseId: course.courseId,
          },
        },
        startDate: courseDatesCorrectFormat[index]?.startDate,
        endDate: courseDatesCorrectFormat[index]?.endDate,
        trainerId: courseState.internalTrainerId || 7000, // Use the internalTrainerId or 0
        trainer:
          courseState.internalTrainer ||
          courseState.externalTrainerName ||
          courseState.selfPacedLearning,
      };
    });

    console.log('Batch Course Data:', batchCourseData);

    if (!alert && endDateErrors.every((arr) => !arr)) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/batch-course/multiple`, batchCourseData, {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("Batch courses created successfully:", response.data);

        const batchId = sessionStorage.getItem("id");
        const patchResponse = await axios.patch(`${import.meta.env.VITE_API_URL}/batch/learning-plan/${batchId}`, {
          learningPlanId: selectedPlanId,
        }, {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            'Content-Type': 'application/json',
          },
        });

        setSuccessAlert("Batch Learning plan updated successfully");
        setTimeout(() => {
          setSuccessAlert(false);
          navigate("/dashboard/admin");
        }, 1500);
        console.log("Batch learning plan updated successfully:", patchResponse.data);

      } catch (error) {
        if (error.response) {
          setAlert(`Error Creating batch Courses, ${error.response.data.message}`);
        } else {
          setAlert(`Error Creating batch Courses, ${error.message}`);
        }
        setTimeout(() => {
          setAlert(false);
        }, 1500);
        console.error("Error creating batch courses or updating batch learning plan:", error);
      }
    } else {
      setAlert("Fill the details correctly");
      setTimeout(() => {
        setAlert(false);
      }, 1200);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-200">
      {alert && (
        <Alert
          color="red"
          className=" absolute top-1 right-2 animate-fadeOut w-[28%] "
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
          {alert}
        </Alert>
      )}
      {successAlert && (
        <Alert
          color="green"
          className=" absolute top-1 right-2 animate-fadeOut w-1/4 "
        >
          {successAlert}
        </Alert>
      )}
      <Card className=" h-auto w-[60%] mx-auto">
        <CardHeader
          variant="gradient"
          //   color="blue-800"
          className="bg-[#023047]  grid place-items-center h-[100px] w-full ml-0 mr-0 static shadow-none "
        >
          <Typography variant="h5" color="white" className="mb-2">
            Attach Existing Plan
          </Typography>
        </CardHeader>
        <CardBody className="h-[70vh] pt-6 overflow-y-auto">
          <div className="w-full h-full flex flex-col gap-3 justify-between container p-3 bg-white rounded-lg">
            {!HideAddNewPlan && (
              <div className="mb-4 flex flex-col gap-2">
                <label>BATCH NAME: </label>

                <Button
                  className="bg-[#023047] text-white"
                  onClick={() => navigate("/newplan")}
                >
                  {" "}
                  NEW PLAN
                </Button>
                <p className="text-sm">
                  ( If the required learning plan doesn't exist, to create a new
                  one
                  <svg
                    className="inline ml-1"
                    fill="#000000"
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <g id="SVGRepo_bgCarrier"></g>
                    <g id="SVGRepo_tracerCarrier"></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <polygon points="245,0 74.3,213.3 202.3,213.3 202.3,512 287.7,512 287.7,213.3 415.7,213.3 "></polygon>{" "}
                    </g>
                  </svg>
                  )
                </p>
              </div>
            )}

            <div>
              <div
                className={`mb-4 relative ${HideAddNewPlan ? "top-[10px]" : "top-[-60px]"
                  }`}
              >
                <Select
                  variant="outlined"
                  id="learningPlan"
                  onChange={handleSelectPlan}
                  label="Select Learning Plan"
                >
                  {learningPlans.map((plan) => (
                    <Option
                      className="text-sm p-1"
                      key={plan.learningPlanId}
                      value={plan.learningPlanId}
                    >
                      {plan.learningPlanName}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="mb-2">
                {planDetails && (
                  <div>
                    <div className="flex flex-col gap-5 mb-2 flex-wrap">
                      <div className="flex flex-row gap-20 row1">
                        <p>
                          <span className="font-bold ">
                            Learning Plan Name:{" "}
                          </span>
                          {planDetails.learningPlanName}{" "}
                        </p>
                        <p>
                          {" "}
                          <span className="font-bold">Type:</span>
                          {planDetails.type}
                        </p>
                      </div>
                      <div className="row2">
                        <h4>
                          <span className="font-bold">Courses:</span>
                        </h4>
                      </div>
                    </div>

                    <div>
                      {planDetails.courses.map((course, index) => (
                        <Card key={index} className="mt-4">
                          <CardBody>
                            <h5>
                              {" "}
                              <span className="font-bold">Course Name:</span>
                              {course.courseName}
                            </h5>
                            <h5>
                              {" "}
                              <span className="font-bold">Course Duration:</span>
                              {course.courseDuration}
                            </h5>
                            <p>
                              {" "}
                              <span className="font-bold ">Level:</span>{" "}
                              {course.level}
                            </p>
                            <div className="mb-4 mt-3">
                              <Select
                                required
                                variant="outlined"
                                label="Select Trainer"
                                id={`SelectTrainer${index}`}
                                name={`SelectTrainer${index}`}
                              >
                                <Option
                                  value="Internal Trainer"
                                  onClick={() => openInternalTrainer(index)}
                                >
                                  Internal Trainer
                                </Option>
                                <Option
                                  value="External Trainer"
                                  onClick={() => openExternalTrainer(index)}
                                >
                                  External Trainer
                                </Option>
                                <Option
                                  value="Self-paced Learning"
                                  onClick={() => selfBased(index)}
                                >
                                  Self-paced Learning
                                </Option>
                              </Select>
                              {courseStates[index].showInternalTrainers && (
                                <div className="mb-4 mt-4">
                                  <Select
                                    id={`InternalTrainer${index}`}
                                    variant="outlined"
                                    label="Internal Trainers"
                                    onChange={(value) =>
                                      handleInternalTrainerName(index, value)
                                    }
                                  >
                                    {assignedInternalTrainers && assignedInternalTrainers.map((item) => (
                                      <Option
                                        key={item.employeeId}
                                        value={item.firstName + item.lastName}
                                        onClick={() => handleInternalTrainerName(index, item.firstName + " " + item.lastName, item.employeeId)} // Pass employeeId here
                                      >
                                        {item.firstName + " " + item.lastName}
                                      </Option>
                                    ))}

                                  </Select>
                                </div>
                              )}
                              {courseStates[index].showExternalTrainers && (
                                <div className="mb-4 mt-4">
                                  <Input
                                    id={`ExternalTrainer${index}`}
                                    label="External Trainer Name"
                                    value={
                                      courseStates[index].externalTrainerName
                                    }
                                    onChange={(e) =>
                                      handleExternalTrainerName(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Start Date
                              </label>
                              <ReactDatePicker
                                selected={courseDates[index]?.startDate}
                                onChange={(date) =>
                                  handleDateChange(index, "startDate", date)
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select start date"
                                className="border p-2 rounded-lg"
                              />
                              <Typography>Select working days only</Typography>
                            </div>
                            <div >

                              <div className="mb-4">
                              <ReactDatePicker
                                selected={courseDates[index]?.endDate}
                                onChange={(date) => handleDateChange(index, "endDate", date)}
                                disabled 
                              />
                                <label className="block text-sm font-medium text-gray-700">
                                  End Date
                                </label>
                                <Input
                                  className={`border p-2 rounded-lg ${endDateErrors[index]
                                      ? "border-red-500 focus:border-red-500"
                                      : "border-gray-200"
                                    }`}
                                  value={dateFormater(courseDatesCorrectFormat[index]?.endDate)}
                                  readOnly
                                />
                                {endDateErrors[index] && endDateErrors[index] ? (
                                  <p className="text-red-500 text-sm mt-1 ml-1">
                                    *Invalid Date Warning: Please check the date.
                                  </p>
                                ) : null}
                              </div>





                              {endDateErrors[index] && endDateErrors[index] ? (
                                <p className="text-red-500 text-sm mt-1 ml-1">
                                  *Invalid Date Warning: Please check the date.
                                </p>
                              ) : null}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                    {/* Additional plan details can be displayed here */}
                  </div>
                )}
              </div>
            </div>
            <div className=" mt-2 flex justify-end">
              <Button className="bg-[#023047] " onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}