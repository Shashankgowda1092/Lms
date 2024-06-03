import React, { useState } from "react";
import { FaRegCalendarMinus, FaTasks } from "react-icons/fa";
import { SiFuturelearn } from "react-icons/si";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import { myHeaders } from "../../Services/IpAddress";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Userdailoge from "./Userdailoge"; // Import Userdailoge component
import { Link, useNavigate } from "react-router-dom";
import { SiBookstack } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { MdOutlineAssessment } from "react-icons/md";

const Page = () => {
  const { auth } = useAuth();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const fetUserDetails = () => {
    axios
      .get(`${import.meta.env.VITE_API_GOWSIC}/user/all`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetUserDetails();

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
      <h1 className="text-[28px] leading-[34px] font-normal text-black cursor-pointer">
        Welcome {auth.username}
      </h1>
      <div className="flex items-center justify-between"></div>
      <div className="grid grid-cols-3 gap-6 mt-[25px] pb-[15px] border-1-[4px] border-[#4E73DF]">
        {/* Learning Resources Card */}
        <div
          onClick={() => setIsUserDialogOpen(true)}
          className="cursor-pointer"
        >
          <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50 ease-in-out duration-300">
            <CardBody className="flex items-center justify-center">
              <SiBookstack className="h-8 w-8 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                User Batch
              </Typography>
            </CardBody>
          </Card>
        </div>

        {/* Attendance Card */}
        <Link to="#">
          <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50 ease-in-out duration-300">
            <CardBody className="flex items-center justify-center">
              <SlCalender className="h-8 w-8 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Attendance
              </Typography>
            </CardBody>
          </Card>
        </Link>

        {/* Assessments Card */}
        <Link>
          <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50 ease-in-out duration-300">
            <CardBody className="flex items-center justify-center">
              <MdOutlineAssessment className="h-8 w-8 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Assessments
              </Typography>
            </CardBody>
          </Card>
        </Link>

        <Link to="/evaluation">
          <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50 ease-in-out duration-300">
            <CardBody className="flex items-center justify-center">
              <MdOutlineAssessment className="h-8 w-8 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Evaluation Scores
              </Typography>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Render Userdailoge if isUserDialogOpen is true */}
      {isUserDialogOpen && (
        <Userdailoge setIsUserDialogOpen={setIsUserDialogOpen} />
      )}
    </div>
  );
};

export default Page;
