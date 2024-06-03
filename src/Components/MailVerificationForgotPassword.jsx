import React, { useEffect, useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import AuthService from "../Api/services/AuthService";
import logo from "../Assets/logo.svg";

export function MailVerificationForgotPassword({ setEnterEmailVisible }) {
  const [isValid, setIsValid] = useState(false); // Initially set to true to avoid showing error message on empty field
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
 
  useEffect(() => {
    setIsValid(validateEmail(email));
  }, [email]);
 
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
 
    // if () {
    //   setIsValid(true); // Set isValid to true if the field is empty or the email format is correct
    // } else {
    //   setIsValid(false); // Set isValid to false if the email format is incorrect
    // }
    // console.log("Email:", inputValue);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("button pressed");
    if (isValid) {
      // Perform any action you want on form submission
      // refLoading.current.continuousStart();
      AuthService.sendForgotMail(email, setMessage)
        .then(() => {
          // setEnterEmailVisible(true);
          // refLoading.current.complete();
          // Redirect to previous location or default dashboard based on user role
        })
        .catch((error) => {
          console.log(error);
          // Handle login error
        });
      setEnterEmailVisible(true);
      console.log("Form submitted with email:", email);
      // Reset the email field after submission if needed
      setEmail("");
    }
  };
 
  const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@thbs.com$/;
    return regex.test(email);
  };
 
  useEffect(() => {
    // TODO get mail from jwt email
  }, []);
 
  return (
    <>
    <img
    src={logo}
    alt="logo"
    className=" z-10 h-16 w-18 absolute top-4 left-4"
  />
    <Card
      color="transparent"
      shadow={false}
      className="flex justify-center items-center h-screen"
    >
      <Typography variant="h4" color="blue-gray">
        Forgot Password?
      </Typography>
      <Typography color="gray" className="mt-1 font-normal mb-4 text-center">
        Enter your Email ID for verification.
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      >
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className={`!border-t-blue-gray-200 ${
              isValid
                ? "focus:!border-t-gray-900"
                : "border-red-500 focus:!border-red-500"
            }`}
            value={email}
            onChange={handleChange}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          {!isValid &&
            email.trim() !== "" && ( // Display error message only if email is not empty and format is incorrect
              <Typography variant="small" color="red">
                Please enter a valid email address ending with @thbs.com.
              </Typography>
            )}
        </div>
        {/* <Link to="/forgot-password">
           
          <Button className="mt-6" fullWidth disabled={!isValid}>
            SUBMIT
          </Button>
        </Link> */}{" "}
        {/* If isValid is true, link to "/forgot-password", otherwise link to "#" */}
        <Button
          className="bg-[#219EBC] hover:bg-[#8ECAE6] text-black font-bold py-2 px-4 rounded"
          fullWidth
          disabled={!isValid}
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>
      </form>
    </Card>
    </>
  );
}
 
export default MailVerificationForgotPassword;