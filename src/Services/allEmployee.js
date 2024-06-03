// traineesAPI.js
import {BatchIp, myHeaders} from './IpAddress'
// import BulkUploadFile from "../Data/"
export async function fetchEmployees(batchId) {
    try {
      const response = await fetch(`${BatchIp}/batch/remaining-employees/batch-id/${batchId}`,{
        headers:myHeaders,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch trainees");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching trainees:", error);
      return null;
    }
  }
  export async function fetchBatchSize(batchId) {
    try {

      const response = await fetch(`${BatchIp}/batch/batch-size/${batchId}`,{
        headers:myHeaders,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch trainees");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching trainees:", error);
      return null;
    }
  }
  
  // batchUsers.js

  export async function sendSelectedUsers(selectedUsers, batchId) {
    try {
      // Transform selectedUsers array into an array of objects
      const transformedUsers = selectedUsers.map(userId => ({ employeeId: userId }));
      
      const response = await fetch(`${BatchIp}/batch/employee/batch-id/${batchId}`, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(transformedUsers) // Send transformedUsers instead of userIds
      });
      

  
      if (!response.ok) {
        throw new Error('Failed to add users to batch');
      }
      // Handle response if needed
    } catch (error) {
      console.error('Error adding users to batch:', error);
      throw error; // Propagate error to caller if needed
    }
  }
  export async function sendExcelUserFile(file, batchId) {
    try {
      // Create a new FormData object
      const formData = new FormData();
      // Append the file to the FormData object
      formData.append('file', file);
      console.log(formData)
      const response = await fetch(`${BatchIp}/batch/existing-batch/bulk/batch-id/${batchId}`, {
        method: 'POST',
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('auth')}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS,GET,PUT"
      },
        body: formData // Send the FormData object as the request body
      });
      console.log(response);
  
      if (!response.ok) {
        throw new Error('Failed to add users to batch');
      }
      // Handle response if needed
    } catch (error) {
      console.error('Error adding users to batch:', error);
      throw error; // Propagate error to caller if needed
    }
  }
  
  export const  downloadFile = async () => {
    try {
      // Make a GET request to the endpoint
      const response = await fetch(`${BatchIp}/batch/format`, {
        method: 'GET',
        headers:myHeaders
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
  
      // Get the content disposition header to extract the filename
      const contentDisposition = response.headers.get('content-disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
  
      // Extract the filename from the content disposition header, if available
      const filename = filenameMatch ? filenameMatch[1] : 'downloaded_file';
  
      // Convert the response to blob
      const fileBlob = await response.blob();
  
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(fileBlob);
  
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
  
      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();
  
      // Clean up by removing the link and revoking the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  

  
