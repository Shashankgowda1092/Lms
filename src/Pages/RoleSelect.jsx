import { Button } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";

const RoleSelect = () => {
  return (
    <div>
      <h1 className="text-4xl">Role Select page</h1>
      <div className=" flex justify-center items-center w-full h-screen">
        
        <Link to="/dashboard/admin">
          <Button>admin dash</Button>
        </Link>
        <Link to="/dashboard/trainee">
          <Button>trainee dash</Button>
        </Link>
        <Link to="/dashboard/trainer">
          <Button>trainer dash</Button>
        </Link>
      </div>
    </div>
  );
};

export default RoleSelect;
