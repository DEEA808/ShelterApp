import axios from "axios";

export const fetchShelterDetails = async (token: string | null) => {
    if (!token) return null;

    try {
        const response = await axios.get("http://localhost:8005/shelters/mine", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; 
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null; 
    }
};

export const fetchShelterById = async (id: number, token: string | null) => {
    if (!token) return null;
  
    try {
      const response = await axios.get(`http://localhost:8005/shelters/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching shelter by ID:", error);
      return null;
    }
  };
  
