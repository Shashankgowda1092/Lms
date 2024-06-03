import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { LiaBookSolid } from "react-icons/lia";
import { IoIosPeople } from "react-icons/io";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Calendar } from "react-date-range";
import { isWeekend } from "date-fns";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import { format } from "date-fns";
import { myHeaders } from "../../Services/IpAddress";
import useAuth from "../../Hooks/useAuth";

// import Chart from "react-apexcharts";

const AttendanceReport = ({ overall, batchID, courseID, empID }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceDeets, setAttendanceDeets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstHalf, setFirstHalf] = useState(false);
  const [error, setError] = useState("");
  const { auth } = useAuth();

  // Function to handle click on a date
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getBatchAttendance = async () => {
    try {
      // console.log("hello");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_GOWSIC
        }/attendance-report/attendance/percentage/${batchID}/${courseID}/1970-05-24/3000-05-30`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      console.log("upload", response.data);
      return response.data;
    } catch (error) {
      setError();
      console.error(error);
    }
  };

  const getIndividualAttendance = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_GOWSIC
        }/attendance-report/employee/${batchID}/${courseID}/${empID}/2010-05-24/2050-05-30`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      // console.log("hello");
      return response.data[0].attendance;
    } catch (error) {
      console.error(error);
    }
  };

  function interpolateColor(percent) {
    // console.log(percent);
    const startRGBA = "rgba(198, 40, 40, 1)".match(/\d+/g);
    const middleRGBA = "rgba(255, 152, 0, 1)".match(/\d+/g);
    const endRGBA = "rgba(46, 125, 50, 1)".match(/\d+/g);

    const startAlpha = parseFloat(startRGBA[3]);
    const middleAlpha = parseFloat(middleRGBA[3]);
    const endAlpha = parseFloat(endRGBA[3]);

    const resultRGBA = [];

    for (let i = 0; i < 3; i++) {
      const startValue = parseInt(startRGBA[i]);
      const middleValue = parseInt(middleRGBA[i]);
      const endValue = parseInt(endRGBA[i]);

      let interpolatedValue;
      if (percent <= 0.5) {
        interpolatedValue = Math.round(
          startValue + (middleValue - startValue) * percent * 2
        );
      } else {
        interpolatedValue = Math.round(
          middleValue + (endValue - middleValue) * (percent - 0.5) * 2
        );
      }

      resultRGBA.push(interpolatedValue);
    }

    let interpolatedAlpha;
    if (percent <= 0.5) {
      interpolatedAlpha = startAlpha + (middleAlpha - startAlpha) * percent * 2;
    } else {
      interpolatedAlpha =
        middleAlpha + (endAlpha - middleAlpha) * (percent - 0.5) * 2;
    }

    resultRGBA.push(interpolatedAlpha.toFixed(1));

    return `rgba(${resultRGBA.join(", ")})`;
  }

  const calcAttendance = (data) => {
    const attendanceMap = {};

    data.forEach(({ date, type, status }) => {
      if (!attendanceMap[date]) {
        attendanceMap[date] = 0;
      }

      if (status === "present") {
        if (type === "Full Day") {
          attendanceMap[date] += 1;
        } else if (type === "First Half" || type === "Second Half") {
          attendanceMap[date] += 0.5;
        }
      } else if (status === "Not Taken") {
        attendanceMap[date] = -1;
      }
    });

    return attendanceMap;
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (overall && courseID && batchID) {
        const attendance = await getBatchAttendance();
        setAttendanceDeets(attendance);
      } else if (!overall && empID && courseID && batchID) {
        const attendance = await getIndividualAttendance();
        setAttendanceDeets(calcAttendance(attendance));
      } else {
        setError("Please select a valid batch and course.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [overall, courseID, empID, batchID]);

  return (
    <div className="flex justify-center items-center gap-5 pl-4">
      {!overall ? (
        <>
          {" "}
          {!loading ? (
            <div className="mx-auto max-w-md">
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                className="bg-[rgba(255,184,3,0.24)] rounded-md shadow-md pt-4 pb-4 pr-4 pl-0 relative left-[-40px]"
                style={{ width: "480px", height: "300px" }}
                dayContentRenderer={(date) => {
                  let isHoliday = isWeekend(date.toLocaleDateString());

                  if (
                    isHoliday ||
                    attendanceDeets[format(date, "yyyy-MM-dd")]
                  ) {
                    return (
                      <div
                        className={`flex text-black items-center justify-center h-full  rounded-2xl w-28 m-1 ${
                          isHoliday
                            ? "text-gray-500 "
                            : attendanceDeets[format(date, "yyyy-MM-dd")] ===
                              0.5
                            ? "bg-orange-800"
                            : attendanceDeets[format(date, "yyyy-MM-dd")] === 1
                            ? "bg-green-800"
                            : attendanceDeets[format(date, "yyyy-MM-dd")] === 0
                            ? "bg-red-800"
                            : null
                        }`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  }
                }}
              />
            </div>
          ) : (
            <div className="mx-auto min-h-[350px] min-w-[450px] bg-gray-100 animate-pulse  flex justify-center items-center ">
              <Typography color="green">Loading...</Typography>
            </div>
          )}
          <div className="">
            <div className="bg-white rounded-md shadow-md p-4 w-[130px] flex flex-col justify-center items-start">
              <div className="mb-2">
                <div className="w-4 h-4 bg-red-800 rounded-full inline-block mr-2"></div>
                <span>On Leave</span>
              </div>
              <div className="mb-2">
                <div className="w-4 h-4 bg-orange-800 rounded-full inline-block mr-2"></div>
                <span>Flexi Time</span>
              </div>
              <div>
                <div className="w-4 h-4 bg-green-800 rounded-full inline-block mr-2"></div>
                <span>In Office</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {!loading ? (
            <div className="mx-auto max-w-md">
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                className="bg-[rgba(255,184,3,0.24)] rounded-md shadow-md pt-4 pb-4 pr-4 pl-0 relative left-[-40px]"
                style={{ width: "480px", height: "300px" }}
                dayContentRenderer={(date) => {
                  let isHoliday = isWeekend(date.toLocaleDateString());

                  if (
                    isHoliday ||
                    attendanceDeets[format(date, "yyyy-MM-dd")]
                  ) {
                    return (
                      <div
                        className={`flex text-black items-center justify-center h-full  rounded-2xl w-28 m-1`}
                        style={{
                          backgroundColor: isHoliday
                            ? null
                            : interpolateColor(
                                attendanceDeets[format(date, "yyyy-MM-dd")][
                                  `${!firstHalf ? "First Half" : "Second Half"}`
                                ] / 100
                              ),
                        }}
                      >
                        {date.getDate()}
                      </div>
                    );
                  }
                }}
              />
            </div>
          ) : (
            <div className="mx-auto min-h-[350px] min-w-[450px] bg-gray-100 animate-pulse  flex justify-center items-center ">
              <Typography color="green">
                {error ? error : "Select Course..."}
              </Typography>
            </div>
          )}
          <div className="">
            <Typography className=" ml-4 text-black text-left text-xs">
              Present Percentage
            </Typography>
            <div className="bg-white rounded-md shadow-md p-4 w-[130px] flex flex-col justify-center items-center">
              <div className="mb-2">
                <div className="flex flex-row justify-stretch">
                  <div className="bg-gradient-to-b from-red-800 via-orange-500 to-green-800 w-4 h-44 "></div>
                  <div className="flex flex-col justify-between px-2 py-0 my-0">
                    {" "}
                    <p>0%</p>
                    <p>100%</p>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceReport;
