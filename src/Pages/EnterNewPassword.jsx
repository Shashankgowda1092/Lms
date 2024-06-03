import React, { useEffect, useRef, useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../Api/services/AuthService";
import LoadingBar from "react-top-loading-bar";
import logo from "../Assets/logo.svg";

export function EnterNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const refLoading = useRef();
  const navigate = useNavigate();
  let params;
  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value;
    setNewPassword(newPasswordValue);
 
    // Regular expressions for password criteria
    const hasNumber = /\d/.test(newPasswordValue);
    const hasUppercase = /[A-Z]/.test(newPasswordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPasswordValue);
 
    // Check if the password meets all criteria
    const isValidPassword =
      newPasswordValue.length >= 8 &&
      hasNumber &&
      hasUppercase &&
      hasSpecialChar;
 
    // Update passwords match state
    setPasswordsMatch(confirmPassword === newPasswordValue);
 
    // Set requirements message
    setRequirementsMessage(
      isValidPassword
        ? ""
        : "Password requirements: Minimum 8 characters, at least one number, one uppercase letter, and one special character."
    );
    console.log("New Password:", newPasswordValue);
  };
 
  const handleConfirmPasswordChange = (event) => {
    const confirmPasswordValue = event.target.value;
    setConfirmPassword(confirmPasswordValue);
    setPasswordsMatch(confirmPasswordValue === newPassword);
    console.log("Confirm Password:", confirmPasswordValue);
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();
    refLoading.current.continuousStart();
    AuthService.resetPasswordWithToken(token, confirmPassword, setMessage)
      .then((data) => {
        refLoading.current.complete();
        console.log("inside resetPass", data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  const [requirementsMessage, setRequirementsMessage] = useState("");
 
  useEffect(() => {
    const getParamsAndDecodeToken = async () => {
      // Parse token from URL parameters
      const tokenFromUrl = new URLSearchParams(window.location.search).get(
        "token"
      );
      setToken(tokenFromUrl);
 
      // Decode token and set email
      const decodedToken = await AuthService.decodeToken(tokenFromUrl);
      console.log(decodedToken);
      setEmail(decodedToken?.sub);
    };
 
    // Call the async function
    getParamsAndDecodeToken();
  }, []);
 
  return (
    <>
      <>
        <LoadingBar color="#4caf50" ref={refLoading} />
      </>
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
        <form className="w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Mail ID
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              disabled
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              New Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={newPassword}
              onChange={handleNewPasswordChange}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {requirementsMessage && (
              <Typography color="blue-gray" className="text-sm">
                {requirementsMessage}
              </Typography>
            )}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Confirm Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {!passwordsMatch && (
              <Typography color="red">Passwords do not match</Typography>
            )}
          </div>
          {/* <Link to="/"> */}
          <Button
            className="bg-[#219EBC] hover:bg-[#8ECAE6] text-black font-bold py-2 px-4 rounded"
            fullWidth
            disabled={!passwordsMatch}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          {/* </Link> */}
        </form>
      </Card>
    </>
  );
}
 
export default EnterNewPassword;