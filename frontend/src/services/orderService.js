import axios from "axios";

// Base URL for order management
const ORDER_API_BASE_URL = "/api/orders";

// Base URL for payment handling
const PAYMENT_API_BASE_URL = "/api/payment";

// CHAPA API Key (ensure this is stored securely, not hardcoded)
const CHAPA_API_KEY = "Bearer CHAPUBK_TEST-lmJyYmYTMcuyQpy8b7etsnlFOTyTg8Ac";

// Function to create a new order
export const createOrder = async (order) => {
  try {
    const { data } = await axios.post(`${ORDER_API_BASE_URL}/create`, order);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Function to get the most recent order for the current user
export const getNewOrderForCurrentUser = async () => {
  try {
    const { data } = await axios.get(
      `${ORDER_API_BASE_URL}/newOrderForCurrentUser`
    );
    return data;
  } catch (error) {
    console.error("Error fetching new order for current user:", error);
    throw error;
  }
};

// Function to pay for an existing order
export const pay = async (paymentId) => {
  try {
    const { data } = await axios.put(`${ORDER_API_BASE_URL}/pay`, {
      paymentId,
    });
    return data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

// Function to track an order by its ID
export const trackOrderById = async (orderId) => {
  try {
    const { data } = await axios.get(`${ORDER_API_BASE_URL}/track/${orderId}`);
    return data;
  } catch (error) {
    console.error("Error tracking order by ID:", error);
    throw error;
  }
};

// Function to get all orders by their status
export const getAll = async (status) => {
  try {
    const { data } = await axios.get(`${ORDER_API_BASE_URL}/${status ?? ""}`);
    return data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

// Function to get all possible order statuses
export const getAllStatus = async () => {
  try {
    const { data } = await axios.get(`${ORDER_API_BASE_URL}/allstatus`);
    return data;
  } catch (error) {
    console.error("Error fetching all statuses:", error);
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
    const response = await axios.post(
      `${PAYMENT_API_BASE_URL}/verify`,
      { transactionId },
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
    console.error(`Error ${action} with Chapa:`, {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
    });
  } else if (error.request) {
    console.error(`Error ${action} with Chapa:`, {
      request: error.request,
    });
  } else {
    console.error(`Error ${action} with Chapa:`, error.message);
  }
};
