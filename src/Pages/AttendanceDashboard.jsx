
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { MdEditCalendar } from "react-icons/md";

export const AttendanceDashboard = () => {
    const navigate=useNavigate();
    const takeAttendance=()=>{
      sessionStorage.setItem("update",0);
      navigate("/attendance/batchSelect");
    }
    const updateAttendance=()=>{
      sessionStorage.setItem("update",1);
      navigate("/attendance/batchSelect")
    }
  return (
    <div>AttendanceDashboard

<Card className="w-[300px] right-[-15px] left-[3px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
            <CardBody>
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2 text-center"
              >
                <div onClick={takeAttendance}>
                <MdEditCalendar />
                  Take Attendance
                </div>
              </Typography>
              <Typography></Typography>
            </CardBody>
          </Card>
          <Card className="w-[300px] right-[-15px] left-[3px] h-[100px] max-h-[200px] border-l-[4px] hover:scale-110 hover:bg-blue-50  ease-in-out duration-300">
            <CardBody>
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2 text-center"
              >
                <div onClick={updateAttendance}>
                <MdEditCalendar />
                  Update Attendance
                </div>
              </Typography>
              <Typography></Typography>
            </CardBody>
          </Card>

    </div>
  )
}
