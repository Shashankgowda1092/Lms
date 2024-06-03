import React, { useState, useEffect } from "react";
import BatchHeaderUser from "../Components/BatchHeaderUser";
import BatchDetailsCards from "../Components/BatchDetailsCards";
import BatchDetailsTable from "../Components/BatchDetailsTable";
import { useNavigate } from "react-router-dom";
import { fetchBatchData } from "../Services/BatchData";
import { fetchProgressData } from "../Services/ProgressData";
import axios from "axios";
import useAuth from "../Hooks/useAuth";
import ProgressService from "../Api/services/Progress/ProgressService";
// import { getBatchIp, myHeaders } from "../Services/BatchData"
import { myHeaders } from "../Services/IpAddress";
const ViewBatchesUser = () => {
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
  // const BatchIp=getBatchIp();

  const toggleHandler = () => {
    setCard((prev) => !prev);
  };

  const statusHandler = (value) => {
    setStatus(value);
  };

  const searchHandler = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const fetchUserDetails = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_GOWSIC}/user/all`,{
        headers:{...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      })
      .then((response) => {
        //  console.log(response.data[0].firstName);
        const users = response.data;
        const foundUser = users.find(
          (user) => user.firstName === auth.username
        );
        if (foundUser) {
          // console.log
          sessionStorage.setItem("empID", foundUser.employeeId);
        } else {
          console.error("User not found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBatchList = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BATCH_SERVICE_URL
        }/batch/employee/batches/${auth.empID}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );
      console.log(response.data);
      const batchIds = response.data.map((batch) => batch.batchId);
      return batchIds;
    } catch (error) {
      console.error(error);
    }
  };

  const getBatchDetails = async (batchList) => {
    try {
      const batchDetails = []; // Array to store batch details

      // Iterate through each batchId in the batchList
      for (const batch of batchList) {
        const response = await axios.get(
          `${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/id/${batch}`,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
            },
          }
        );
        batchDetails.push(response.data); // Push response into the array
      }

      // Now batchDetails contains all responses
      console.log(batchDetails); // Or return it or do whatever you need
      return batchDetails;
    } catch (error) {
      console.error(error);
      return []; // Return empty array if error occurs
    }
  };

  const getProgress = async (empID, batchList) => {
    try {
      const progressArr = [];
      console.log("data", empID, batchList);
      for (const batchID of batchList) {
        console.log("batch id", batchID);
        const progress = await ProgressService.getUserProgressByID({
          userID: empID,
          batchID,
        });
        progress.batchID = batchID;
        progressArr.push(progress);

        return progressArr;
      }
    } catch {}
  };

  const fetchData = async () => {
    try {
      //  const batch = await fetchBatchData();
      // const progress = await fetchProgressData();

      const batchList = await getBatchList();
      console.log("batch list", batchList);
      const batch = await getBatchDetails(batchList);
      // console.log("batchdata",batch)
      const progressList = await getProgress(
        auth.empID,
        batchList
      );
      console.log("progress", progressList);

      //progress data

      if (batch && progressList) {
        setBatchData(batch);
        setProgressData(progressList);

        setError(null);
        console.log("batch", batch);
        console.log("progres datra", progressData);
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
    // fetchUserDetails();
    fetchData();
  }, []);

  const changeCardLayout = () => {
    setChange((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      // Cleanup function to reset dataFetched when component unmounts
      setBatchData([]);
      setProgressData([]);
    };
  }, []);

  useEffect(() => {
    // Refetch data when navigating back to this page
    const unblock = navigate("/lms/batch", { replace: true });
    fetchData();
    return unblock;
  }, [navigate]);

  return (
    <div>
      <BatchHeaderUser
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
        <BatchDetailsTable
          status={status}
          searchQuery={searchQuery}
          batchData={batchData}
          progressData={progressData}
        />
      )}
    </div>
  );
};
export default ViewBatchesUser;
