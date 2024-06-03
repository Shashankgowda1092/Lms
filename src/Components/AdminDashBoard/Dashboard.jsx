import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ProfilePage } from "./ProfilePage";
import { BulkUploadForm } from "./Bulkupload";
import { Bulkuploaddialog } from "./Bulkuploaddialog";
import { LogoutDialog } from "./LogoutDialog";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserListPage from "./Userslist";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router-dom";
import lms1 from "../../Assets/lms1.png";
import { MdAssessment } from "react-icons/md";
import { MdEditCalendar } from "react-icons/md";
import { GrScorecard } from "react-icons/gr";
import { FcCalendar } from "react-icons/fc";
import { FcContacts } from "react-icons/fc";
import { FcAddDatabase } from "react-icons/fc";
import { FcViewDetails } from "react-icons/fc";
import { FcQuestions } from "react-icons/fc";
import axios from "axios";
import TableWithStripedRows from "../../Pages/Att"; 
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
// import { useHistory } from 'react-router-dom'; // Assuming you're using React Router for navigation

// function Dashboard() {
//   const history = useHistory();
//   const handleLinkClick = () => {
//     // Get the JWT token from wherever it's stored (e.g., localStorage, sessionStorage)
//     const jwtToken = localStorage.getItem('jwtToken'); // Assuming you stored the token in localStorage

//     // Append JWT token to HTTP headers
//     const headers = new Headers();
//     headers.append('Authorization', `Bearer ${jwtToken}`);

//     // Redirect to Website B with JWT token in headers
//     fetch("http://172.18.4.81:3000", {
//       method: 'GET',
//       headers: headers
//     })
//     .then(response => {
//       // Handle response (e.g., redirect to Website B)
//       history.push("http://172.18.4.81:3000"); // Assuming '/websiteB' is the route for Website B
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   };


const Dashboard = () => {
  const [viewProfile, setViewProfile] = useState(false);
  const [BulkuploadOpen, setBulkuploadOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { auth } = useAuth();
  const query = new URLSearchParams({
    employee_Id:auth.empID
  }).toString();
  // console.log("auth in resource",auth.accessToken)
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GOWSIC}/user/all`
      );
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div
      className="flex flex-row w-full h-screen background"
      style={{ userSelect: "none" }}
    >
      <div className="w-half h-full">
        <Sidebar
          setViewProfile={setViewProfile}
          setBulkuploadOpen={setBulkuploadOpen}
          BulkuploadOpen={BulkuploadOpen}
          setShowLogoutPopup={setShowLogoutPopup}
          showLogoutPopup={showLogoutPopup}
        />
        <img
          src={lms1}
          alt="lms1"
          className="absolute w-24 h-18 top-0 right-9"
        />
      </div>
      {/* return (
<div>
<p>Assessment</p>
<button onClick={handleLinkClick}>Go to Website B</button>
</div>
  ); */}

      <div
        className="flex flex-col w-full h-full"
        style={{ userSelect: "none" }}
      >
        <div className="h-[70px] text-center shadow-md ">
          <h1 className="font-bold text-4xl relative right-[-0px] h-[90px] top-3">
            Welcome {auth.username}
          </h1>
        </div>

        <div className="flex flex-wrap justify-between gap-3 mt-6  ">
          <Link to="/newplan">
            {" "}
            <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
              <CardBody>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                >
                  <FcCalendar />
                  Add Plan
                </Typography>
                <Typography></Typography>
              </CardBody>
            </Card>
          </Link>
          <Link to="/course">
            <Card className="w-[300px] right-[-15px] left-[3px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
              <CardBody>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                >
                  <FcContacts />
                  Add Course
                </Typography>
                <Typography></Typography>
              </CardBody>
            </Card>
          </Link>
          <Link to="/bulkcourse">
            <Card className="w-[300px] right-[-15px] left-[-17px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
              <CardBody>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                >
                  <FcAddDatabase />
                  Bulk Upload Course
                </Typography>
                <Typography></Typography>
              </CardBody>
            </Card>
          </Link>
        </div>

        <div className="flex flex-wrap justify-between gap-3 mt-6">
          <Link
           to={`http://172.18.4.81:3000?${query}`}
            target="_blank"
            rel="noopener noreferrer"
            state={{ auth }}
          >
            <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
              <CardBody>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                >
                  <FcQuestions />
                  Assessment
                </Typography>
                <Typography></Typography>
              </CardBody>
            </Card>
          </Link>
          <Link to="/attendance">
            <Card className="w-[300px] right-[-15px] left-[3px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
              <CardBody>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                >
                  <MdEditCalendar />
                  Attendance
                </Typography>
                <Typography></Typography>
              </CardBody>
            </Card>
          </Link>

          <Link >
          <Card className="w-[300px] right-[-15px] left-[-17px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
              <CardBody>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                >
                  <FcViewDetails />
                  Evaluation
                </Typography>
                <Typography></Typography>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between flex-grow gap-0">
        {viewProfile && <ProfilePage />}
      </div>
      {BulkuploadOpen && (
        <div className="flex flex-col flex-grow">
          <Bulkuploaddialog setBulkuploadOpen={setBulkuploadOpen} />
          <BulkUploadForm setBulkuploadOpen={setBulkuploadOpen} />
        </div>
      )}
      {showLogoutPopup && (
        <div className="flex flex-col flex-grow">
          <LogoutDialog
            setShowLogoutPopup={setShowLogoutPopup}
            showLogoutPopup={showLogoutPopup}
          />
        </div>
      )}
      <Routes>
        <Route path="/userlist" element={<UserListPage />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
