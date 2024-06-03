import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import logo from "../Assets/logo.svg";
 
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Alert,
} from "@material-tailwind/react";
import LoadingBar from "react-top-loading-bar";
 
import AuthService from "../Api/services/AuthService";
 
const USERNAME_REGEX = /^[A-z][A-z0-9-_ ]{2,22}$/;
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PASSWORD_REGEX = /.*/;
 
const Login = () => {
  const { auth, setAuth } = useAuth();
 
  const navigate = useNavigate();
  const location = useLocation();
 
  // const from = location.state?.from?.pathname || "/";
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 
  const [message, setMessage] = useState("");
 
  const [isUsernameValid, setUsernameValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
 
  const [from, setFrom] = useState("/");
 
  const refLoading = useRef();
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [isloginPasswordValid, setIsloginPasswordValid] = useState(false);
  const [isloginEmailValid, setloginEmailValid] = useState(false);
  const [loginemailErrorMessage, setloginEmailErrorMessage] = useState(""); // Changed to an empty string
 
  useEffect(() => {
    if (
      loginPassword.trim() !== "" &&
      loginPassword.trim() !== "correctpassword"
    ) {
      // Change "correctpassword" to the actual correct password
      setLoginPasswordError("Incorrect password");
    } else {
      setLoginPasswordError(""); // Clear error if password is empty or correct
    }
  }, [loginPassword]);
 
  useEffect(() => {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@thbs\.com$/;
 
    const isloginValidEmail = EMAIL_REGEX.test(loginEmail); // Removed unnecessary condition
 
    setloginEmailValid(isloginValidEmail);
 
    if (loginEmail.trim() !== "" && !isloginValidEmail) {
      // Only set error message if email is not empty and not valid
      setloginEmailErrorMessage("Email should be in the format name@thbs.com");
    } else {
      setloginEmailErrorMessage(""); // Clear error message if email is valid or empty
    }
  }, [loginEmail]);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setAuth({});
    setFrom(location.state?.from?.pathname || "/");
    if (location.state?.from?.pathname) {
      console.log("auth in approute", auth);
      setMessage(
        `Logging in will redirect you to <br /> www.THBS-LMS.com${location.state.from.pathname}`
      );
    }
  }, [location]);
 
  // useEffect(() => {
  //   // console.log("authseriv", AuthService.getAuthSession(setAuth));
  //   // setAuth(AuthService.getAuthSession());
  //   const setAuthSess = async () => {
  //     // const sessionData = ;
  //     console.log("auth in login", auth);
  //     // navigate();
  //     if (await AuthService.getAuthSession(setAuth)) {
  //       if (location.state?.from?.pathname) {
  //         navigate(location.state?.from?.pathname);
  //       }
  //     }
  //   };
  //   setAuthSess();
  // }, []);
 
  useEffect(() => {
    // const [loggedIn,setLoggedIn] = useState('')
 
    setUsernameValid(USERNAME_REGEX.test(username));
  }, [username]);
 
  useEffect(() => {
    setPasswordValid(PASSWORD_REGEX.test(password));
  }, [password]);
 
  // useEffect(() => {
  //   if (isFormValid) {
  //     auth?.roles?.length > 1
  //       ? navigate("/roleSelect")
  //       : auth?.roles?.includes("ROLE_ADMIN")
  //       ? navigate("/dashboard/admin")
  //       : auth?.roles?.includes("ROLE_TRAINER")
  //       ? navigate("/dashboard/trainer")
  //       : auth?.roles?.includes("ROLE_TRAINEE")
  //       ? navigate("/dashboard/trainee")
  //       : navigate(from, { replace: true });
  //   }
  // }, [auth]);
 
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
 
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
 
  // const handleLoadSomething = () => {
  //   refLoading.current.continuousStart();
  //   console.log("bar started")
  //   setTimeout(() => {
  //     console.err("...loading something");
  //     refLoading.current.complete();
  //   }, 2000);
  // };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    refLoading.current.continuousStart();
    AuthService.login(loginEmail, loginPassword, setAuth, setMessage)
      .then((role) => {
        refLoading.current.complete();
        // Redirect to previous location or default dashboard based on user role
        if (from.length > 1) {
          navigate(from);
        } else {
          // Default dashboard based on user role
          if (role === "ADMIN") {
            navigate("/dashboard/admin");
          } else if (role == "TRAINER") {
            navigate("/dashboard/trainer");
          } else if (role === "USER") {
            console.log("yello");
            navigate("/dashboard/trainee");
          }
        }
      })
      .catch((error) => {
        // Handle login error
      });
  };
 
  const isFormValid = isUsernameValid && isPasswordValid;
 
  return (
    <div
      className="flex items-center justify-center flex-col"
      style={{ userSelect: "none" }}
    >
      <div className="z-10 h-[100px] bg-white flex flex-col justify-center items-center absolute left-1 w-[150px] top-3">
      <img
            src={logo}
            alt="logo"
            className=" z-10 h-16 w-18 absolute top-4 left-4"
          />
      </div>
      {message ? (
        <Alert
          className={`w-96 h-26 text-sm m-5 p-5`}
          variant="gradient"
          open={open}
          onClose={() => {
            setMessage("");
            setFrom("");
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
        <></>
      )}
      <LoadingBar color="#4caf50" ref={refLoading} />
      <div
        className="flex justify-center items-center mt-2"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="w-96 ">
          <CardHeader
            variant="gradient"
            // color="gray"
            className="mb-8  h-28 flex justify-center items-center py-8 bg-[#023047]"
          >
            <Typography variant="h3" color="white" className="text-center">
              Learning Management System
            </Typography>
          </CardHeader>
          {/* <CardHeader
            variant="gradient"
            color="gray"
            className="mb-8 h-20 flex justify-center items-center py-8"
          >
           
          </CardHeader> */}
          <CardBody className=" pl-3 pr-3 h-1/2">
            <div className=" flex flex-col gap-4">
              <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
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
                    placeholder="name@mail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="!border-t"
                    error={loginemailErrorMessage ? true : undefined}
                    style={{ maxHeight: "2rem" }}
                  />
                  {loginemailErrorMessage && (
                    <p className="text-red-500">{loginemailErrorMessage}</p>
                  )}
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="!border-t"
                    // error={loginPasswordError ? true : undefined}
                  />
                  {/* {loginPasswordError && loginPassword.length > 0 && (
                  <p className="text-red-500">{loginPasswordError}</p>
                )} */}
                </div>
                <div className="flex items-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mr-2"
                  >
                    <a href="/forgot-password">Forgot Password?</a>
                  </Typography>
                </div>
                <Button
                  size="lg"
                  type="submit"
                  className="bg-[#219EBC] hover:bg-[#8ECAE6] text-black font-bold py-2 px-4 rounded"
                >
                  Log in
                </Button>
              </form>
            </div>
          </CardBody>
        </Card>
        {/* <AuthVerify logOut={AuthService.logout} /> */}
        {/* <AuthService/> */}
      </div>
    </div>
  );
};
 
export default Login;