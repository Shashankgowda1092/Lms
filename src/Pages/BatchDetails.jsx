// eslint-disable-next-line no-unused-vars
import React from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import ProgressBar from "../Components/ProgressBar";
import { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar";
import EmployeeTable from "../Components/EmployeeTable";
import { TABLE_HEAD } from "../Services/EmployeeData.js";
import Modal from "../Components/Modal";
import {
  fetchBatchDetails,
  deleteTraineesFromBatch,
  deleteBatch,
} from "../Services/BatchDetailsData.js";
// import { useBatch } from "../Context/BatchContext";
import { fetchTrainees } from "../Services/BatchEmployee.js";
import { fetchBatchProgress } from "../Services/ProgressData.js";
import { modalDeleteBatch, modalDeleteTrainee } from "../Data/ModalData.jsx";
import DeletedModal from "../Components/DeletedModal.jsx";
import Yell from "../Assets/Yell.svg";
const BatchDetails = () => {
  const [trainees, setTrainees] = useState([]);
  const [rows, setRows] = useState(trainees);
  const [selectedRows, setSelectedRows] = useState({});
  const [fetch, setFetch] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  // const { id } = useBatch();
  const id = sessionStorage.getItem("id");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [batchDetails, setBatchDetails] = useState(null);
  const [progressData, setProgressData] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [learningPlan, setLearningPlan] = useState(false);
  const navigate = useNavigate();
  const handleCheckboxChange = (employeeId) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [employeeId]: !prevSelectedRows[employeeId],
    }));
  };
  const deleteHandler = () => {
    if (open) {
      // setFetch((prev) => !prev);
      deleteHandlerEmployees();
      // setFetch((prev) => !prev);
      setClearSearch(true);
      setSelectedRows({});
      setLoading(true);
      setLoader(true);
      setSubmitOpen(true);
      setTimeout(() => {
        setSubmitOpen(false);
        setLoader(false);
        setLoading(false);
        setFetch((prev) => !prev);
      }, 3000);
    }
    setOpen((prev) => !prev);
    // ReloadAfterDelay();
  };

  const deleteBatchhandler = () => {
    if (deleteOpen) {
      deleteBatchFromList();
      navigate("/lms/batches");
      window.location.reload(); // Reload the page after navigating
    }
    setDeleteOpen((prevs) => !prevs);
  };
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  const handleDeleteClose = () => {
    setDeleteOpen((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchData = await fetchBatchDetails(id);
        if (batchData) {
          setBatchDetails(batchData);
          setLearningPlan(batchData.learningPlan);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch batch details");
        }
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, [id, fetch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrainees(id);
        if (data) {
          setTrainees(data);
          setLoading(false);
          setLoader(false);
          setError(null);
        } else {
          throw new Error("Failed to fetch trainees");
        }
      } catch (error) {
        setError("Error  Fetching Batch Employees");
        setLoading(false);
        console.error("Error fetching trainees:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, [id, fetch]);

  // Update rows state when trainees change
  useEffect(() => {
    setRows(trainees); // Make sure trainees are correctly set to rows state
  }, [trainees, fetch]);

  const deleteHandlerEmployees = async () => {
    try {
      setFetch((prev) => !prev); // Trigger re-fetch of trainees list
      const selectedUserIds = Object.keys(selectedRows).filter(
        (userId) => selectedRows[userId]
      );
      await deleteTraineesFromBatch(id, selectedUserIds);
      // After successful deletion, update the UI
      const updatedTrainees = trainees.filter(
        (trainee) => !selectedUserIds.includes(trainee.id)
      );
      setTrainees(updatedTrainees);
      setRows(updatedTrainees);
      setSelectedRows({});
      setLoading(false);
      setClearSearch(true); // Set clearSearch flag to true to clear search bar
      setLoader(false);
    } catch (error) {
      console.error("Error deleting trainees:", error);
    }
  };

  const deleteBatchFromList = async () => {
    try {
      await deleteBatch(id);
    } catch (error) {
      console.error("Error deleting trainees:", error);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const data = await fetchBatchProgress(id);
      if (data) {
        setProgressData(data.batchProgress);
      } else {
        setProgressData(0);
      }
    }
    fetchData();
  }, [progressData, rows, trainees]);

  const height =
    rows.length < 11 ? "h-42" : rows.length <= 25 ? "h-48" : "h-72";
  return (
    <div className="flex h-screen">
      <div className="flex w-1/2">
        <div className="flex flex-col w-full m-5">
          <Card
            className="mt-0 mb-6 w-full m-1 h-1/2"
            style={{ background: `url(${Yell})` }}
          >
            <CardBody>
              {batchDetails ? (
                <>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-5 flex"
                  >
                    Batch Name: {batchDetails.batchName}
                    <div className="flex justify-end w-80">
                      <Link to="/lms/batches/editBatch">
                        <Button
                          className="mr-2"
                          onClick={deleteBatchhandler}
                          style={{ background: "#023047" }}
                        >
                          Edit Batch
                        </Button>
                      </Link>
                      <Button
                        className="h-10"
                        onClick={deleteBatchhandler}
                        style={{ background: "#023047" }}
                      >
                        Delete Batch
                      </Button>
                      <Modal
                        open={deleteOpen}
                        handleOpen={deleteBatchhandler}
                        handleClose={handleDeleteClose}
                        data={modalDeleteBatch}
                      />
                      <DeletedModal submitted={submitOpen} />
                    </div>
                  </Typography>
                  <Typography className="mb-5" variant="h6" color="gray">
                    Batch Description: {batchDetails.batchDescription}
                  </Typography>
                  <Typography className="mb-5">
                    StartDate: {batchDetails.startDate}
                  </Typography>
                  <Typography className="mb-5">
                    EndDate: {batchDetails.endDate}
                  </Typography>
                  <Typography>Batch Size:{batchDetails.batchSize}</Typography>
                </>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </CardBody>
            <CardFooter className="pt-0">
              <ProgressBar
                progressValue={
                  progressData == (null || undefined) ? 0 : progressData
                }
              />
            </CardFooter>
          </Card>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="course-card-wrapper"
            style={{ zIndex: 1 }}
          >
            <Card
              className="mt-6 w-full"
              style={{ background: `url(${Yell})` }}
            >
              <CardBody>
                <Typography variant="h3" color="blue-gray" className="mb-2">
                  Learning Plan for Batch
                </Typography>
                <Typography>Type of Plan: Bootcamp</Typography>
              </CardBody>
              <CardFooter className="pt-0">
                {learningPlan && (
                  <Link to="/lms/batches/batchDetails/learningPlan">
                    <Button>View Learning Plan</Button>
                  </Link>
                )}
                {!learningPlan && <Link to="/lms/batches/batchDetails/attachLearningPlan">
                  <Button className="ml-2">Attach Learning Plan</Button>
                </Link>}
                <Link to="/lms/batches/batchDetails/batchUsersProgress">
                  <Button className="ml-2 w-48 h-10">Trainee Progress</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
      <div className="w-1/2 h-full">
        <Card className="h-full m-1 mt-5">
          <CardHeader
            floated={false}
            shadow={false}
            className={`rounded-none ${height}`}
          >
            <div className="mb-0 mt-0 flex items-center justify-between gap-10 mb-0">
              <div>
                <Typography variant="h5" color="blue-gray">
                  List of Trainees in the Batch
                </Typography>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-0">
                <div className="flex shrink-0 flex-col gap-0 sm:flex-row">
                  <Link
                    to="/lms/batches/batchDetails/addUsersToBatch"
                    className="self-end m-1 mr-0"
                  >
                    <Button
                      className="flex items-center gap-1 w-60"
                      size="sm"
                      style={{ background: "#023047" }}
                    >
                      <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add
                      Trainees To Batch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row mt-3 ">
              <SearchBar
                setRows={setRows}
                TABLE_ROWS={trainees}
                setSelectedRows={setSelectedRows}
                rows={rows}
                clearSearch={clearSearch}
              />

              <Button
                onClick={deleteHandler}
                className="flex items-center gap-3"
                color="red"
                size="sm"
                disabled={Object.values(selectedRows).every((value) => !value)} // Disable button if no trainees are selected
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Delete
                Trainees From Batch
              </Button>

              <Modal
                open={open}
                handleOpen={deleteHandler}
                handleClose={handleClose}
                data={modalDeleteTrainee}
              />
            </div>
          </CardHeader>

          <CardBody className="overflow-auto mt-0 ">
            {loader && "Deleting Employees"}
            {!loader && (
              <EmployeeTable
                TABLE_HEAD={TABLE_HEAD}
                rows={rows}
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                setSelectedRows={setSelectedRows}
                error={error}
                loading={loading}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BatchDetails;
