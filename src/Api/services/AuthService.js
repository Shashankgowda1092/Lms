import { useEffect, useNavigate } from "react";
import axios from "../axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
// import useAuth from "../../Hooks/useAuth";
// import axios from 'axios'
const register = async (
  employeeId,
  firstName,
  lastName,
  signupEmail,
  confirmPassword,
  businessUnit,
  setMessage
) => {
  try {
    // console.log("yello");
    const response = await axios.post(`/api/v1/auth/register`, {
      firstname: firstName,
      lastname: lastName,
      email: signupEmail,
      password: confirmPassword,
      role: "USER",
      isemailverified: true,
      employeeId: employeeId,
      businessUnit: businessUnit,
    });

    // console.log("yello2");
    return response.data; // Return the data if the request is successful
  } catch (error) {
    // Handle error here

    // console.log(error.response.status);
    if (!error?.response) {
      setMessage("Server not Responding, wait until we get it working");

      // console.log("JUST STOP CODING");
    } else if (error.code == "ERR_NETWORK") {
      setMessage("Server not Reachable, wait until we get it working");
      // If the error has a response property but the status is null, indicating a CORS error
      // console.log("RUN THE BACKEND YOU IDIOT");
    } else if (error.response.status == 400) {
      setMessage(error.response.data.message);
      // console.log(`ERROR:${error.response.data.message}`)
    } else if (error.response?.status == 401) {
      setMessage("Invalid EMAIL or PASSWORD");
      console.log("wrong creds");
    } else if (error.response?.status == 409) {
      setMessage(error.response.data.message);
      console.log("wrong creds");
    } else {
      setMessage(error.response.status);
    }
    setTimeout(() => {
      setMessage("");
    }, 5000);

    throw error; // Rethrow the error to be handled by the caller
  }
};

const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const setAuthSession = (username, role, email, accessToken, empID) => {
  sessionStorage.setItem("user", username);
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("accessToken", accessToken);
  sessionStorage.setItem('empId', empID)
};

const getAuthSession = (setAuth) => {
  const authState = {
    username: sessionStorage.getItem("user"),
    role: sessionStorage.getItem("role"),
    email: sessionStorage.getItem("email"),
    accessToken: sessionStorage.getItem("accessToken"),
    empID: sessionStorage.getItem("empId")
  };
  setAuth(authState);

  return authState;
};

const login = async (loginEmail, loginPassword, setAuth, setMessage) => {
  try {
    // console.log(loginEmail);
    // console.log(loginPassword);
    const response = await axios.post(`/api/v1/auth/authenticate`, {
      email: loginEmail,
      password: loginPassword,
    });

    // console.log(response);

    if (response.data) {
      console.log("accesstoken", decodeToken(response.data.access_token));

      const {
        firstName: username,
        role,
        sub: email,
        employeeId: empID
      } = decodeToken(response.data.access_token);
      // decodeToken(response.data.jwttoken)
      // console.log(userData)
      const accessToken = response?.data?.access_token;
      // const role = userData?.role;
      // console.log(username); // Output: Venkat
      // console.log(role); // Output: USER
      // console.log(email); // Output: venkat_gollapudi@thbs.com
      setAuthSession(username, role, email, accessToken, empID);
      setAuth({ username, role, email, accessToken, empID });

      // console.log("set up auth");
      console.log(role);
      return role;
      // console.log("auth object inside authservice",JSON.stringify(auth))
    }
    return response.data;
  } catch (error) {
    // Handle error here
    if (!error?.response) {
      // console.log("Bharatesh error", error);
      setMessage("Server not Responding, wait until we get it working");

      // console.log("JUST STOP CODING");
    } else if (error.code == "ERR_NETWORK") {
      setMessage("Server not Reachable, wait until we get it working");
      // If the error has a response property but the status is null, indicating a CORS error
      // console.log("RUN THE BACKEND YOU IDIOT");
    } else if (error.response?.status === 400) {
      setMessage("Missing Username or Password");
      // console.log("states are messed up");
    } else if (error.response?.status == 401) {
      setMessage("Invalid EMAIL or PASSWORD");
      console.log("wrong creds");
    } else {
      setMessage("Error: LOGIN FAILED");
    }
    setTimeout(() => {
      setMessage("");
    }, 5000);

    // console.log(JSON.stringify(error))
    // console.error('Error:', "WE ARE DOOMED");
    // throw error; // Rethrow the error to be handled by the caller
  }
};

