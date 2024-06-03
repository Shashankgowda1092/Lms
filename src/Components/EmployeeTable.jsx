import PropTypes from "prop-types";
import {
  Typography,
  Checkbox,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
const EmployeeTable = ({
  TABLE_HEAD,
  rows,
  selectedRows,
  setSelectedRows,
  handleCheckboxChange,
  error,
  loading,
}) => {
  const selectAllHandler = () => {
    const visibleRows = rows.filter((row) => !row.isHidden);
    const allVisibleRowsChecked = visibleRows.every(
      (row) => selectedRows[row.employeeId]
    );

    // Toggle the selection status of visible rows
    const newSelectedRows = { ...selectedRows };

    visibleRows.forEach((row) => {
      newSelectedRows[row.employeeId] = !allVisibleRowsChecked;
    });

    // Update the selectedRows state directly to ensure the select all checkbox state is updated
    setSelectedRows(newSelectedRows);
  };
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Typography variant="h5">Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Typography className="text-red-500" variant="h5">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {TABLE_HEAD.map((head, index) => (
            <th
              key={head}
              className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-1 transition-colors hover:bg-blue-gray-50"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="flex items-center justify-between gap-0 font-normal leading-none opacity-70"
              >
                {head}{" "}
                {index == TABLE_HEAD.length - 1 && (
                  <Tooltip content="Select All" id="select-all-checkbox">
                    <span onClick={() => selectAllHandler()}>
                      <IconButton variant="text" className=" mt-1 ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="27"
                          height="27"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 7 2 C 4.199219 2 2 4.199219 2 7 L 2 34 C 2 36.800781 4.199219 39 7 39 L 34 39 C 36.800781 39 39 36.800781 39 34 L 39 7 C 39 6.5 38.914063 6 38.8125 5.5 L 19.09375 27.40625 L 9.40625 18.6875 L 10.6875 17.1875 L 19 24.5 L 37.6875 3.6875 C 36.789063 2.6875 35.5 2 34 2 Z M 41 11 L 41 35 C 41 38.300781 38.300781 41 35 41 L 11 41 L 11 43 C 11 45.800781 13.199219 48 16 48 L 43 48 C 45.800781 48 48 45.800781 48 43 L 48 16 C 48 13.199219 45.800781 11 43 11 Z"></path>
                        </svg>{" "}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(
          ({ firstName, email, lastName, businessUnit, employeeId }, index) => {
            const isLast = index === rows.length - 1;
            const classes = isLast ? "p-1" : "p-1 border-b border-blue-gray-50";

            return (
              <tr
                key={employeeId}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                style={{
                  backgroundColor:
                    hoveredRow === index ? "#e0f7fa" : "transparent",
                  cursor: "pointer",
                  // Light blue-gray color
                }}
              >
                <td className={classes}>
                  <div className="w-max">
                    <Typography variant="lead" size="sm">
                      {employeeId}
                    </Typography>
                  </div>
                </td>
                <td className={classes}>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {firstName}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        {email}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className={classes}>
                  <div className="flex flex-col">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {lastName}
                    </Typography>
                  </div>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {businessUnit == undefined ? "NBU CDEC" : businessUnit}
                  </Typography>
                </td>
                <td className={classes}>
                  <Checkbox
                    color="green"
                    checked={selectedRows[employeeId]}
                    onChange={() => handleCheckboxChange(employeeId)}
                  />
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

EmployeeTable.propTypes = {
  TABLE_HEAD: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  selectedRows: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default EmployeeTable;
