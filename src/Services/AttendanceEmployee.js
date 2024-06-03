import {AttendanceIp,myHeaders} from "./IpAddress"
export async function fetchEmployees(batchId) {
    try {
      const response = await fetch(`${AttendanceIp}/batch/employees/${batchId}`,{
        headers:myHeaders,
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
  export async function fetchUpdatedEmployees(batchId,courseId,type,date) {
    
    try {
      const response = await fetch(`${AttendanceIp}/batch/${batchId}/course/${courseId}/Date/${date}/type/${type}`,{
        headers:myHeaders,
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
  export const sendSelectedUsers = async (allUsers, selectedUsers, batchId, courseId, period, date) => {
    // Initialize filteredAttendance array
    let filteredAttendance = allUsers.map(employeeId => ({
        userId: employeeId,
        status: selectedUsers.includes(employeeId.toString()) ? "present" : "absent"
    }));
    const type = period.id == '1' ? 'First Half' : period.id == '2' ? 'Second Half' : 'Full Day';
    // const formattedDate = new Date(date).toISOString().slice(0, 10);
    // Prepare data object
    let data = {
        "batchId": batchId,
        "courseId": courseId,
        "date": date,
        "type": type,
        "attendance": filteredAttendance,
    };
    try {
        const response = await fetch(`${AttendanceIp}/update`, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update attendance");
        }


        return true; // Indicate successful update
      } catch (error) {
        console.error("Error updating attendance:", error);
        return false; // Indicate failure
      }
};