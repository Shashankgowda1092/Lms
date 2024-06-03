import React, { useEffect } from "react";

import useAuth from "../Hooks/useAuth";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import logo from "../Assets/logo.svg";
import Hero from "../Assets/LandingPageHero.png";
import { Button } from "@material-tailwind/react";
import ParticlesComponent from "../Components/particles";

// const LandingPage = () => {
//   const { auth } = useAuth();
//   useEffect(() => {
//     if (auth.accessToken) {
//       console.log("cookie creation started");
//       // Extract the token without 'bearer=' prefix
//       let tokenWithoutBearer = auth.accessToken.split("bearer=")[1];
//       let jwt = tokenWithoutBearer.split(";")[0];

//       console.log("auth", auth);
//       console.log("jwt token", jwt);
//       // Set the cookie with the given attributes
//       Cookies.set("bearer", jwt);
//     }
//     // CampaignService.getMainDash()
//   }, []);
//   return (
//     <>
//       <div className="App">
//         <ParticlesComponent id="particles" />

//         <div className=" z-10 min-h-screen bg-white flex flex-col justify-center items-center ">
//           <img
//             src={logo}
//             alt="logo"
//             className=" z-10 h-16 w-18 absolute top-4 left-4"
//           />
//           <img src={Hero} alt="R" className=" z-10 h-1/3 w-1/3 mb-4" />
//           <h1 className="z-10 text-4xl font-bold mb-5">Welcome</h1>
//           <div className="flex space-x-4">
//             <Link className="z-10" to="/login">
//               <Button className="z-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//                 Login
//               </Button>
//             </Link>
//             <Link className="z-10" to="register">
//               <Button className="z-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//                 Sign Up
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LandingPage;
// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../assets/lo.png";
// import Hero from "../assets/Hero.png";
// import { Button } from "@material-tailwind/react";
// import ParticlesComponent from "../Components/particles";

const LandingPage = () => {
  return (
    <>
      <div className="App">
        <ParticlesComponent id="particles" />

        <div className=" z-10 min-h-screen bg-white flex flex-col justify-center items-center ">
          <img
            src={logo}
            alt="logo"
            className=" z-10 h-16 w-18 absolute top-4 left-4"
          />
          <img src={Hero} alt="R" className=" z-10 h-1/3 w-1/3 mb-4" />
          <h1 className="z-10 text-4xl font-bold mb-5">Welcome</h1>
          <div className="flex space-x-4">
            <Link to="/login" id="login">
              <Button className="z-15 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline">
                Login
              </Button>
            </Link>

            <Link to="/register" id='register'>
              <Button className="z-15 bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
