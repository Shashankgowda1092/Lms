import { BatchIp, myHeaders } from "./IpAddress";
export async function fetchBatchData() {
  try {
    const response = await fetch(`${BatchIp}/batch`, {
      headers: myHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch batch data");
    }
    if (response.status==204) {
      // const responseBody = await response.text();
      // if (response.ok && responseBody.trim() === "Batches are not created yet") {
      //   return [];
      // }
      return [];
  }
    const data = await response.json();

  

    const today = new Date();
    const updatedData = data.map((batch) => {
      const startDate = new Date(batch.startDate);
      const endDate = new Date(batch.endDate);
      const online = startDate <= today && today <= endDate;
      return { ...batch, online };
    });

    return updatedData;
  } catch (error) {
    console.error("Error fetching batch data:", error);
    return null;
  }
}


// batchAPI.js
export async function createBatch(data) {
  try {
    const response = await fetch(`${BatchIp}/batch`, {
      method: "POST",
      headers:myHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create batch");
    }

    return true; // Indicate successful creation
  } catch (error) {
    console.error("Error creating batch:", error);
    return false; // Indicate failure
  }
}
// batchAPI.js
export async function getBatchDetails(id) {
  try {
    const response = await fetch(`${BatchIp}/batch/id/${id}`,{
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

export async function updateBatch(id, data) {
  try {
    const response = await fetch(`${BatchIp}/batch/${id}`, {
      method: "PUT",
      headers:myHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update batch");
    }

    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating batch:", error);
    return false; // Indicate failure
  }
}
