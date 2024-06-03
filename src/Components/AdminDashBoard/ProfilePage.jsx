import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import useAuth from "../../Hooks/useAuth";
import axios from 'axios';
export function ProfilePage() {
  const { auth } = useAuth();
  
  const [users,setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_GOWSIC}/user/all`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(()=>{
    fetchUsers();
  },[])

  // const validatingUsers = () =>{
  //   users.map((user)=>{
  //     if(user.email === auth.email ){
  //       setEmployeeId(user.employeeId)
  //     }
  //   })
  // }

  console.log(users);

  return (
    <Card className="absolute top-0 right-0 max-w-md mx-auto mt-10 p-6 shadow-xl bg-[#023047] " style={{ userSelect: "none" }}>
      <div className="text-center" color="white">
        <img
          src="profile.jpg"
          alt="Profile"
          className="mx-auto rounded-full h-24 w-24 mb-4"
        />
        <Typography variant="h6" color="white">
          {auth.username}
        </Typography>
          <Typography variant="subtitle1" color="white">
          {users.map((item)=>{
            if(item.email === auth.email){
              return <p>EmployeeId:{item.employeeId}</p>
            }
          }
          
          )}
          </Typography>
         {/* <p><span className="font-semibold">Employee Id:</span> {employeeId ? employeeId :0}</p> */}
        <Typography variant="subtitle1" color="white">
         {auth.email}
        </Typography>
        
      </div>
    </Card>
  );
}

export default ProfilePage;
