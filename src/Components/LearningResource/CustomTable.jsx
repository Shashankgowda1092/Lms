import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { myHeaders } from "../../Services/IpAddress";

 
 
const TABLE_HEAD = ["Batch Name", "Course Name", "Topic Name", "Resources", "Actions"];
 
export function CustomTable({ searchQuery }) {
  const [tableRows, setTableRows] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
 
  useEffect(() => {
    fetchData();
  }, [tableRows, isDeleting]);
 
  const fetchData = async () => {
    try {
      // Fetch batch names
      const batchNamesResponse = await axios.get(
          `${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/name/id`,
          {
              headers: {
                  ...myHeaders,
                  Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
              },
          }
      );
      const batchNamesMap = {};
      batchNamesResponse.data.forEach((batch) => {
          batchNamesMap[batch.batchId] = batch.batchName;
      });
  
      // Fetch course names and topics
      const coursesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/course/dto`,
          {
              headers: {
                  ...myHeaders,
                  Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
              },
          }
      );
      const courseMap = {};
      const topicMap = {};
      coursesResponse.data.forEach((course) => {
          courseMap[course.courseId] = course.courseName;
          course.topics.forEach((topic) => {
              topicMap[topic.topicId] = topic.topicName;
          });
      });
  
      // Fetch resource data
      const resourceResponse = await axios.get(
          `${import.meta.env.VITE_PROGRESS_SERVICE_URL}/resource/resources`,
          {
              headers: {
                  ...myHeaders,
                  Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
              },
          }
      );
      const updatedTableRows = resourceResponse.data.map((row) => ({
          ...row,
          batchName: batchNamesMap[row.batchId] || 'Unknown Batch',
          courseName: courseMap[row.courseId] || 'Unknown Course',
          topicName: topicMap[row.topicId] || 'Unknown Topic',
      }));
  
      setTableRows(updatedTableRows);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
};
 
 
 
const handleDelete = async (resourceId, batchId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this row?");
  if (confirmDelete) {
    setIsDeleting(true); // Set loading to true

    try {
      await axios.delete(`${import.meta.env.VITE_PROGRESS_SERVICE_URL}/resource/${resourceId}/batch/${batchId}`, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      });
      // Remove the deleted row from the table
      setTableRows(tableRows.filter(row => !(row.resourceId === resourceId && row.batchId === batchId)));
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setIsDeleting(false); // Set loading to false
    }
  }
};

 
  return (
    <Card className="h-full w-full bg-blue-gray overflow-scroll relative">
      {isDeleting && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <Typography variant="medium" color="blue-gray" className="font-bold text-white">
            Deleting...
          </Typography>
        </div>
      )}
      <div></div>
      <table className="w-full min-w-max table-auto text-left ">
        <thead >
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th key={index} className="border-b border-gray-100  p-4">
                <Typography  className="font-bold leading-none  opacity-100">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.filter((row, rowIndex) => { return searchQuery.toLowerCase() === "" ? row : row.batchName.toLowerCase().includes(searchQuery.toLowerCase()) || row.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || row.topicName.toLowerCase().includes(searchQuery.toLowerCase()) }).map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? "bg-blue-gray-100" : ""}>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {row.batchName}
                </Typography>
              </td>
              <td className="p-4 border-b  border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {row.courseName}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {row.topicName}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-normal  whitespace-normal">
                  <ul>
                    {row.filetype === "pdf" && (
                      <li>
                        <a href={row.source} target="_blank" rel="noopener noreferrer">
                          {row.fileName}
                        </a>
                      </li>
                    )}
                    {row.filetype === "ppt" && (
                      <li>
                        <a href={row.source} target="_blank" rel="noopener noreferrer">
                          {row.fileName}
                        </a>
                      </li>
                    )}
                    {row.filetype === "pptx" && (
                      <li>
                        <a href={row.source} target="_blank" rel="noopener noreferrer">
                          {row.fileName}
                        </a>
                      </li>
                    )}
                    {row.filetype === "link" && (
                      <li>
                        <a href={row.source} target="_blank" rel="noopener noreferrer" className="truncate">
                          {row.source.length > 30 ? `${row.source.slice(0, 30)}...` : row.source}
                        </a>
                      </li>
                    )}
                  </ul>
                </Typography>
              </td>
 
              <td className="p-4 border-b border-blue-gray-50">
                <div className="bg-blue-60 rounded-md p-1 inline-flex justify-center items-center w-12 h-10" onClick={() => handleDelete(row.resourceId, row.batchId)}>
                  <button className="text-black">
                    <MdDelete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}