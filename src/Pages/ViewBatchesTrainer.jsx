import React, { useState, useEffect } from "react";
import BatchHeaderUser from "../Components/BatchHeaderUser";
import BatchDetailsCards from "../Components/BatchDetailsCards";
import BatchDetailsTable from "../Components/BatchDetailsTable";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchBatchData } from "../Services/BatchData";
import { fetchProgressData } from "../Services/ProgressData";
import axios from "axios";
import useAuth from "../Hooks/useAuth";
import ProgressService from "../Api/services/Progress/ProgressService";
import BatchHeaderTrainer from "../Components/BatchHeaderTrainer";
import { myHeaders } from '../Services/IpAddress';
// import { getBatchIp, myHeaders } from "../Services/BatchData"

const ViewBatchesTrainer = () => {
  const [card, setCard] = useState(true);
  const [status, setStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [change, setChange] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const toggleHandler = () => {
    setCard((prev) => !prev);
  };

  const statusHandler = (value) => {
    setStatus(value);
  };

  const searchHandler = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const getProgress = async (course) => {
    try {
      const progressArr = [];

      for (const { batchId, courseId } of course) {
        // console.log("batch id", batchId)
        // console.log("courseId", courseId)
        const progress = await ProgressService.getOverallCourseProgress({ courseID: courseId, batchID: batchId });

        // console.log("progressssss", progress)
        progressArr.push(progress)
      }
      return progressArr



    }
    catch (error) {
      console.error(error)
    }
  }

  const [courseList, setCourseList] = useState([]);


  const getCourseDetails = async () => {
    setLoading(true)
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_GOWSIC}/batch-course/trainer/${auth.empID}`,{
        headers:{...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      })
      setLoading(false)

      return response.data



    } catch (error) {
      (error) => console.error(error)
    }
  }
  const [batchList, setBatchList] = useState();
  const defBatchList = (courseList) => {
    const courseBatchMap = courseList.reduce((acc, course) => {
      if (acc[course.courseId]) {
        acc[course.courseId].push(course.batchId);
      } else {
        acc[course.courseId] = [course.batchId];
      }
      return acc;
    }, {});

    setBatchList(courseBatchMap)

    // console.log("result", courseBatchMap);
  }
  const transformBatch = ({ courses }) => {
    const batch = {

      "batchName": "BC-101",
      "batchDescription": "Batch",
      "startDate": "2024-04-01",
      "endDate": "2024-09-30",
      "batchSize": 25,
      "learningPlan": true,
      "employeeId": [
        7481
      ]
    };


    return courses.map(course => ({
      ...batch,
      ...course,
      batchDescription: null,
      // batchId: course.courseId || null,
      realBatchId : course.batchId,
      batchName: course.courseName,
      startDate: course.startDate || null,
      endDate: course.endDate || null
    }));
  };

  const fetchData = async () => {
    try {
      //  const batch = await fetchBatchData();
      // const progress = await fetchProgressData();

      const course = await getCourseDetails();
      // console.log("hello")
      const progressList = await getProgress(course)

      //progress data


      if (course && progressList) {
        setBatchData(transformBatch({ courses: course }));
        
        defBatchList(course)
        setCourseList(course)
        console.log(course)
        console.log("progress", progressList)

        setProgressData(progressList);
        setError(null);

        // console.log("progres datra", progressData)
        setLoading(false);
      } else {
        throw new Error("Couldn't fetch batch data from backend");
      }
    } catch (error) {
      setLoading(false);
      setError("Couldn't fetch Batch Data");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeCardLayout = () => {
    setChange((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      // Cleanup function to reset dataFetched when component unmounts
      setCourseList([]);
      setProgressData([]);
    };
  }, []);

  useEffect(() => {
    // Refetch data when navigating back to this page
    const unblock = navigate("/courses", { replace: true });
    fetchData();
    return unblock;
  }, [navigate]);

  return (
    <div>
      <BatchHeaderTrainer
        toggleHandler={toggleHandler}
        card={card}
        onStatusChange={statusHandler}
        searchHandler={searchHandler}
        changeCardLayout={changeCardLayout}
      />
      {loading ? (
        <div className="text-blue-600 text-center mt-4 text-lg font-semibold">
          Loading...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center mt-4 text-lg font-semibold">
          {error}
        </div>
      ) : card ? (
        <BatchDetailsCards
          status={status}
          searchQuery={searchQuery}
          batchData={batchData}
          progressData={progressData}
          change={change}
        />
      ) : (
        null
      )}
    </div>
  );
};
export default ViewBatchesTrainer;
