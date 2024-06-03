import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { myHeaders } from "../../Services/IpAddress";
const EmployeeList = ({
  setSearch,
  search,
  batchSelect,
  setOverall,
  overall,
  selectedRow,
  setSelectedRow,
}) => {
  const [loading, setLoading] = useState(true);
  const [empDetailsList, setEmpDetailsList] = useState([]);

  const [error, setError] = useState("");
  const { auth } = useAuth();

  const TABLE_HEAD = ["EmpID", "Name", "Emailid", "Business_Unit"];
  // console.log(auth);
  const handleRowClick = (empID) => {
    setSelectedRow(empID);
  };

  const getEmpList = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_GOWSIC
        }/batch/batch-id/employees/${batchSelect}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      setError("Select Batch");
      console.error(error);
    }
  };

  const getEmpDetails = async (empID) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GOWSIC}/user/${empID}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      setError("Cannot get employee details");
    }
  };
  const fetchData = async () => {
    try {
      const empList = await getEmpList();

      const empDetailsPromises = empList.map((id) => getEmpDetails(id));
      const empDetails = await Promise.all(empDetailsPromises);
      
        setEmpDetailsList(empDetails);
        console.log(empDetailsList);
        setLoading(false);
      
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
    setError("");
  }, [batchSelect]);
  return (
    <Card id="empList" className="bg-[#FFFFFF] h-[61vh] min-w-[50vw] ">
      <div className="flex flex-row items-center justify-between p-4 pl-7">
        <Typography variant="h5" className="text-black">
          Employee List
        </Typography>
        <div className="w-full md:w-72">
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            label="Search"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>
      </div>

      <CardBody className="overflow-y-auto scroll-smooth p-4  no-scrollbar">
        {!loading ? (
          <table className="w-full min-w-max table-auto text-left  ">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-[#023047] bg-[#494949] text-[#FFFFFF] p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-normal leading-none "
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="overflow-x-hidden ">
              {empDetailsList
                ?.filter(
                  (item) =>
                    item?.employeeId?.toString().includes(search) ||
                    item?.firstName
                      .toLowerCase()
                      .includes(search?.toLowerCase()) ||
                    item?.businessUnit
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    item?.email.toLowerCase().includes(search.toLowerCase())
                )
                .map(
                  ({ employeeId, firstName, email, businessUnit }, index) => (
                    <tr
                      key={employeeId}
                      className={
                        employeeId === selectedRow && !overall
                          ? "bg-[#023047] text-[#FFFFFF] cursor-pointer border-b border-[#023047]"
                          : index % 2 === 0
                          ? "bg-gray-50 border-b text-[#000000] border-[#023047]"
                          : "border-b border-[#023047] bg-[#FFFFFF] text-[#000000] cursor-pointer"
                      }
                      onClick={() => {
                        setOverall(false);
                        handleRowClick(employeeId);
                      }} // Call handleRowClick on row click
                    >
                      <td className="p-4">
                        <Typography variant="small" className="font-normal">
                          {employeeId}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" className="font-normal">
                          {firstName}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" className="font-normal">
                          {email}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" className="font-normal">
                          {businessUnit}
                        </Typography>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-evenly  items-center text-red-600">
            {error}
          </div>
        )}
      </CardBody>

      <CardFooter></CardFooter>
    </Card>
  );
};

export default EmployeeList;
