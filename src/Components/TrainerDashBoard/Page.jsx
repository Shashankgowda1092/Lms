import React, { useState } from "react";
import { FaRegCalendarMinus, FaTasks } from "react-icons/fa";
import { SiFuturelearn } from "react-icons/si";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Modules } from "./Modules"; // Import Modules component
import Userdailoge from "./Userdailoge"; // Import Userdailoge component
import { Link, useNavigate } from "react-router-dom";
import { SiBookstack } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { MdOutlineAssessment } from "react-icons/md";
 
 
const Page = () => {
  const { auth } = useAuth();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
 

 
  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
   
      <div className="flex items-center justify-between">
       
      <h1 className="text-[28px] leading-[34px] font-normal text-black cursor-pointer">
      Dashboard
      </h1>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-[25px] pb-[15px] border-1-[4px] border-[#4E73DF]">
 
  {/* Learning Resources Card */}
  <Link to="/learningresource" >
  <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
    <CardBody className="flex items-center justify-center">
      <SiBookstack className="h-8 w-8 text-blue-500 mr-2" />
      <Typography variant="h5" color="blue-gray" className="mb-2">
        Learning Resources
      </Typography>
    </CardBody>
  </Card>
</Link>
 
  {/* Attendance Card */}
 
  <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
    <CardBody className="flex items-center justify-center">
      <SlCalender className="h-8 w-8 text-blue-500 mr-2" />
      <Typography variant="h5" color="blue-gray" className="mb-2">
        Attendance
      </Typography>
    </CardBody>
  </Card>

 
  {/* Assessments Card */}
 
  <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
    <CardBody className="flex items-center justify-center">
      <MdOutlineAssessment className="h-8 w-8 text-blue-500 mr-2" />
      <Typography variant="h5" color="blue-gray" className="mb-2">
        Assessments
      </Typography>
    </CardBody>
  </Card>


<Link to="/evaluations" >
  <Card className="w-[300px] right-[-15px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
    <CardBody className="flex items-center justify-center">
      <MdOutlineAssessment className="h-8 w-8 text-blue-500 mr-2" />
      <Typography variant="h5" color="blue-gray" className="mb-2">
        Evaluation
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