import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import axios from "axios";
import { myHeaders } from "../../Services/IpAddress";
const DownloadDialog = ({
  openDownload,
  setOpenDownload,
  batchID,
  courseID,
  setBatchID,
}) => {
  const handleOpen = () => setOpenDownload(!openDownload);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [dialogBatchID, setDialogBatchID] = useState();
  const [dialogCourseID, setDialogCourseID] = useState();
  const [batchData, setBatchData] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [courses, setCourses] = useState();
  const handleDownload = () => {
    setError("");

    axios
      .get(
        `${
          import.meta.env.VITE_API_GOWSIC
        }/attendance-report/excel/${dialogBatchID}/${dialogCourseID}/${format(
          state[0].startDate,
          "yyyy-MM-dd"
        )}/${format(state[0].endDate, "yyyy-MM-dd")}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
          responseType: "blob", // Correctly place responseType here
        }
      )
      .then((response) => {
        if (response && response.data) {
          const url = URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "attendance_report.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Remove the link after triggering the download
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error("No data received from the server");
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.toString() ||
          error.message ||
          "Unknown error occurred";
        setError(errorMessage);
        console.error("Error downloading file:", errorMessage);
      });
  };

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_GOWSIC}/batch`,
          {
            headers: {
              ...myHeaders,
              Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
            },
          }
        );
        setBatchData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Batches not found");
        console.error("Error fetching batch data:", error);
      }
    };

    fetchBatchData();
  }, []);

  useEffect(() => {
    const fetchCourseList = async () => {
      if (dialogBatchID) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_GOWSIC
            }/batch-course/batch/${dialogBatchID}`,
            {
              headers: {
                ...myHeaders,
                Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
              },
            }
          );
          setCourses(response.data.courses);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError("Courses not found");
          console.error("Error fetching course data:", error);
        }
      } else {
        setCourses([]);
      }
    };

    fetchCourseList();
  }, [dialogBatchID]);

  return (
    <>
      <Dialog
        open={openDownload}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        size="xl"
      >
        <DialogHeader>Download Attendance Report</DialogHeader>

        <DialogBody className="flex flex-col justify-center items-center gap-7">
          {loading ? (
            <Typography color="red">{error}</Typography>
          ) : (
            <>
              {" "}
              <div className="flex flex-row justify-center items-center gap-4">
                <Select
                  label="Batch"
                  value={dialogBatchID || null}
                  onChange={(e) => {
                    setError("");
                    setDialogBatchID(e);
                    setDialogCourseID(null);
                  }}
                >
                  {batchData && batchData.length > 0 ? (
                    batchData.map((item) => (
                      <Option key={item.batchId} value={item.batchId}>
                        {item.batchName}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No Data Available</Option>
                  )}
                </Select>

                <Select
                  label="Course"
                  value={dialogCourseID}
                  disabled={!dialogBatchID}
                  onChange={(e) => {
                    setError("");
                    console.log(e);
                    setDialogCourseID(e);
                    console.log(dialogCourseID);
                  }}
                >
                  {courses && courses.length > 0 ? (
                    courses.map((item) => (
                      <Option key={item.courseId} value={item.courseId}>
                        {item.courseName}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No Data Available</Option>
                  )}
                </Select>
              </div>
              <DateRangePicker
                onChange={(item) => {
                  console.log(item);
                  setState([item.selection]);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                readOnly={false}
                months={1}
                ranges={state}
                direction="horizontal"
              />
            </>
          )}
        </DialogBody>

        <DialogFooter>
          {!dialogBatchID || !dialogCourseID ? (
            <Typography className="animate-pulse" color="red">
              "Select batch and course before downloading"
            </Typography>
          ) : null}
          {error && (
            <Typography className="animate-pulse" color="red">
              {error}
            </Typography>
          )}

          {/* {!dialogCourseID && !dialogBatchID && <Typography className="animate-pulse" color="red">Select batch and course before downloading</Typography> } */}
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>

          <Button
            variant="gradient"
            disabled={!dialogBatchID || !dialogCourseID}
            color="green"
            onClick={handleDownload}
            title={`Downlaod attendance from ${format(
              state[0].startDate,
              "yyyy-MM-dd"
            )} to ${format(state[0].endDate, "yyyy-MM-dd")} `}
          >
            <span>Download</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default DownloadDialog;
