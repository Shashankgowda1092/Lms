import React from 'react';
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { auth, setAuth } = useAuth();
  const showLMS = false;
  const showLMSInPath = pathnames.includes('lms') && showLMS;
  return (
    <Breadcrumbs>
      <Link
            to={`/dashboard/${
              auth.role === "ADMIN"
                ? "admin"
                : auth.role === "TRAINER"
                ? "trainer"
                : "trainee"
            }`}
          >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </Link>
      {pathnames.map((name, index) => {
        if (!showLMSInPath && name === 'lms') return null; // Skip rendering 'lms' if it should not be shown

        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <Link
            key={name}
            to={routeTo}
            className={`opacity-60 ${isLast ? "font-semibold" : ""}`}
            data-testid={isLast ? 'current-page-link' : null}
          >
            <span>{name}</span>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
