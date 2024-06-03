// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Card, Button, Typography } from "@material-tailwind/react";
import SelectOption from "../Components/SelectOption";
import Date from "../Components/Date";
import { Link, useNavigate } from "react-router-dom";
import {
  getBatches,
  getCourses,
  getPeriod,
  getPeriodStatus,
} from "../Services/AttendanceService";
import { attendanceRecordFound } from "../Services/AttendanceService";
import Yellow from "../Assets/BatchForm.svg"
const BatchSelectPage = () => {
  const [batch, setBatch] = useState(null);
  const [course, setCourse] = useState(null);
  const [period, setPeriod] = useState(null);
  const [batchData, setBatchData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [periodData, setPeriodData] = useState([]);
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    setUpdate(sessionStorage.getItem("update"));
  });
  const navigate = useNavigate();
  const setSessionData = () => {
    sessionStorage.setItem("batch", JSON.stringify(batch));
    sessionStorage.setItem("course", JSON.stringify(course));
    sessionStorage.setItem("period", JSON.stringify(period));
    sessionStorage.setItem("date", date);
  };

  const takeAttendanceHandler = async () => {
    try {
      const recordFound = await attendanceRecordFound(
        batch.id,
        course.id,
        period.name,
        date
      );
      setSessionData();
      if (!recordFound) {
        navigate("/attendance/takeAttendance");
      } else if (recordFound == true) {
        setError(
          "Attendance Record Found. Attendance has already been taken.Click Here to update Attendance."
        );
      } else {
        setError("An error occurred while checking attendance record.");
      }
    } catch (error) {
      console.error("Error checking attendance record:", error);
      setError("An error occurred while checking attendance record.");
    }
  };
  const updateAttendanceHandler = async () => {
    try {
      const recordFound = await attendanceRecordFound(
        batch.id,
        course.id,
        period.name,
        date
      );
      setSessionData();
      if (recordFound) {
        navigate("/attendance/updateAttendance");
      } else {
        setError(
          "No Attendance Record Found. Please Take attendance by clicking here"
        );
      }
    } catch (error) {
      console.error("Error checking attendance record:", error);
      setError("An error occurred while checking attendance record.");
    }
  };

  const batchHandler = (value) => {
    setBatch(value);
  };

  const courseHandler = (value) => {
    setCourse(value);
  };

  const periodHandler = (value) => {
    setPeriod(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchData = await getBatches();
        if (batchData) {
          const transformedData = batchData.map((batch) => ({
            id: batch.batchId,
            name: batch.batchName,
          }));
          setBatchData(transformedData);
        } else {
          throw new Error("Failed to fetch batch data");
        }
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourses(batch.id);
        if (courseData) {
          const transformedData = courseData.courses.map((course) => ({
            id: course.courseId,
            name: course.courseName,
          }));
          setCourseData(transformedData);
        } else {
          throw new Error("Failed to fetch course data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, [batch, batchData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const periodData = await getPeriodStatus(batch.id, course.id, date);
        if (periodData.length == 0 && update == 0) {
          setPeriodData(null);
          setError(
            "Attendance Record Found. Attendance has already been taken.Click Here to update Attendance."
          );
        }
        if (update == 0) {
          if (periodData) {
            const transformedData = periodData.map((period) => ({
              id:
                period === "First Half" ? 1 : period === "Second Half" ? 2 : 3,
              name: period,
            }));

            setPeriodData(transformedData);
          } else {
            throw new Error("Failed to fetch period data");
          }
        } else {
          setPeriodData(getPeriod);
        }
      } catch (error) {
        console.error("Error fetching period data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, [date]);
  useEffect(() => {
    setError(null);
  }, [date]);
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        marginTop: '-40px',
        backgroundImage: `url(${Yellow})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh', // Adjust height as needed
      }}
      // style={{
      //   marginTop: '-70px',
      //   background: 'linear-gradient(135deg, #fff6d9 0%, #f0e68c 100%)'
      // }}
      
    >
      <Card
        // color="orange"
        shadow={true} // Set shadow to true
        className="flex items-center justify-center border border-gray-200 rounded-xlg p-12" // Add border and padding
        style={{ maxWidth: "800px" }} // Set max-width for responsiveness\
      >
        <Typography variant="h4" color="blue-gray" className="text-center">
          Attendance System
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Select a batch, course, and half of the day to take attendance.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Select Batch
            </Typography>
            <SelectOption
              disabled={false}
              selectHandler={batchHandler}
              data={batchData}
              label={"Select Batch"}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Select Course
            </Typography>
            <SelectOption
              disabled={batch != null ? false : true}
              selectHandler={courseHandler}
              data={courseData}
              label={"Select Course"}
            />
            {course && (
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Select Date
              </Typography>
            )}
            {course && <Date date={date} setDate={setDate} />}
            {error == null && (
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Half of the day
              </Typography>
            )}
            {error == null && (
              <SelectOption
                disabled={date != null ? false : true}
                selectHandler={periodHandler}
                data={periodData}
                label={"Select Period"}
              />
            )}
          </div>
          {error && (
            <Typography color="red" className="mt-4">
              {error}
              {update == 0 && (
                <Link
                  to="/attendance/updateAttendance"
                  className="text-blue-500 hover:underline"
                >
                  Update Attendance
                </Link>
              )}
              {update == 1 && (
                <Link
                  to="/attendance/takeAttendance"
                  className="text-blue-500 hover:underline"
                >
                  Take Attendance
                </Link>
              )}
            </Typography>
          )}
          {update == 0 && (
            <Button
              className="mt-6"
              style={{ backgroundColor: "#023047" }}
              fullWidth
              onClick={takeAttendanceHandler}
            >
              Take Attendance
            </Button>
          )}
          {update == 1 && (
            <Button
              className="mt-6"
              fullWidth
              onClick={updateAttendanceHandler}
              style={{ backgroundColor: "#023047" }}
            >
              Update Attendance
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
};

export default BatchSelectPage;
