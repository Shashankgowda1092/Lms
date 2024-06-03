import {ProgressIp, myHeaders} from "./IpAddress"
export async function fetchProgressData() {
  try {
    const response = await fetch(`${ProgressIp}/batch-progress`,{headers:myHeaders});
    if (response.status === 204) {
      return [];
    }
    if (!response.ok) {
      // throw new Error("Failed to fetch progress");
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
}
export async function fetchBatchUserProgress(id) {
  try {
    const response = await fetch(`${ProgressIp}/batch-progress/allusers/${id}`,{
      headers:myHeaders,
    });
    if (!response.ok) {
      // throw new Error("Failed to fetch progress");
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
}

export async function fetchBatchProgress(batchId) {
  try {
    const response = await fetch(
      `${ProgressIp}/batch-progress/${batchId}`
    ,{
      headers:myHeaders,
    });
    if (!response.ok) {
      // throw new Error("Failed to fetch progress");
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
}