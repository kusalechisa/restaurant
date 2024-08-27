import axios from "axios";

// Create a new order for the current user
export const createOrder = async (order) => {
  try {
    // Send a POST request to the API endpoint to create a new order
    const { data } = await axios.post("/api/orders/create", order);
    return data; // Return the created order data
  } catch (error) {
    console.error("Error creating order:", error); // Log error for debugging
    throw error; // Re-throw error for further handling if needed
  }
};

// Get the most recent order for the current user
export const getNewOrderForCurrentUser = async () => {
  try {
    // Send a GET request to the API endpoint to fetch the new order for the current user
    const { data } = await axios.get("/api/orders/newOrderForCurrentUser");
    return data; // Return the fetched order data
  } catch (error) {
    console.error("Error fetching new order for current user:", error); // Log error for debugging
    throw error; // Re-throw error for further handling if needed
  }
};

// Pay for an existing order using paymentId
export const pay = async (paymentId) => {
  try {
    // Send a PUT request to the API endpoint to process the payment
    const { data } = await axios.put("/api/orders/pay", { paymentId });
    return data; // Return the payment result data
  } catch (error) {
    console.error("Error processing payment:", error); // Log error for debugging
    throw error; // Re-throw error for further handling if needed
  }
};

// Track an order by its ID
export const trackOrderById = async (orderId) => {
  try {
    // Send a GET request to the API endpoint to fetch order details by ID
    const { data } = await axios.get(`/api/orders/track/${orderId}`);
    return data; // Return the tracked order data
  } catch (error) {
    console.error("Error tracking order by ID:", error); // Log error for debugging
    throw error; // Re-throw error for further handling if needed
  }
};

// Get all orders by their state
export const getAll = async (state) => {
  try {
    // Send a GET request to the API endpoint to fetch all orders with a specific state
    const { data } = await axios.get(`/api/orders/${state ?? ""}`);
    return data; // Return the fetched orders data
  } catch (error) {
    console.error("Error fetching all orders:", error); // Log error for debugging
    throw error; // Re-throw error for further handling if needed
  }
};

// Get all possible order statuses
export const getAllStatus = async () => {
  try {
    // Send a GET request to the API endpoint to fetch all possible order statuses
    const { data } = await axios.get("/api/orders/allstatus");
    return data; // Return the fetched statuses data
  } catch (error) {
    console.error("Error fetching all statuses:", error); // Log error for debugging
    throw error; // Re-throw error for further handling if needed
  }
};
