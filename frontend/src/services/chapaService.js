// import axios from "axios";

// const API_BASE_URL = "/api/payment";
// const CHAPA_API_KEY = "Bearer CHAPUBK_TEST-lmJyYmYTMcuyQpy8b7etsnlFOTyTg8Ac";

// // Function to initialize Chapa payment
// export const initializeChapaPayment = async (paymentDetails) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/initialize`,
//       paymentDetails,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: CHAPA_API_KEY,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     handleError("initializing payment", error);
//     throw error;
//   }
// };

// // Function to verify Chapa payment
// export const verifyChapaPayment = async (transactionId) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/verify`,
//       { transactionId },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: CHAPA_API_KEY,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     handleError("verifying payment", error);
//     throw error;
//   }
// };

// // General error handling function
// const handleError = (action, error) => {
//   if (error.response) {
//     // The request was made and the server responded with a status code
//     // that falls out of the range of 2xx
//     console.error(`Error ${action} with Chapa:`, {
//       status: error.response.status,
//       headers: error.response.headers,
//       data: error.response.data,
//     });
//   } else if (error.request) {
//     // The request was made but no response was received
//     console.error(`Error ${action} with Chapa:`, {
//       request: error.request,
//     });
//   } else {
//     // Something happened in setting up the request that triggered an Error
//     console.error(`Error ${action} with Chapa:`, error.message);
//   }
// };
