// import { API_URL } from "../config/api.js";

// export const fetchAllCars = async () => {
//   try {
//     const response = await fetch(`${API_URL}/api/cars`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch cars");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching cars:", error);
//     throw error;
//   }
// };
import axios from "axios";

const API_URL = "https://dz-car-zar.onrender.com/api/cars";

export const fetchCars = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};
