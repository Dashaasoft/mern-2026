export const fetchAllCars = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/cars");
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};
