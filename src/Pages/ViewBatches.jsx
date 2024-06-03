import React, { useState, useEffect } from "react";
import BatchHeader from "../Components/BatchHeader";
import BatchDetailsCards from "../Components/BatchDetailsCards";
import BatchDetailsTable from "../Components/BatchDetailsTable";
import { useNavigate } from "react-router-dom";
import { fetchBatchData } from "../Services/BatchData";
import { fetchProgressData } from "../Services/ProgressData";
// import CreateBatchBackground from '../assets/CreateBatchBackground.svg'

const ViewBatches = () => {
  const [card, setCard] = useState(true);
  const [status, setStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [change, setChange] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchData = async () => {
    try {
      const batch = await fetchBatchData();
      const progress = await fetchProgressData();
      if (batch) {
        setBatchData(batch);
        setProgressData(progress);
        setError(null);
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
      setBatchData([]);
      setProgressData([]);
    };
  }, []);

  useEffect(() => {
    // Refetch data when navigating back to this page
    const unblock = navigate("/lms/batches", { replace: true });
    fetchData();
    fetchData();
    return unblock;
  }, [navigate]);

  return (
    <div >
      <BatchHeader
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
      {!loading && !error && batchData.length==0 && 
        <div className="text-grey-600 text-center mt-4 text-lg font-semibold">
          No Batches Created
          </div>}
    </div>
  );
};
export default ViewBatches;
