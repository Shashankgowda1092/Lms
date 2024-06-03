import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myHeaders } from '../../Services/IpAddress';
export function NewPlan() {
  const [planName, setPlanName] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const [courseItems, setCourseItems] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [openMenu, setOpenMenu] = useState(false);
  const [coursesToBeAdded, setCoursesToBeAdded] = useState([]);
  const [customErrorMessage, setCustomErrorMessage] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [AlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    fetchCourseItems();
  }, []);

  const fetchCourseItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/course`, {
        headers: {...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setCourseItems(response.data);
        } else {
          setCustomErrorMessage("The fetched data is not an array");
          setTimeout(() => {
            setCustomErrorMessage(false);
          }, 1200);
          console.error("The fetched data is not an array:", response.data);
        }
      } else {
        setCustomErrorMessage("Failed to fetch courses");
        setTimeout(() => {
          setCustomErrorMessage(false);
        }, 1500);
        console.error("Failed to fetch courses.");
      }
    } catch (error) {
      setCustomErrorMessage("Error occurred while fetching courses");
      setTimeout(() => {
        setCustomErrorMessage(false);
      }, 1500);
      console.error("Error occurred while fetching courses:", error);
    }
  };

  const handleChangeType = (value) => {
    setType(String(value));
  };

  const handleChangePlanName = (event) => {
    setPlanName(event.target.value);
  };

  const handleCourseItemClick = (value) => {
    if (selectedCourses.includes(value)) {
      setSelectedCourses(selectedCourses.filter((course) => course !== value));
    } else {
      setSelectedCourses([...selectedCourses, value]);
      setCoursesToBeAdded([
        ...coursesToBeAdded,
        courseItems.find((item) => item.courseName === value),
      ]);
    }
  };

  // console.log("selectedCourses", selectedCourses);
  // console.log("coursesToBeAdded", coursesToBeAdded);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      learningPlanId: 0,
      learningPlanName: planName,
      type: type,
      courses: coursesToBeAdded.map((course) => ({
        courseId: course.courseId,
        courseName: course.courseName,
        level: course.level,
      })),
    };

    if (type && planName && selectedCourses.length > 0) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/learning-plan`, formData, {
          headers: {...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setAlertOpen(false);
          setSuccessAlert(true);
          setTimeout(() => {
            setSuccessAlert(false);
            navigate("/dashboard/admin");
          }, 1200);

          console.log("Learning plan saved successfully:", response.data);
        })
        .catch((error) => {
          setCustomErrorMessage(error.message);
          setTimeout(() => {
            setCustomErrorMessage(false);
          }, 1200);
          console.error("Error saving learning plan:", error);
        });
    } else {
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 1200);
    }
  };


  // console.log(courseItems);

  return (
    <div className="h-screen w-full flex justify-center items-center" style={{userSelect:"none"}}>
      {successAlert && (
        <Alert
          color="green"
          className=" absolute top-1 right-2 animate-fadeOut w-1/4"
        >
          Courses Added Successfully
        </Alert>
      )}
      {AlertOpen && (
        <Alert
          color="red"
          className=" absolute top-1 right-2 animate-fadeOut w-1/4"
        >
          Please fill all the Fields.
        </Alert>
      )}
      {customErrorMessage && (
        <Alert
          color="red"
          className=" absolute top-1 right-2 animate-fadeOut w-[28%]"
        >
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
      <Card className="mt-6 w-full md:w-3/4 lg:w-2/4 xl:w-2/4 mx-auto">
        <CardHeader
          variant="gradient"
          className="bg-[#023047] mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h5" color="white" className="mb-2">
            Add Learning Plan
          </Typography>
        </CardHeader>
        <CardBody>
          <form
            className="container p-6 bg-white rounded-lg"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <Input
                label="Plan Name"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={planName}
                onChange={handleChangePlanName}
              />
            </div>
            <div className="mb-4">
              <Select
                variant="outlined"
                label="Type"
                id="Type"
                onChange={handleChangeType}
              >
                <Option value="bootcamp">BOOTCAMP</Option>
                <Option value="on_demand">ON-DEMAND</Option>
                <Option value="mandatory">MANDATORY</Option>
                <Option value="org_wide">ORG-WIDE</Option>
              </Select>
            </div>
            <div className="mb-4">
              <Menu
                dismiss={{
                  itemPress: false,
                }}
              >
                <MenuHandler>
                  <Button
                    variant="text"
                    className="flex items-center justify-between capitalize  text-sm font-normal rounded-md p-2  border  border-gray-400 w-full text-blue-gray-500 text-opacity-100"
                  >
                    {selectedCourses.length >= 1
                      ? selectedCourses.join(",") + "  "
                      : "Select Courses"}
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${
                        openMenu ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </MenuHandler>
                <MenuList className=" h-[300px] mt-3 w-[43%]">
                  {courseItems.map((course) => (
                    <MenuItem
                      className="p-1 mb-[-5px] "
                      key={course.courseId}
                      onClick={() => handleCourseItemClick(course.courseName)}
                    >
                      <label
                        htmlFor={course.courseName}
                        className="flex cursor-pointer items-center gap-2 p-2"
                      >
                        <Checkbox
                          ripple={false}
                          id={course.courseId}
                          containerProps={{ className: "p-0" }}
                          className="hover:before:content-none"
                          checked={selectedCourses.includes(course.courseName)}
                          // onChange={() =>
                          //   handleCourseItemClick(course.courseName)
                          // }
                        />
                        {course.courseName}
                      </label>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {selectedCourses.length > 0 ? (
                <p className="absolute text-sm text-black ml-1">
                  ({selectedCourses.length} Course
                  {selectedCourses.length > 1 ? "s" : ""} Selected)
                </p>
              ) : (
                ""
              )}
            </div>

            <div className=" mb-4 mt-[50px] flex justify-end">
              <Button className="bg-[#023047]" ripple={true} type="submit">
                Add Plan
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
