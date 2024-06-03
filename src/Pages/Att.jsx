import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// Import your popup component
import { CiViewList } from "react-icons/ci";

import {
  CardHeader,
  Card,
  Typography,
  Input,
  Button,
  Select,
  Option,
  CardBody,
  CardFooter,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { MdBarChart, MdGroups2 } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import {
  MdArrowCircleRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import AttendanceCalender from "../Components/AttendanceReport/AttendanceCalender";
// import Radargraph from "./Radargraph";
// import { Link } from "react-router-dom";

// import { LiaBookSolid } from "react-icons/lia";
// import { IoIosPeople } from "react-icons/io";
// import * as XLSX from "xlsx";
import { myHeaders } from "../Services/IpAddress";

import EmployeeList from "../Components/AttendanceReport/EmployeeList";
import Popup from "../Components/AttendanceReport/Popup";
import DownloadDialog from "../Components/AttendanceReport/DownloadDialog";
import { useNavigate } from "react-router-dom";

// import { MagnifyingGlassIcon,ArrowDownTrayIcon} from '@heroicons/react/solid';

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet();
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
  XLSX.writeFile(workbook, "employees.xlsx");
};

const toggleGraphVisibility = () => {
  setShowGraph(!showGraph);
};

function TableWithStripedRows() {
  const [view, setView] = useState("Calendar");
  const [overall, setOverall] = useState(true);
  const [batchData, setBatchData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [empID, setEmpID] = useState(null);
  const [openDownload, setOpenDownload] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false); // State to manage popup visibility

  const [loading, setLoading] = useState(true);

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  const [search, setSearch] = useState("");

  const [batchSelect, setBatchSelect] = useState(null);
  const [error, setError] = useState("");
  const sliderRef = useRef(null);
  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };
  const handleScroll = (e) => {
    if (e.deltaY !== 0) {
      // e.preventDefault();
      sliderRef.current.scrollLeft += e.deltaY;
    }
  };

  const [selectedCourses, setSelectedCourses] = useState({});

  // Your batchData and other functions...

  const getBatchData = async () => {
    axios
      .get(`http://172.18.5.20:8085/batch`,{
        headers:{
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setBatchData(response.data); // Update batchData state with fetched data
        setLoading(false);
      })
      .catch((error) => {
        setLoading(true);
        setError("Batches not found");
        console.error("Error fetching batch data:", error);
      });
  };

  useEffect(() => {
    // Fetch batch data from backend endpoint when component mounts
     getBatchData();

    // Disable scrolling for the whole page when the component mounts
    // document.body.style.overflow = "hidden";

    // Re-enable scrolling when the component unmounts
    // return () => {
      // document.body.style.overflow = "auto";
    // };
  }, [overall]);
  const navigate=useNavigate();
  const takeAttendance=()=>{
    sessionStorage.setItem("update",0);
    navigate("/attendance/batchSelect")
  }
  const updateAttendance=()=>{
    sessionStorage.setItem("update",1);
    navigate("/attendance/batchSelect")
  }
  return (
    <Card className="h-full w-full bg-[#E5E5E5]">
      <div floated={false} shadow={false} className="rounded-none bg-gray-200">
        <div className="mb-4 flex p-1  flex-col bg-[#FFFFFF]  justify-between gap-8 md:flex-row md:items-center">
          <div className="ml-6">
            <Typography variant="h5" color="blue-gray">
              Attendance Report
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Learning Management System
            </Typography>
          </div>
          {openDownload ? (
            <DownloadDialog
              openDownload={openDownload}
              setOpenDownload={setOpenDownload}
              courseID={selectedCourse.courseID}
              batchID={batchSelect}
              setBatchID={setBatchSelect}
              setCourse={setSelectedCourse}
            />
          ) : null}
          <div className="flex w-full shrink-0 mr-3 gap-2 md:w-max">
            <div onClick={takeAttendance}>
            <IconButton className="bg-[#023047]">
              <IoMdPersonAdd className="text-[24px]" />
              <i className=" fas fa-heart " />
            </IconButton>
            </div>

           <div onClick={updateAttendance}>
           <IconButton className="bg-[#023047]">
              <MdOutlineUpdate className="text-[24px]" />
              <i className="fas fa-heart " />
            </IconButton>
           </div>
            <Button
              className="flex items-center gap-3 bg-[#023047] text-[#FFFFFF]"
              size="sm"
              onClick={() => {
                setOpenDownload(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#FFFFFF] "
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              Download
            </Button>
          </div>
        </div>
      </div>

      <div
        id="hoverarea"
        className="relative flex items-center"
        onWheel={handleScroll}
        ref={sliderRef}
      >
        <MdKeyboardArrowLeft
          onClick={slideLeft}
          size={40}
          className="text-blue-500 "
        />
        <div
          id="slider"
          className="h-52 w-[100vw] rounded-2xl mb-3 bg-[rgba(255,184,3,0.47)] flex flex-row gap-6 justify-start items-center px-5 overflow-x-scroll scroll  scroll-smooth no-scrollbar     "
        >
          {loading ? (
            <Typography color="red">{error}</Typography>
          ) : (
            batchData.map((data, index) => (
              <Card
                key={data.batchId}
                className={
                  batchSelect === data.batchId
                    ? "h-36 min-w-48 bg-[#023047] cursor-pointer text-[#FFFFFF]  "
                    : "  h-36 min-w-48  cursor-pointer shadow-2xl  hover:scale-105 bg-[#FFFFFF] hover:bg-[#8ECAE6]  ease-in-out duration-300 inline-block"
                }
                onClick={() => {
                  setBatchSelect(data.batchId);
                  setPopupVisible({
                    ...popupVisible,
                    [data.batchId]: true,
                  });
                }}
              >
                <CardBody className="flex flex-col gap-0 justify-start p-3">
                  <Typography variant="h4" className="mb-5">{data.batchName}</Typography>
                  {/* <Typography variant="paragraph">23/56 Present</Typography> */}
                  {/* <Typography>Director-BU Head: Chaitra</Typography> */}
                  <div
                    className={
                      batchSelect === data.batchId
                        ? "flex flex-row justify-start items-center gap-1 bg-[#219EBC] rounded-xl p-1 mt-2"
                        : "  mt-2 "
                    }
                  >
                    <CiViewList
                      size={37}
                      style={
                        selectedCourse.courseID &&
                        batchSelect === data.batchId && {
                          color: "red",
                        }
                      }
                    />
                    {selectedCourse.courseID &&
                    batchSelect === data.batchId &&
                    selectedCourse.batchID === data.batchId ? (
                      <Typography className="mt-1 px-1 ">
                        Course: {selectedCourse.courseName}
                      </Typography>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            ))
          )}

          {batchData.map(
            (data) =>
              popupVisible[data.batchId] && (
                <Popup
                  key={data.batchId}
                  setEmpID={setEmpID}
                  setOverall={setOverall}
                  setSelectedCourse={setSelectedCourse}
                  batchSelect={batchSelect}
                  onClose={() =>
                    setPopupVisible({
                      ...popupVisible,
                      [data.batchId]: false,
                    })
                  }
                />
              )
          )}
        </div>
        <MdKeyboardArrowRight
          onClick={slideRight}
          size={40}
          className="text-blue-500"
        />
      </div>

      <div className="flex flex-row items-center justify-start gap-3  ">
        <EmployeeList
          setSearch={setSearch}
          search={search}
          batchSelect={batchSelect}
          setOverall={setOverall}
          overall={overall}
          selectedRow={empID}
          setSelectedRow={setEmpID}
        />

        <Card id="view" className="bg-[#FFFFFF] h-[61vh] min-w-[50vw]  ">
          <CardBody>
            <div className="flex flex-col justify-center items-center ">
              <div className="flex flex-row justify-start items-center h-[50vh]">
                <AttendanceCalender
                  overall={overall}
                  courseID={selectedCourse.courseID}
                  batchID={batchSelect}
                  empID={empID}
                />

                {/* */}
              </div>
            </div>

            <div className="  w-full inline-flex flex-wrap justify-start items-center gap-[400px] mt-4 ">
              <Tooltip content="Batchwise">
                <button
                  className="hover:border-[#023047]  hover:bg-[#023047] w-20 h-7 flex justify-center items-center hover:!opacity-100 m-0 border rounded-lg p-1 bg-[#272727] border-[#313131] text-white "
                  onClick={() => {
                    setOverall(true);
                  }}
                >
                  <MdGroups2 size={28} />
                  {/* <LiaBookSolid className="text-[1.5rem]" /> */}
                </button>
              </Tooltip>
            </div>
            {/* </div> */}
            {/* </div> */}
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </Card>
  );
}

export default TableWithStripedRows;
