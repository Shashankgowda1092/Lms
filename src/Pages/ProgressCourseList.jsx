import { Card, CardBody, Typography, Input } from "@material-tailwind/react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import ProgressBar from "../Components/ProgressBar";
import { PROGRESS_HEAD } from "../Services/EmployeeData";
import { useState, useEffect } from "react";
import { fetchTrainees } from "../Services/BatchEmployee";
import { fetchBatchDetails } from "../Services/BatchDetailsData";
import { fetchBatchUserProgress } from "../Services/ProgressData";
import { myHeaders } from "../Services/IpAddress";
import axios from "axios";
import useAuth from "../Hooks/useAuth";
const ProgressCourseList = ({ courseID }) => {
  const [batch, setBatch] = useState(null);
  const [batchUsers, setBatchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  //  console.log(courseID,"idddddd")
  let users = batchUsers;
  const id = sessionStorage.getItem("id");
  //   const courseId = courseID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrainees(id);
        if (data) {
          setBatchUsers(data);
          setLoading(false);
          setError(null);
        } else {
          throw new Error("Failed to fetch trainees");
        }
      } catch (error) {
        setLoading(false);
        setError("Couldn't fetch batch user's");
        console.error("Error fetching trainees:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, [id]);

  const getCourseDetails = async () => {
    try {
      const response = axios.get(
        `http://172.18.5.20:8085/course/id/${courseID}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      console.log(response.data);
      setBatch(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://172.18.5.20:8085/course/id/${courseID}`,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        console.log(response, "gowsic");
        if (response.data) {
          console.log(response.data);
          setBatch(response.data);
        } else {
          throw new Error("Failed to fetch batch Name");
        }
      } catch (error) {
        console.error("Error fetching batch Name:", error);
      }
    };
    // getCourseDetails();
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("helo")
        const response = await axios.get(
          `http://172.18.5.20:8085/batch-progress/all-users/${id}/course/${courseID}`,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        if (response.data) {
          console.log(response.data);
          setUserProgress(response.data);
        } else {
          throw new Error("Failed to fetch batch Name");
        }
      } catch (error) {
        setError("Couldn't fetch batch user's progress");
        console.error("Error fetching batch Name:", error);
      }
    };

    fetchData();
  }, []);
  const progressHandler = (employeeId) => {
    const user = userProgress.find((user) => user.employeeId === employeeId);
    return user ? user.overallProgress : 0;
  };

  const handleSort = () => {};

  const searchHandler = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    users = batchUsers.filter(
      ({ firstName, lastName, employeeId, businessUnit }) =>
        firstName.toLowerCase().includes(query) ||
        lastName.toLowerCase().includes(query) ||
        employeeId.toString().includes(query) ||
        businessUnit.toLowerCase().includes(query)
    );
  }

  return (
    <div className="p-5">
      <Typography variant="h3">
        {batch?.courseName} Courses Users Progress
      </Typography>
      <div className="flex justify-end mb-5">
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <Input
          id="search-input"
          label="Search"
          icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          className="w-full"
          onChange={searchHandler}
        />
      </div>
      {loading ? (
        <div className="text-blue-600 text-center mt-4 text-lg font-semibold">
          Loading...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center mt-4 text-lg font-semibold">
          {error}
        </div>
      ) : (
        <Card>
          <CardBody>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {PROGRESS_HEAD.map((head, index) => (
                    <th
                      key={head}
                      onClick={() => handleSort(index)}
                      className="cursor-pointer p-4 text-left bg-gray-50 border-b border-gray-200"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}{" "}
                        {index === 5 && (
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (
                    { employeeId, firstName, lastName, businessUnit },
                    index
                  ) => (
                    <tr key={employeeId}>
                      <td className="p-4 border-b border-gray-200">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {employeeId}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {firstName}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {lastName}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {businessUnit}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <ProgressBar
                          progressValue={progressHandler(employeeId)}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ProgressCourseList;
