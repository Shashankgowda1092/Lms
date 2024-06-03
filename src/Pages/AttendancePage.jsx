import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
} from "@material-tailwind/react";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect } from "react";
import Modal from "../Components/Modal";
import EmployeeTable from "../Components/EmployeeTable";
import { TABLE_HEAD } from "../Services/EmployeeData.js";
import SearchBar from "../Components/SearchBar";
import {
    fetchEmployees,
  sendSelectedUsers,
} from "../Services/AttendanceEmployee.js";
import { modalSubmitAttendance } from "../Data/ModalData.jsx";
import { FaUserCheck } from "react-icons/fa6";
import SubmittedModal from "../Components/SubmittedModal.jsx";
import { useNavigate } from "react-router-dom";
import Yellow from "../Assets/back1.svg"
import BreadCrumbs from "../Components/BreadCrumbs.jsx";
const AttendancePage = () => {
  const table = {
    height: "570px",
  };

  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [clearSearch, setClearSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State variable to track loading state
  const [submitOpen,setSubmitOpen]=useState(false);
  const navigate=useNavigate();
  const handleOpen = () => {

    if (open) {
      // setFetch((prev) => !prev);
      //   handleAddToBatch();
      submitAttendance();
      setFetch((prev) => !prev);
      setSubmitOpen(true);
      setTimeout(()=>{
        setSubmitOpen(false);
      navigate("/attendance")
      },2000)
      // window.location.reload();
    }
    setOpen((prev) => !prev);
  };
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  const handleCheckboxChange = (employeeId) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [employeeId]: !prevSelectedRows[employeeId],
    }));
  };
  const batch = JSON.parse(sessionStorage.getItem("batch"));
// Retrieve course object from sessionStorage
const course = JSON.parse(sessionStorage.getItem("course"));
  const period = JSON.parse(sessionStorage.getItem("period"));
  const date = sessionStorage.getItem("date");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data =await fetchEmployees(batch.id);
        if(data){
        setEmployees(data);
        setLoading(false); // Set loading to false when data is fetched successfully
        setError(null); // Clear any previous errors
        }else{
          throw new Error("Couldn't fetch all employees")
        }
      } catch (error) {
        console.error("Error fetching trainees:", error);
        setError("Error fetching employees"); // Set error message
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchData();
  }, []);

  // Update rows state when trainees change
  useEffect(() => {
    setRows(employees);
  }, [employees, fetch]);

    const submitAttendance = async () => {
      const selectedUsers = Object.keys(selectedRows).filter(
        (userId) => selectedRows[userId]
      );
      try {
        const allUsers = employees.map(employee => employee.employeeId);
        await sendSelectedUsers(allUsers,selectedUsers, batch.id,course.id,period,date);
        setSelectedRows({});
        setFetch((prev) => !prev);
        setClearSearch(true); // Set clearSearch flag to true to clear search bar
      } catch (error) {
        console.error("Error adding users to batch:", error);
      }
    };
  return (
    <Card className="h-full w-full mt-2">
      <CardHeader style={{background:`url(${Yellow})`,borderRadius:'12px',marginLeft:'0px',padding:'15px',marginRight:'0px',height:'250px',marginTop:'-50px',paddingTop:'0',paddingLeft:'0'}} floated={false} shadow={false} className="rounded-none" >
      <BreadCrumbs/>
        <div  className="mb-8 flex items-center justify-between gap-8" style={{padding:'15px'}}>
          <div  >
          <Typography variant="h5" color="blue-gray" >
          {`Batch-${batch ? batch.name : 'Batch Not Found'} Course-${course ? course.name : 'Course Not Found'}`}
            </Typography>
            <Typography variant="h5" color="blue-gray">
              Employees list
            </Typography>
            <Typography color="gray" variant="h6" className="mt-1 font-normal">
              Select The employees you want to take attendance
            </Typography>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row" style={{padding:'15px'}}>
          <SearchBar
            setRows={setRows}
            TABLE_ROWS={employees}
            setSelectedRows={setSelectedRows}
            rows={rows}
            clearSearch={clearSearch} // Pass clearSearch flag to the SearchBar
          />
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={handleOpen}
              disabled={Object.values(selectedRows).every((value) => !value)} // Disable button if no employees are selected
            >
              <FaUserCheck />
              Submit Attendance
            </Button>

            <Modal
              handleOpen={handleOpen}
              open={open}
              handleClose={handleClose}
              data={modalSubmitAttendance}
            />
            <SubmittedModal submitted={submitOpen}/>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll  px-0" style={table}>
        <EmployeeTable
          TABLE_HEAD={TABLE_HEAD}
          rows={rows}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
          setSelectedRows={setSelectedRows}
          error={error}
          loading={loading}
        />
      </CardBody>
    </Card>
  );
};

export default AttendancePage;
