import { AttendanceIp, LearningPlanIp,myHeaders } from "./IpAddress";
export async function getBatches() {
  try {
    const response = await fetch(`${AttendanceIp}/batches`, {
      headers: myHeaders,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch batch details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching batch details:", error);
    return null;
  }
}
export async function getCourses(batchId) {
  try {
    const response = await fetch(`${LearningPlanIp}/batch-course/batch/${batchId}`, {
      headers: myHeaders,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch batch details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching batch details:", error);
    return null;
  }
}

export const getPeriod = [
  {
    id: 1,
    name: "First Half",
  },
  {
    id: 2,
    name: "Second Half",
  },
  {
    id: 3,
    name: "Full Day",
  },
];
export async function getPeriodStatus(batchId, courseId, date) {
  try {
    const response = await fetch(
      `${AttendanceIp}/batch/${batchId}/course/${courseId}/Date/${date}`,
      {
        headers: myHeaders,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch period details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching attendance Period Data:", error);
    return false;
  }
}
export async function attendanceRecordFound(batchId, courseId, type, date) {
  try {
    const response = await fetch(
      `${AttendanceIp}/batch/${batchId}/course/${courseId}/Date/${date}/type/${type}`,
      {
        headers: myHeaders,
      }
    );
    if (response.status == 204) {
      return false;
    } else if (response.status == 500) {
      return null;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error fetching attendance Record:", error);
    return false;
  }
}