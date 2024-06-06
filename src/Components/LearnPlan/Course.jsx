import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myHeaders } from '../../Services/IpAddress';

export function Course() {
  const [courseData, setCourseData] = useState({
    courseName: "",
    level: "",
    courseID: 0,
    courseDuration: "", // Updated state for course duration
  });

  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseItem, setCourseItem] = useState([]);
  const [showCourseDiv, setShowCourseDiv] = useState(false);
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [searchCourse, setSearchCourse] = useState("");
  const [showCourseList, setShowCourseList] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState("");
  const [viewAddCourseButton, setViewAddCourseButton] = useState(true);

  const handleInputClick = () => {
    setShowCourseList(true);
  };

  const handleSearchBlur = () => {
    setShowCourseList(false);
  };

  const handleSearch = (e) => {
    setSearchCourse(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeLevel = (value) => {
    setCourseData((prevState) => ({
      ...prevState,
      level: value,
    }));
  };

  const fetchCourseItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/course`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setCourseItem(response.data);
      } else {
        console.error("Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Error occurred while fetching courses:", error);
      setCustomErrorMessage("Error occurred while fetching courses");
    }
  };

  useEffect(() => {
    fetchCourseItems();
  }, []);

  const handleCourseItemChange = (value) => {
    setSearchCourse(value);
    setSelectedCourse(value);

    const courseSelectedFromDropdown = courseItem.filter(
      (item) => item.courseName === value
    );

    setCourseData((prevState) => ({
      ...prevState,
      courseID: courseSelectedFromDropdown[0].courseId,
      courseName: value,
      level: courseSelectedFromDropdown[0].level,
    }));
  };

  const handleButtonClick = () => {
    setCourseData((prevState) => ({
      ...prevState,
      courseName: " ",
    }));
    setShowCourseDiv(true);
    setSelectDisabled(true);
    setViewAddCourseButton(false);
  };

  const handleAddTopics = () => {
    if (courseData.courseID || courseData.courseName) {
      if (selectDisabled) {
        if (courseData.courseName && courseData.level && courseData.courseDuration) {
          axios
            .post(`${import.meta.env.VITE_API_URL}/course`, courseData, {
              headers: {
                ...myHeaders,
                Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              console.log("Course data posted successfully:", response.data);

              setAlertOpen(false);
              setSuccessAlert(true);

              const newCourseId = response.data.courseId;

              setTimeout(() => {
                navigate("/topics", { state: { courseId: newCourseId, courseDuration: courseData.courseDuration } });
              }, 1200);
            })
            .catch((error) => {
              console.error("Error posting course data:", error);
              setCustomErrorMessage(error.message);
            });
        } else {
          setAlertOpen(true);
          setTimeout(() => {
            setAlertOpen(false);
          }, 3000);
        }
      } else {
        setSuccessAlert(true);
        setTimeout(() => {
          navigate("/topics", { state: { courseId: courseData.courseID } });
        }, 2000);
      }
    } else {
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center ">
      {successAlert && (
        <Alert color="green" className="absolute top-1 right-2 animate-fadeOut w-1/4">
          Courses Added Successfully
        </Alert>
      )}
      {customErrorMessage && (
        <Alert color="red" className="absolute top-1 right-2 animate-fadeOut w-[28%]">
          <svg
            style={{ display: "inline", marginRight: "10px" }}
            fill="#ffffff"
            width="24px"
            height="34px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g id="SVGRepo_tracerCarrier"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm1-3H11V16h2Zm0-4H11V6h2Z"></path>
            </g>
          </svg>
          {customErrorMessage}
        </Alert>
      )}
      {AlertOpen && (
        <Alert color="red" className="absolute top-1 right-2 animate-fadeOut w-1/4">
          Please fill all the Fields.
        </Alert>
      )}
      <Card className="w-full md:w-3/4 lg:w-2/4 xl:w-2/4 mx-auto h-auto">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
          style={{ background: "#023047" }}
        >
          <Typography variant="h5" color="white" className="mb-2">
            Add Course
          </Typography>
        </CardHeader>
        <CardBody>
          <form className="container p-6 bg-white rounded-lg">
            <div
              className="mb-4"
              style={{ display: selectDisabled ? "none" : " block" }}
            >
              <Input
                variant="outlined"
                label="Select Course"
                placeholder="Search Course"
                value={searchCourse}
                onChange={handleSearch}
                onClick={handleInputClick}
                // onBlur={handleSearchBlur}
              />
              {showCourseList && (
                <div
                  className="mt-2 pt-3 pl-3 absolute top-[-50px] w-[600px] border border-gray-300 bg-white rounded-xl hover:bg-violet-600 h-1/2 overflow-x-scroll"
                  style={{ overflowX: "hidden" }}
                >
                  {searchCourse
                    ? courseItem
                        .filter((item) =>
                          item.courseName
                            .toLowerCase()
                            .includes(searchCourse.toLowerCase())
                        )
                        .map((filteredItem) => (
                          <div
                            key={filteredItem.courseID}
                            onClick={() => {
                              handleCourseItemChange(filteredItem.courseName);
                              setShowCourseList(false);
                            }}
                            className=" text-sm cursor-pointer  pb-2 pl-2 hover:bg-gray-400 text-gray-600 hover:text-black rounded-md "
                          >
                            {filteredItem.courseName}
                          </div>
                        ))
                    : courseItem.map((item) => (
                        <div
                          key={item.courseID}
                          onClick={() => {
                            handleCourseItemChange(item.courseName);
                            setShowCourseList(false);
                          }}
                          className="text-sm cursor-pointer pb-2 pl-2 hover:bg-gray-300 text-gray-600 hover:text-black rounded-md "
                        >
                          {item.courseName}
                        </div>
                      ))}
                </div>
              )}
            </div>

            {showCourseDiv && (
              <div>
                <div className="mb-4">
                  <Input
                    id="courseName"
                    name="courseName"
                    variant="outlined"
                    label="Course Name"
                    value={courseData.courseName}
                    onChange={handleChange}
                  />
                  <Typography>Ex:Python </Typography>
                  <Typography>Start with a capital letter</Typography>
                </div>
                <div className="mb-4">
                  <Select
                    variant="outlined"
                    label="Select Level"
                    onChange={handleChangeLevel}
                  >
                    <Option value="basic">Basic</Option>
                    <Option
                     value="intermediate"
                     >
                       Intermediate
                     </Option>
                     <Option value="advance">Advance</Option>
                   </Select>
                 </div>
   
                 <div className="mb-4">
                   <Input
                     id="courseDuration"
                     name="courseDuration"
                     variant="outlined"
                     label="Course Duration in Days"
                     value={courseData.courseDuration}
                     onChange={handleChange}
                   />
                   <Typography className="mt-5">Enter the number of working days in which the course can be completed</Typography>
                   <Typography>Do not enter in decimal value Ex:1.5</Typography>
                 </div>
               </div>
               )}
   
               {viewAddCourseButton && (
                 <div className="mb-4 flex justify-end">
                   <Button
                     ripple={true}
                     onClick={handleButtonClick}
                     className="bg-[#023047] text-white"
                   >
                     Add New Course
                   </Button>
                 </div>
               )}
   
               <div className="mb-4 flex justify-end">
                 <Button
                   ripple={true}
                   onClick={handleAddTopics}
                   className="bg-[#023047] text-white"
                 >
                   Add Topics
                 </Button>
               </div>
             </form>
           </CardBody>
         </Card>
       </div>
     );
   }
