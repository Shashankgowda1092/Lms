import axios from "./axios";
import { myHeaders } from "../../../Services/IpAddress";
const getBatchProgress = async () => {
  try {
    const response = await axios.get(`/batch-progress`, {
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const getBatchProgressByID = async ({ batchID }) => {
  try {
    const response = await axios.get(`/batch-progress/${batchID}`, {
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const getAllUserBatchProgressByID = async ({ batchID }) => {
  try {
    const response = await axios.get(`/batch-progress/allusers/${batchID}`, {
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const getUserProgressByID = async ({ userID, batchID }) => {
  try {
    const response = await axios.get(
      `/user-progress/${userID}/batch/${batchID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );
    console.log("progress responese",response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUserProgressOfTopicsByID = async ({ userID, batchID, topicID }) => {
  // console.log(batchID)
  try {
    const response = await axios.get(
      `/user-progress/${userID}/batch/${batchID}/topic/${topicID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    //
    // console.error(error);
    return { userId: 0, topicProgress: 0 };
  }
};

const getUserProgressOfResourcesByID = async ({ userID, resourceID }) => {
  try {
    const response = await axios.get(
      `/user-progress/${userID}/resource/${resourceID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );

    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUserProgressOfCoursesByID = async ({ userID, courseID, batchID }) => {
  try {
    const response = await axios.get(
      `/user-progress/${userID}/batch/${batchID}/course/${courseID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getOverallCourseProgress = async ({ courseID, batchID }) => {
  try {
    const response = await axios.get(
      `/batch-progress/batch-course-progress/batch/${batchID}/course/${courseID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getOverallTopicProgress = async ({ topicID, batchID }) => {
  try {
    const response = await axios.get(
      `/batch-progress/batch-topic-progress/batch/${batchID}/topic/${topicID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getOverallResourceProgress = async ({ batchID, resourceID }) => {
  try {
    const response = await axios.get(
      `/batch-progress/batch-resource-progress/batch/${batchID}/resource/${resourceID}`,
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUserProgressOfTopicsByArray = async ({ userID, topicIDs }) => {
  console.log("userid", userID);
  console.log("tid", topicIDs);

  try {
    const response = await axios.post(`/user-progress/resource-progress`, {
      userId: userID,
      topicIds: topicIDs,

      headers: {
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      },
    });
    console.log(response[1]);
  } catch (error) {}
};

const getUserProgressOfCoursesByArray = async ({ userID, coursesIDs }) => {
  try {
    const response = await axios.post(`/user-progress/course-progress`, {
      userId: userID,
      courseIds: coursesIDs,

      headers: {
        ...myHeaders,
        Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
      },
    });
  } catch (error) {}
};

const setProgress = async ({ userID, resourceID, progress, batchID }) => {
  try {
    const response = await axios.patch(
      `/user-progress/${userID}/batch/${batchID}/resource/${resourceID}/update/${progress}`,
      {}, // Empty data object, since PATCH request data is empty
      {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};


const ProgressService = {
  getBatchProgress,
  getBatchProgressByID,
  getAllUserBatchProgressByID,
  getUserProgressByID,
  getUserProgressOfTopicsByID,
  getUserProgressOfResourcesByID,
  getUserProgressOfCoursesByID,
  getOverallCourseProgress,
  getOverallTopicProgress,
  getOverallResourceProgress,
  getUserProgressOfTopicsByArray,
  getUserProgressOfCoursesByArray,
  setProgress,
};
export default ProgressService;
