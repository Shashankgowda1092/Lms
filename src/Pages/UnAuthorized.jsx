import React from "react";
import useAuth from "../Hooks/useAuth";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import warning from "../Assets/warning.png";

const UnAuthorized = () => {
  const { auth } = useAuth();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center">
          <img src={warning} alt="warning" className="w-1/4 pb-3" />
        </div>
        <h1 className="text-4xl">
          This page is not authorized for
          {auth.role === "ADMIN"
            ? " Admin"
            : auth.role === "TRAINER"
            ? " Trainer"
            : " Trainee"}
        </h1>
      </div>

      <div className="text-center mb-8 flex-col ">
        <Typography className="text-2xl pb-5">
          {"Were you looking for? "}
          {""}
        </Typography>
        <div className="flex justify-between">
          <Link to="/login">
            <Button className="p-4">{" Login Page"}</Button>
          </Link>
          <Link
            to={`/dashboard/${
              auth.role === "ADMIN"
                ? "admin"
                : auth.role === "TRAINER"
                ? "trainer"
                : "trainee"
            }`}
          >
            <Button className="p-4">
              {auth.role === "ADMIN"
                ? "Admin"
                : auth.role === "TRAINER"
                ? "Trainer"
                : "Trainee"}
              {" Dashboard"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;
