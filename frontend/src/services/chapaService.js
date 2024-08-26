import axios from "axios";

export const initializeChapaPayment = async (paymentDetails) => {
  try {
    const response = await axios.post(
      "/api/payment/initialize",
      paymentDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer CHAPUBK_TEST-lmJyYmYTMcuyQpy8b7etsnlFOTyTg8Ac",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error initializing payment with Chapa:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error initializing payment with Chapa:", {
        request: error.request,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error initializing payment with Chapa:", error.message);
    }
    throw error;
  }
};
