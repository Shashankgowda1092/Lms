export const token = sessionStorage.getItem('auth');

// Define your headers here
export const myHeaders = new Headers({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS,GET,PUT"
});

// Function to get the batch IP
export const BatchIp=import.meta.env.VITE_BATCH_SERVICE_URL;

// Function to get the progress IP
export const ProgressIp= import.meta.env.VITE_PROGRESS_SERVICE_URL;
export const AttendanceIp =import.meta.env.VITE_ATTENDANCE_SERVICE_URL+"/attendance"; 
export const LearningPlanIp=import.meta.env.VITE_API_URL;