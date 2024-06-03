import {BatchIp, myHeaders} from "./IpAddress"
export async function fetchTrainees(batchId) {
  try {
    const response = await fetch(
      `${BatchIp}/batch/batch-details/employees/${batchId}`
    ,{
      headers:myHeaders,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch trainees");
    }
    return response.json(); // Read the response body only once
  } catch (error) {
    console.error("Error fetching trainees:", error);
    return null;
  }
}