const logout = async (setAuth, navigate) => {
  // console.log("deleted");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("email")
  // Cookies.remove("bearer");

  setAuth({});
  window.history.replaceState(null, "", "/");
  navigate("/login");
  return "done";

  // return axios.post("/signout").then((response) => {
  //   return response.data;
  // });
};

const sendForgotMail = async (email, setMessage) => {
  try {
    const response = await axios.post(`/api/v1/auth/forgotpassword`, {
      email: email,
    });
    console.log(response);
  } catch (error) {
    if (!error?.response) {
      // console.log("Bharatesh error", error);
      setMessage("Server not Responding, wait until we get it working");

      // console.log("JUST STOP CODING");
    } else if (error.code == "ERR_NETWORK") {
      setMessage("Server not Reachable, wait until we get it working");
      // If the error has a response property but the status is null, indicating a CORS error
      // console.log("RUN THE BACKEND YOU IDIOT");
    } else if (error.response?.status === 400) {
      setMessage("Missing Username or Password");
      // console.log("states are messed up");
    } else if (error.response?.status == 401) {
      setMessage("Unauthorized Access, Your entered Credentials are Wrong");
      // console.log("wrong creds");
    } else {
      setMessage("Error: LOGIN FAILED");
    }
    setTimeout(() => {
      setMessage("");
    }, 5000);
  }
};

const verifyPasswordToken = async (token, setMessage) => {
  try {
    const response = await axios.post(`/api/v1/auth/verifypasswordtoken`, {
      token: token,
    });
    console.log(response);
  } catch (error) {
    if (!error?.response) {
      // console.log("Bharatesh error", error);
      setMessage("Server not Responding, wait until we get it working");

      // console.log("JUST STOP CODING");
    } else if (error.code == "ERR_NETWORK") {
      setMessage("Server not Reachable, wait until we get it working");
      // If the error has a response property but the status is null, indicating a CORS error
      // console.log("RUN THE BACKEND YOU IDIOT");
    } else if (error.response?.status === 400) {
      setMessage("Missing Username or Password");
      // console.log("states are messed up");
    } else if (error.response?.status == 401) {
      setMessage("Unauthorized Access, Your entered Credentials are Wrong");
      // console.log("wrong creds");
    } else {
      setMessage("Error: LOGIN FAILED");
    }
    setTimeout(() => {
      setMessage("");
    }, 5000);
  }
};

const resetPasswordWithToken = async (token, password, setMessage) => {
  try {
    const response = await axios.post(`/api/v1/auth/resetpassword`, {
      token: token,
      newPassword: password,
    });
    // console.log("response", response);
  } catch (error) {
    console.log(error);
    if (!error?.response) {
      // console.log("Bharatesh error", error);
      setMessage("Server not Responding, wait until we get it working");

      // console.log("JUST STOP CODING");
    } else if (error.code == "ERR_NETWORK") {
      setMessage("Server not Reachable, wait until we get it working");
      // If the error has a response property but the status is null, indicating a CORS error
      // console.log("RUN THE BACKEND YOU IDIOT");
    } else if (error.response?.status === 400) {
      setMessage("Missing Username or Password");
      // console.log("states are messed up");
    } else if (error.response?.status == 401) {
      setMessage("Unauthorized Access, Your entered Credentials are Wrong");
      console.log("wrong creds");
    } else {
      setMessage("Error: LOGIN FAILED");
    }
    setTimeout(() => {
      setMessage("");
    }, 5000);
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  sendForgotMail,
  getCurrentUser,
  decodeToken,
  verifyPasswordToken,
  resetPasswordWithToken,
  getAuthSession,
};

export default AuthService;
