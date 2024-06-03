import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Card,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import ProgressBar from "../Components/ProgressBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBatch } from "../Context/BatchContext";
const TABLE_HEAD = [
  "Batch Name",
  "Progress",
  "Status",
  "Batch Created Date",
  "View Batch",
];

const BatchDetailsTable = ({
  status,
  batchData,
  progressData,
  searchQuery,
}) => {
  const [sortBy, setSortBy] = useState({ column: null, ascending: true });
  const navigate = useNavigate();
  let filteredRows =
    status === "All"
      ? batchData
      : status === "Active"
      ? batchData.filter((row) => row.online)
      : batchData.filter((row) => !row.online);
  const progressHandler = (batchId) => {
    const res = progressData.filter((data) => data.batchId == batchId);
    if (res == undefined || res == null || res.length == 0) {
      return 0;
    }
    return res[0].batchProgress;
  };
  const handleSort = (columnIndex) => {
    let newSortBy = { column: columnIndex, ascending: true };

    if (sortBy.column === columnIndex) {
      newSortBy.ascending = !sortBy.ascending;
    }

    setSortBy(newSortBy);
  };
  if (sortBy.column !== null) {
    filteredRows.sort((a, b) => {
      let valueA, valueB;

      if (sortBy.column === 1) {
        valueA = progressHandler(a.batchId);
        valueB = progressHandler(b.batchId);
      } else if (sortBy.column === 3) {
        valueA = a.startDate;
        valueB = b.startDate;
      } else {
        valueA = a[TABLE_HEAD[sortBy.column]];
        valueB = b[TABLE_HEAD[sortBy.column]];
      }

      if (valueA < valueB) return sortBy.ascending ? -1 : 1;
      if (valueA > valueB) return sortBy.ascending ? 1 : -1;
      return 0;
    });
  }

  function parseDate(dateString) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[2]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[0]);
      return new Date(2000 + year, month - 1, day); // Adjust year based on your data
    }
    return null;
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredRows = filteredRows.filter(({ batchName }) =>
      batchName.toLowerCase().includes(query)
    );
  }
  const { setId } = useBatch();
  const batchHandler = (batchId) => {
    setId(batchId);
    navigate("/lms/batches/batchDetails");
  };
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };
  return (
    <Card className="h-full w-full">
      <CardBody className="overflow-scroll px-0 m-5">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  onClick={() => handleSort(index)}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {(index === 1 || index === 3) && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(
              ({ batchName, online, startDate, batchId }, index) => {
                // Render each row based on filteredRows
                const isLast = index === filteredRows.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr
                    key={batchName}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      backgroundColor:
                        hoveredRow === index ? "#e0f7fa" : "transparent",
                        cursor:'pointer'
                        // Light blue-gray color
                    }}
                  >
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {batchName}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <ProgressBar progressValue={progressHandler(batchId)} />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-24">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={online ? "Active" : "Non-Active"}
                          color={online ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal ml-5"
                      >
                        {startDate}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Batch Details">
                        <span onClick={() => batchHandler(batchId)}>
                          <IconButton variant="text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </IconButton>
                        </span>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};
BatchDetailsTable.propTypes = {
  status: PropTypes.string.isRequired,
  batchData: PropTypes.array.isRequired,
  progressData: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default BatchDetailsTable;
