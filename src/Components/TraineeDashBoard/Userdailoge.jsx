import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import axios from "../../Api/axios";
import { myHeaders } from "../../Services/IpAddress";

const Userdailoge = ({ setIsUserDialogOpen }) => {
  const [users, setUsers] = useState([]);
  const [employeeID, setEmployeeId] = useState("");
  const [batches, setBatches] = useState([]);
  const { auth } = useAuth();
  const [user, setUser] = useState("");

  function handleUserDialog() {
    setIsUserDialogOpen(false);
  }

  const fetchUserDetails = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_GOWSIC}/user/all`,{headers:{
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      }})
      .then((response) => {
      
        setUsers(response.data);
        fetchUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUser = () => {
    const foundUser = users.find((user) => user.firstName === auth.username);
    if (foundUser) {
      setEmployeeId(foundUser.employeeId);
      setUser(foundUser);
    } else {
      console.error("User not found");
    }
  };

  const userBatchList = () => {
    axios
      .get(`${import.meta.env.VITE_BATCH_SERVICE_URL}/batch/employee/batches/${employeeID}`,{headers:{
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      }})
      .then((response) => {
       
        setBatches(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(employeeID);
  console.log(typeof employeeID);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [users]);

  useEffect(() => {
    userBatchList();
  }, [user]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Username: {auth.username}</h2>
        <h2 className="text-xl font-bold mb-4">
          EmployeeId: {auth.empID}
        </h2>
        <p className="mb-4">
          Batches:
          {batches.length > 0 ? (
            batches.map((item, index) => <p key={index}>{item.batchName}</p>)
          ) : (
            <p>No Batches found</p>
          )}
        </p>

        <button
          onClick={handleUserDialog}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Userdailoge;
