import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import AuthService from "../Api/services/AuthService";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [authComplete, setAuthComplete] = useState(false);

  useEffect(() => {
    const setAuthSess = async () => {
      try {
        await AuthService.getAuthSession(setAuth);
        // console.log("auth in reqauth", auth);
        setAuthComplete(true);
      } catch (error) {
        // Handle any errors
        console.error("Error while setting auth session:", error);
      }
    };

    setAuthSess();
  }, []);

  // Render a loading indicator or nothing until authentication process is complete
  if (!authComplete) {
    return null; // Or render a loading spinner, message, etc.
  }

  // Once authentication process is complete, render based on auth and allowedRoles
  console.log("auth in requireAuth", JSON.stringify(auth));
  return auth && allowedRoles.includes(auth.role) ? (
    <Outlet />
  ) : auth?.username ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
