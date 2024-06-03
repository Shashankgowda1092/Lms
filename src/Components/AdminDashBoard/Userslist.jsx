import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { myHeaders } from "../../Services/IpAddress";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [trainerData, setTrainerData] = useState([]);
  const [trainerChecked, setTrainerChecked] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GOWSIC}/user/all`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GOWSIC}/user/role/trainer`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );
      setTrainerData(response.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTrainers();
  }, []);

  const handleCheckboxChange = (role, index) => {
    return (event) => {
      if (role === "trainer") {
        setTrainerChecked(true);
        setUserChecked(false);

        setSelectedUsers([users[index].employeeId]);
      } else if (role === "user") {
        setUserChecked(true);
        setTrainerChecked(false);

        setSelectedUsers([users[index].employeeId]);
      }
    };
  };

  const handleSubmit = async () => {
    if (trainerChecked) {
      await axios
        .put(
          `${import.meta.env.VITE_API_GOWSIC}/user/updateRoleToTrainer`,
          selectedUsers,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
            },
          }
        )

        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          window.location.reload();
        });
    }

    if (userChecked) {
      await axios
        .put(
          `${import.meta.env.VITE_API_GOWSIC}/user/updateRoleToUser`,

          selectedUsers,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          window.location.reload();
        });
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8" style={{ userSelect: "none" }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">User List</h1>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or email"
            className="px-3 py-2 pl-10 border border-gray-300 rounded"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                Employee ID
              </th>
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                First Name
              </th>
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                Last Name
              </th>
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                Email
              </th>
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                Business Unit
              </th>
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                Role
              </th>
              <th className="border bg-[#023047] border-gray-700 px-3 py-2">
                Update Role
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="bg-gray-200">
                <td className="border border-gray-700 px-4 py-2">
                  {user.employeeId}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {user.firstName}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {user.lastName}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {user.businessUnit}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {user.role}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange("trainer", index)}
                    />
                    <span className="ml-2">Trainer</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange("user", index)}
                    />
                    <span className="ml-2">User</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSubmit}
        disabled={selectedUsers.length === 0}
        className="bg-[#023047] border-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Submit
      </button>
    </div>
  );
};

export default UserListPage;
