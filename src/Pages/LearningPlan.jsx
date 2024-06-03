import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import React, { useEffect, useState } from "react";

// import ProgressComponent from "../Components/ProgressComponent";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Drawer,
} from "@material-tailwind/react";
import { IoIosPeople, IoMdClose } from "react-icons/io";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { TopicsTimeLine } from "../Components/TopicsTimeLine";
import { LiaBookSolid } from "react-icons/lia";

import { Link } from "react-router-dom";
// import { Courses, pathDataDummy } from '../Data/Courses'
import ProgressCourse from "../Components/ProgressCourse";
import useAuth from "../Hooks/useAuth";
import axios from "axios";

import { IoCalendarOutline } from "react-icons/io5";
import { FaBookReader } from "react-icons/fa";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

import ProgressService from "../Api/services/Progress/ProgressService";
import ProgressList from "./ProgressList";
import { myHeaders } from "../Services/IpAddress";
import ProgressCourseList from "./ProgressCourseList";

const colorCodes = ["ff70a6", "ff9770", "ffd670", "e9ff70", "70d6ff"];
// const batchID = sessionStorage.getItem("id");
// console.log(id)

const LearningPlan = () => {
  const [pathData, setPathData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [courseSelect,setCourseSelect] = useState();
  const { auth } = useAuth();
  //TODO-get user ID from auth after integration
  const userID = sessionStorage.getItem("empId");
  // const  {searchText,setSearchText} = useContext(searchContext)
  const [searchText, setSearchText] = useState("");

  //TODO - get batchID from session storage after integration
  const batchID = sessionStorage.getItem("id");

  const getPath = async () => {
    try {
      console.log("getpath");
      // const response = await axios.get(`http://172.18.4.81:1111/learning-plan/dto/${sessionStorage.getItem("id")}`);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/batch-course/view-dto/${batchID}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        },
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );
      // const response = await axios.get(`http://172.18.4.108:1111/learning-plan/dto/1`);
      console.log("lets check", response.data);

      return response.data;
    } catch (error) {
      // console.log("errrrrrrorr")
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      //  const batch = await fetchBatchData();
      const path = await getPath();
      if (path) {
        try {
          const coursesWithProgress = await Promise.all(
            path.batchCourses.map(async (course) => {
              // Iterate through each topic of the course
              const topicsWithProgress = await Promise.all(
                course.topic.map(async (topic) => {
                  try {
                    let progressResponse;

                    if (auth.role === "USER") {
                      progressResponse =
                        await ProgressService.getUserProgressOfTopicsByID({
                          userID,
                          batchID,
                          topicID: topic.topicId,
                        });
                    } else {
                      progressResponse =
                        await ProgressService.getOverallTopicProgress({
                          topicID: topic.topicId,
                          batchID,
                        });
                    }
                    return {
                      ...topic,
                      progress: progressResponse.topicProgress,
                    };
                  } catch (error) {
                    // Handle error for this specific topic
                    console.error(
                      "Error fetching progress for topic:",
                      topic.topicId
                    );
                    // Provide a default progress value when the call fails
                    return {
                      ...topic,
                      progress: 0, // Default progress value
                    };
                  }
                })
              );

              // Return the course with topics with progress added
              return {
                ...course,
                topic: topicsWithProgress,
              };
            })
          );

          console.log("Updated path:", coursesWithProgress);

          const updatedPath = {
            ...path,
            batchCourses: coursesWithProgress,
          };

          console.log("Updated path with progress:", updatedPath);

          setPathData(updatedPath);
          console.log("testing", updatedPath);
          if (updatedPath.batchCourses.length === 0) {
            console.log("bharatesh");
            setError("No Learning Plan Assigned to Batch");
          } else {
            setError(null);
          }

          setLoading(false);
        } catch (error) {
          // Handle error for the entire Promise.all() call
          console.error("Error fetching progress for batch courses:", error);
          setError("Couldn't fetch Learning Plan data from backend");
        }
      } else {
        throw new Error("Couldn't fetch batch data from backend");
      }
    } catch (error) {
      setLoading(true);
      setError("Couldn't fetch Learning Plan Data");
      // console.error("Error fetching data:", error);
    }
  };
  const handleOpenDrawer = (courseID) => {
    console.log(courseID,"idddd")
    setCourseSelect(courseID)
    sessionStorage.setItem("courseID", courseID);
    setOpenDrawer(true);
  };
  useEffect(() => {
    fetchData();
    console.log("bhratesh");
    // console.log("dummy path", pathDataDummy)
    console.log(auth);
  }, []);

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  const [openCalendar, setOpenCalendar] = useState();
  const handleOpen = ({ startDate, endDate }) => {
    const startDatef = new Date(startDate);
    const endDatef = new Date(endDate);

    setOpenCalendar(!openCalendar);
    setRange([
      {
        startDate: startDatef,
        endDate: endDatef,
        key: "selection",
      },
    ]);
  };
  const [range, setRange] = useState([{}]);
  const [courseIndex, setCourseIndex] = useState();

  const skelteonArr = [0, 0, 0, 0];
  return (
    <div className="w-full bg-[#e4e4e4]">
      <>
        <Dialog open={openCalendar} handler={handleOpen}>
          <DialogHeader className="flex flex-row justify-between">
            <Typography variant="h5" color="blue-gray">
              Duration
            </Typography>
            <IoMdClose className="cursor-pointer " onClick={handleOpen} />
          </DialogHeader>
          <DialogBody
            divider
            className="grid place-items-center gap-4 bg-[#8ECAE6]"
          >
            <div className="rounded-xl p-5 bg-white shadow-xl">
              <DateRange
                onChange={() => {}}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                direction="vertical"
                preventSnapRefocus={true}
                ranges={range}
                readOnly={false} // Makes the calendar read-only
                editableDateInputs={false} // Prevents editing of date inputs
                minDate={range[0].startDate} // Minimum allowed date
                maxDate={range[0].endDate} // Maximum allowed date
              />
            </div>
          </DialogBody>
        </Dialog>
      </>

      {error === null ? (
        <Card className=" w-full  bg-[#FFFFFF] z-50">
          <CardBody>
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <Typography variant="h2" color="blue-gray">
                  {pathData.learningPlanName}
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  {pathData.learningPlanType}
                </Typography>
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max">
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Typography className="flex justify-center items-center   text-red-700    shadow-lg  text-lg">
          {error}
        </Typography>
      )}

      <VerticalTimeline lineColor="black" layout="1-column-left">
        {loading ? (
          skelteonArr.map((data, key) => {
            return (
              <VerticalTimelineElement
                key={key}
                // style={{ width: "900px", marginLeft:"0" }}
                className=" vertical-timeline-element--work w-full p-2 mr-52 min-w-[300px] animate-pulse bg-[#e4e4e4]"
                contentStyle={{
                  background: "transparent",
                  color: "transparent",
                  boxShadow: "none",
                  padding: "0px",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid  rgb(251, 133, 0)",
                  width: "300px",
                }}
                // date="2011 - 2022"
                iconStyle={{ background: "rgb(251, 133, 0)", color: "#5cd561" }}

                // icon={<WorkIcon />}
              >
                <div className="animate-pulse">
                  <Card
                    className={`min-h-52  w-[900px] flex-row  mr-52 bg-gray-300 `}
                  >
                    <CardHeader
                      shadow={false}
                      floated={false}
                      className="m-0 w-3/5 shrink-0 rounded-r-none p-3 overflow-y-auto bg-gray-200"
                    >
                      <div></div>
                    </CardHeader>
                    <CardBody className="relative flex flex-col justify-between w-full md:w-4/5">
                      <div className="flex flex-col justify-center items-center">
                        <Card className="p-4   bg-gray-400 w-[300px] h-[200px]">
                          <div className=" bg-gray-300 rounded-full p-2 mb-3"></div>
                          <div className=" bg-gray-300 rounded-full p-2 mb-3"></div>

                          <div className=" bg-gray-300 rounded-full p-2 mb-3"></div>
                          {/* <RangePicker  selectedDays={{from:data.startDate,to:data.endDate}}/> */}
                          <div className=" bg-gray-300 rounded-full p-2 mb-3"></div>
                        </Card>
                        <div className="group mt-8 inline-flex flex-wrap items-center gap-3 ">
                          <IconButton className="bg-gray-400">
                            <div></div>
                          </IconButton>
                          <IconButton className="bg-gray-400">
                            <div></div>
                          </IconButton>
                          <IconButton className="bg-gray-400">
                            <div></div>
                          </IconButton>
                          <IconButton className="bg-gray-400">
                            <div></div>
                          </IconButton>
                          <IconButton className="bg-gray-400">
                            <div></div>
                          </IconButton>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </VerticalTimelineElement>
            );
          })
        ) : (
          // <Typography className="h-screen flex justify-center items-center">Loading Learning Plan</Typography>
          <>
            {pathData.batchCourses
              .filter((items) =>
                items.courseName
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              )
              .map((data, index) => {
                //  setSelected(colorCodes[Math.floor(Math.random() * colorCodes.length)])
                //    console.log(data.colorCodes.map(()=>))
                //   console.log(selectedColor)
                console.log(data);

                return (
                  <>
                    <VerticalTimelineElement
                      key={data.courseId}
                      // style={{ width: "900px", marginLeft:"0" }}
                      className=" vertical-timeline-element--work  p-0 mr-52 w-[1000px]  h-full  my-30 "
                      contentStyle={{
                        background: "transparent",
                        color: "transparent",
                        boxShadow: "none",
                        padding: "0px",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(250, 172, 85)",
                        width: "300px",
                      }}
                      iconStyle={{
                        background: "rgb(250, 172, 85)",
                        color: "#5cd561",
                      }}

                      // icon={<WorkIcon />}
                    >
                      <Card
                        className={`min-h-52 max-h-96 w-[900px] flex-row  mr-52 bg-[#023047c5] shadow-2xl`}
                      >
                        <CardHeader
                          shadow={false}
                          floated={false}
                          className="m-0 w-3/5 shrink-0 rounded-r-none p-3 overflow-y-auto bg-[#e6b947]  "
                          style={{
                            boxShadow: "inset 0 0 10px #000000",
                            transition: "box-shadow 1s ease",
                          }}
                        >
                          <TopicsTimeLine topics={data.topic} />
                        </CardHeader>

                        <CardBody className="relative flex flex-col justify-between w-full md:w-4/5  ">
                          <div className="flex flex-col justify-center items-center">
                            <Card className="items-start shadow-xl   bg-[#f2f2f2] h-[250px] w-[320px] flex flex-col flex-fit p-4 ">
                              <Typography
                                variant="h4"
                                color="blue-gray"
                                className="mb-2"
                              >
                                {data.courseName}
                              </Typography>
                              <Typography
                                color="gray"
                                variant="paragraph"
                                className=" hover: cursor-pointer bg-[#8ECAE6] rounded-2xl border border-blue-50 items-center justify-center p-3 flex flex-row gap-5"
                              >
                                <FaBookReader size={24} /> {data.trainer}
                              </Typography>
                              {/* <RangePicker selectedDays={{ from: data.startDate, to: data.endDate }} /> */}
                              {/* <Typography color="gray" variant="paragraph">
                        Trainer: {data.trainer}
                      </Typography> */}

                              <Typography
                                onClick={() =>
                                  handleOpen({
                                    startDate: data.startDate,
                                    endDate: data.endDate,
                                  })
                                }
                                color="gray"
                                variant="paragraph"
                                className=" bg-[#8ECAE6] cursor-pointer rounded-2xl items-center justify-center p-3 flex flex-row gap-5"
                              >
                                <IoCalendarOutline size={26} /> {data.startDate}{" "}
                                to {data.endDate}
                              </Typography>
                              <ProgressCourse
                                courseID={data.courseId}
                                batchID={batchID}
                                userID={userID}
                              />
                            </Card>

                            <div className="group mt-8 inline-flex flex-wrap items-center gap-3 ">
                              <Tooltip content="Course Resources">
                                <Link
                                  to={
                                    auth.role === "USER"
                                      ? "/lms/batch/learningPlan/resources"
                                      : auth.role === "TRAINER"
                                      ? "/courses/LearningPlan/LeaningResource"
                                      : "/lms/batches/batchDetails/learningPlan/resources"
                                  }
                                  state={{
                                    fromHome: { courseId: data.courseId },
                                  }}
                                >
                                  <IconButton
                                    className="hover:border-gray-900/10 hover:bg-black-900/10 hover:!opacity-100 group-hover:opacity-70 bg-[#023047]"
                                    onClick={() => {
                                      setCourseIndex(index);
                                    }}
                                  >
                                    <LiaBookSolid className="text-[1.5rem]" />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                              
                         

                              <Tooltip content="other funcs">
                                <IconButton className="hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70 bg-[#023047]">
                                  {/* <LiaBookSolid className="text-[1.5rem]" /> */}
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="other funcs">
                                <IconButton className="hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70 bg-[#023047]">
                                  {/* <LiaBookSolid className="text-[1.5rem]" /> */}
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="other funcs">
                                <IconButton className="hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70 bg-[#023047]">
                                  {/* <LiaBookSolid className="text-[1.5rem]" /> */}
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </VerticalTimelineElement>
                  </>
                );
              })}
          </>
        )}
      </VerticalTimeline>
      <Drawer
        placement="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        className="p-4 overflow-y-auto"
        size={1000}
      >
        <ProgressCourseList courseID={courseSelect} />
      </Drawer>
    </div>
  );
};

const LearningPlanSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <VerticalTimeline lineColor="black" layout="1-column-left">
        <div className="flex flex-wrap items-center gap-8">
          <div className="grid h-36 w-36 place-items-center rounded-lg bg-gray-300"></div>
          <div className="w-max">
            <div className="mb-4 h-3 w-56 rounded-full bg-gray-300"></div>
            <div className="mb-2 h-2 w-72 rounded-full bg-gray-300"></div>
            <div className="mb-2 h-2 w-72 rounded-full bg-gray-300"></div>
            <div className="mb-2 h-2 w-72 rounded-full bg-gray-300"></div>
            <div className="mb-2 h-2 w-72 rounded-full bg-gray-300"></div>
            <div className="mb-2 h-2 w-72 rounded-full bg-gray-300"></div>
            <div className="mb-2 h-2 w-72 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </VerticalTimeline>
    </div>
  );
};

export default LearningPlan;
