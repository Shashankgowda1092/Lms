import React, { useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import not_found from "../Assets/not_found.png";
import AuthService from "../Api/services/AuthService";

const Missing = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    AuthService.getAuthSession(setAuth);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center">
          <img src={not_found} alt="not_found" className="w-1/6 pb-5" />
        </div>
        <h1 className="text-2xl">
          URL not found. Please redirect to the Login Page or Dashboard.
        </h1>
      </div>
      {JSON.stringify("hello", auth.role)}
      <div className="text-center mb-8">
        <div className="flex flex-col justify-between">
          <Link to="/login">
            <Button className="p-4 mr-4">{"Login Page"}</Button>
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
            <Button className="p-4 ml-4 ">
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

export default Missing;
