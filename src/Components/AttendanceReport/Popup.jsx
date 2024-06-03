import React, { useEffect, useState } from "react";
import axios from "axios";
import { myHeaders } from '../../Services/IpAddress';
function Popup({
  setSelectedCourse,
  onClose,
  batchSelect,
  setOverall,
  setEmpID,
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const getCourseList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GOWSIC}/batch-course/batch/${batchSelect}`,{
          headers:{...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          },
        }
      );
      setCourses(response.data.courses);
      setLoading(false);
      console.log(response.data.courses);
    } catch (error) {
      setLoading(true);
      console.error(error);
    }
  };

  const handleCourseSelection = ({ courseName, courseID }) => {
    setSelectedCourse({ courseName, courseID, batchID: batchSelect });
    setEmpID(null);
    setOverall(true);
    onClose(); // Close the popup when a course is selected
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#8ECAE6] bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg max-w-md overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Select a Course</h2>
        <ul className="divide-y divide-gray-300">
          {!loading &&
            courses.map(({ courseName, courseId }) => (
              <li
                key={courseId}
                className="py-2 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  handleCourseSelection({
                    courseName: courseName,
                    courseID: courseId,
                  })
                }
              >
                {courseName}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Popup;
