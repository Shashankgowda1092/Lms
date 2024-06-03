import React, { useEffect, useRef, useState } from "react";
import { Typography, Input, Select, Button } from "@material-tailwind/react";
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  TabPanel,
  TabsBody,
  TabsHeader,
  Alert,
  Option,
} from "@material-tailwind/react";
import LoadingBar from "react-top-loading-bar";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../Api/services/AuthService";
import logo from "../Assets/logo.svg";

const SignupForm = () => {
  const navigate = useNavigate();
  const [type, setType] = React.useState("signup"); // 'signup' or 'login'
  const [message, setMessage] = useState("");
  const businessUnits = [
    { id: 1, name: "NBU Capability Building" },
    { id: 2, name: "NBU - Compliance, Quality and operations" },
    // { id: 3, name: " NBU - Compliance, Quality and operations" },
    { id: 3, name: " NBU - COE" },
    { id: 4, name: "NBU - Career Ladder" },
    { id: 5, name: "BU02-Telco 1" },
    { id: 6, name: "BU02-Telco 2" },
    { id: 7, name: "BU02-Telco 3" },
    { id: 8, name: "BU02-Data & MDM" },
    { id: 9, name: "BU02-IMEA & Non Telco + Sales" },
    { id: 10, name: "NBU - Sales & Mktg" },
    { id: 11, name: "NBU - Internal Applications & Project Operations" },
    { id: 12, name: "NBU - Coporate - Sales" },
    { id: 13, name: "NBU Finance" },
    { id: 14, name: "NBU - HR" },
    { id: 15, name: "NBU - Management" },
    { id: 16, name: "NBU - UK Admin" },
    { id: 17, name: "Product Sales" },
  ];
 
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
 
  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
 
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
 
  const [employeeId, setEmployeeId] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [businessUnit, setBusinessUnit] = React.useState("");
 
  const [passwordError, setPasswordError] = useState("");
 
  const [isPasswordValid, setIsPasswordValid] = useState(false);
 
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
 
  const refLoading = useRef();
 
  useEffect(() => {
    password.length > 1 && setIsPasswordValid(!PASSWORD_REGEX.test(password));
 
    isPasswordValid
      ? setPasswordError(
          "password must containe Uppercase,Numerical value, Special Character and it must be 8 characters long"
        )
      : setPasswordError("");
  }, [password, confirmPassword]);
 
  useEffect(() => {
    setIsConfirmPasswordValid(password === confirmPassword);
  }, [confirmPassword]);
 
  const [isEmailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
 
  useEffect(() => {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@thbs\.com$/;
 
    const initialValidEmail = EMAIL_REGEX.test(signupEmail);
 
    const isValidEmail = initialValidEmail && signupEmail !== "";
 
    setEmailValid(isValidEmail);
 
    if (signupEmail !== "") {
      setEmailErrorMessage(isValidEmail ? "" : "Email should be @thbs.com");
    } else {
      setEmailErrorMessage("");
    }
  }, [signupEmail]);
 
  useEffect(() => {
    console.log("business units", businessUnit);
  }, [businessUnit]);
 
  useEffect(() => {
    const regex = /^[0-9]*$/;
 
    if (employeeId !== "") {
      const isValidId = regex.test(employeeId);
 
      if (!isValidId) {
        setErrorMessage("Employee ID must be numeric.");
      } else if (employeeId.length < 4) {
        setErrorMessage("Employee ID must have a minimum length of 4 digits.");
      } else if (employeeId.length > 5) {
        setErrorMessage("Employee ID must have a maximum length of 5 digits.");
      } else {
        setErrorMessage("");
      }
    }
  }, [employeeId]);
 
  const handleSubmit = (event) => {
    event.preventDefault();
    refLoading.current.continuousStart();
 
    AuthService.register(
      employeeId,
      firstName,
      lastName,
      signupEmail,
      confirmPassword,
      businessUnit,
      setMessage
    )
      .then((data) => {
        console.log(data);
 
        // setSuccess(true)
        // Redirect to login page after successful registration
        refLoading.current.complete();
 
        navigate("/login");
      })
      .catch((error) => {
        console.error(error.response.data.message);
        // setSuccess(false)
        // const resMessage =
        //   (error.response &&
        //     error.response.data &&
        //     error.response.data.message) ||
        //   error.message ||
        //   error.toString();
        // setMessage(resMessage);
      });
 
    console.log("inside handle Submit");
    if (
      employeeId &&
      firstName &&
      lastName &&
      password &&
      confirmPassword &&
      businessUnit
    ) {
      setShowVerificationAlert(true);
    }
    if (type === "signup" && isEmailValid) {
      setType("login");
      setShowVerificationAlert(true);
    } else if (type === "login") {
      console.log("Login form submitted");
    }
  };
 
  return (
    // <div className="flex items-center justify-center relative w-1/4 h-full">
    //   <Card className="w-full h-full">
    <div className="flex items-center justify-center flex-col">
      <img
            src={logo}
            alt="logo"
            className=" z-10 h-16 w-18 absolute top-4 left-4"
          />
      {message ? (
        <Alert
          className={` w-96 h-26 text-sm m-3 p-3`}
          variant="gradient"
          open={open}
          onClose={() => {
            setMessage("");
            // setFrom("");
          }}
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
        >
          <Typography colors="white">
            <div dangerouslySetInnerHTML={{ __html: message }} />
          </Typography>
        </Alert>
      ) : (
        //GREENCOLOR
        <div className={` w-96 h-26 text-sm m-5 p-5`}></div>
      )}
      <>
        <LoadingBar color="#4caf50" ref={refLoading} />
      </>
      <Card className="w-full max-w-md">
        <CardHeader
          // color="gray"
          floated={false}
          shadow={false}
          className="m-0 h-5 flex justify-center items-center py-8 bg-[#023047]"
        >
          <Typography variant="h5" color="white">
            Learning Management System
          </Typography>
        </CardHeader>
        <CardBody className=" p-0 pt-3 pd-0 pl-3 pr-3 h-full">
          <Tabs
            value={type}
            className="flex flex-col h-full overflow-visible gap-3"
          >
            {/* <TabsHeader className=" z-0 flex-none ">
              <Tab value="signup" onClick={() => setType("signup")}>
                Sign up
              </Tab>
              <Tab value="login" onClick={() => setType("login")}>
                Log in
              </Tab>
            </TabsHeader> */}
            <TabsBody
              className="!overflow-y-visible flex-1 "
              animate={{
                initial: {
                  x: type === "signup" ? 400 : -400,
                },
                mount: {
                  x: 0,
                },
                unmount: {
                  x: type === "signup" ? 400 : -400,
                },
              }}
            >
              <TabPanel value="signup" className="p-0 h-full">
                <form
                  className="mt-13 flex flex-col gap-1 h-full"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      Employee ID
                    </Typography>
                    <Input
                      required
                      maxLength={5}
                      type="text"
                      placeholder="Employee ID"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className={`!border-t ${
                        errorMessage.length > 1
                          ? "border-red-500 ring-2 ring-red-500 outline-none"
                          : "border-blue-gray-200"
                      }`}
                    />
                    <Typography variant="small" color="red" className="mt-1">
                      {errorMessage ? (
                        <p className="text-xs">{errorMessage}</p>
                      ) : (
                        ""
                      )}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      First Name
                    </Typography>
                    <Input
                      required
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="!border-t-"
                    />
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      Last Name
                    </Typography>
                    <Input
                      required
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="!border-t "
                    />
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      Email
                    </Typography>
                    <Input
                      required
                      type="email"
                      placeholder="name@thbs.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={`!border-t${
                        emailErrorMessage
                          ? "border-red-500 ring-2 ring-red-500 outline-none"
                          : "border-blue-gray-200"
                      }`}
                    />
                    <Typography variant="small" color="red" className="mt-1">
                      {emailErrorMessage ? (
                        <p className="text-xs">{emailErrorMessage}</p>
                      ) : (
                        <></>
                      )}
                    </Typography>
                    <p class="text-gray-900 text-sm">
                      Verification mail will be sent to your mail please verify
                    </p>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      Password
                    </Typography>
                    <Input
                      required
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={isPasswordValid ? true : undefined}
                    />
                    {passwordError ? (
                      <p className="text-xs">{passwordError}</p>
                    ) : (
                      <></>
                    )}
                  </div>
 
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      Confirm Password
                    </Typography>
 
                    <Input
                      required
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={isConfirmPasswordValid ? undefined : true}
                    />
                    {isConfirmPasswordValid ? null : (
                      <p className="text-xs">Password not matching</p>
                    )}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 font-medium"
                    >
                      Business Unit
                    </Typography>
 
                    <Select onChange={(e) => setBusinessUnit(e)}>
                      {businessUnits.map((unit) => (
                        <Option key={unit.id} value={unit.name}>
                          {unit.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex justify-center">
                    {/* <Link
                      to={
                        isEmailValid && isConfirmPasswordValid && !businessUnit
                          ? "/login"
                          : null
                      }
                    > */}
                    {/* <Button
                      size="lg"
                      type="submit"
                      bg-[#FFB703]
                      disabled={
                        !(
                          isEmailValid &&
                          isConfirmPasswordValid &&
                          businessUnit
                        )
                      }
                    >
                      Sign up
                    </Button> */}
                    <Button
                      size="lg"
                      type="submit"
                      disabled={
                        !isEmailValid ||
                        !isConfirmPasswordValid ||
                        !businessUnit
                      }
                      className="bg-[#219EBC] hover:bg-[#8ECAE6] text-black font-bold py-2 px-4 rounded"
                    >
                      Sign up
                    </Button>
                    {/* </Link> */}
                  </div>
                </form>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
      {/* <Alert
        className="!absolute top-0 right-0"
        open={showVerificationAlert}
        onClose={() => setShowVerificationAlert(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {message}
      </Alert> */}
    </div>
  );
};
 
export default SignupForm;