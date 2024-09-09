import axios from "axios";

// Base URL for your backend
const API_URL = "https://ketirestaurant.onrender.com/";

// Base URL for order management and payment handling
const ORDER_API_BASE_URL = `${API_URL}api/orders`;
const PAYMENT_API_BASE_URL = `${API_URL}api/payment`;

// CHAPA API Key (ensure this is stored securely, not hardcoded)
const CHAPA_API_KEY = "Bearer CHAPUBK_TEST-lmJyYmYTMcuyQpy8b7etsnlFOTyTg8Ac";

// Function to create a new order
export const createOrder = async (order) => {
  try {
    const response = await axios.post(`${ORDER_API_BASE_URL}/create`, order, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleError("creating order", error);
    throw error;
  }
};

// Function to get the most recent order for the current user
export const getNewOrderForCurrentUser = async () => {
  try {
    const response = await axios.get(
      `${ORDER_API_BASE_URL}/newOrderForCurrentUser`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError("fetching new order for current user", error);
    throw error;
  }
};

// Function to pay for an existing order
export const pay = async (paymentId) => {
  try {
    const response = await axios.put(
      `${ORDER_API_BASE_URL}/pay`,
      { paymentId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError("processing payment", error);
    throw error;
  }
};

// Function to track an order by its ID
export const trackOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${ORDER_API_BASE_URL}/track/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleError("tracking order by ID", error);
    throw error;
  }
};

// Function to get all orders by their status
export const getAll = async (status) => {
  try {
    const response = await axios.get(`${ORDER_API_BASE_URL}/${status ?? ""}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleError("fetching all orders", error);
    throw error;
  }
};

// Function to get all possible order statuses
export const getAllStatus = async () => {
  try {
    const response = await axios.get(`${ORDER_API_BASE_URL}/allstatus`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleError("fetching all statuses", error);
    throw error;
  }
};

// Function to initialize a payment with Chapa
export const initializeChapaPayment = async (paymentDetails) => {
  try {
    const response = await axios.post(
      `${PAYMENT_API_BASE_URL}/initialize`,
      paymentDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: CHAPA_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError("initializing payment", error);
    throw error;
  }
};

// Function to verify a payment with Chapa
export const verifyChapaPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${transactionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: CHAPA_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError("verifying payment", error);
    throw error;
  }
};

// General error handling function
const handleError = (action, error) => {
  if (error.response) {
    console.error(`Error ${action}:`, {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
    });
  } else if (error.request) {
    console.error(`Error ${action}:`, error.request);
  } else {
    console.error(`Error ${action}:`, error.message);
  }
};
