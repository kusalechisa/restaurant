import axios from "axios";

// Define the base URL of the backend
const API_URL = "https://ketirestaurant.onrender.com/";

// Helper to get user from localStorage
export const getUser = () =>
  localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

// Login API call
export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/api/users/login`, {
    email,
    password,
  });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Register API call
export const register = async (registerData) => {
  const { data } = await axios.post(
    `${API_URL}/api/users/register`,
    registerData
  );
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("user");
};

// Update profile API call
export const updateProfile = async (user) => {
  const { data } = await axios.put(`${API_URL}/api/users/updateProfile`, user);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Change password API call
export const changePassword = async (passwords) => {
  await axios.put(`${API_URL}/api/users/changePassword`, passwords);
};

// Get all users with optional search term
export const getAll = async (searchTerm) => {
  const { data } = await axios.get(
    `${API_URL}/api/users/getAll/${searchTerm ?? ""}`
  );
  return data;
};

// Toggle block user API call
export const toggleBlock = async (userId) => {
  const { data } = await axios.put(
    `${API_URL}/api/users/toggleBlock/${userId}`
  );
  return data;
};

// Get user by ID
export const getById = async (userId) => {
  const { data } = await axios.get(`${API_URL}/api/users/getById/${userId}`);
  return data;
};

// Update user data API call
export const updateUser = async (userData) => {
  const { data } = await axios.put(`${API_URL}/api/users/update`, userData);
  return data;
};
