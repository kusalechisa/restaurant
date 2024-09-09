import axios from "axios";

// Base URL for the API
const BASE_URL = "https://ketirestaurant.onrender.com/api/foods";

// Fetch all foods
export const getAll = async () => {
  const { data } = await axios.get(`${BASE_URL}`);
  return data;
};

// Search for foods by a search term
export const search = async (searchTerm) => {
  const { data } = await axios.get(`${BASE_URL}/search/${searchTerm}`);
  return data;
};

// Fetch all available tags
export const getAllTags = async () => {
  const { data } = await axios.get(`${BASE_URL}/tags`);
  return data;
};

// Fetch foods by a specific tag
export const getAllByTag = async (tag) => {
  if (tag === "All") return getAll();
  const { data } = await axios.get(`${BASE_URL}/tag/${tag}`);
  return data;
};

// Fetch food by its ID
export const getById = async (foodId) => {
  const { data } = await axios.get(`${BASE_URL}/${foodId}`);
  return data;
};

// Delete a food item by its ID
export const deleteById = async (foodId) => {
  await axios.delete(`${BASE_URL}/${foodId}`);
};

// Update a food item
export const update = async (food) => {
  await axios.put(`${BASE_URL}`, food);
};

// Add a new food item
export const add = async (food) => {
  const { data } = await axios.post(`${BASE_URL}`, food);
  return data;
};
