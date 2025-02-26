export const getRolesFromToken = (): string[] => {
    const token = localStorage.getItem("token");
    if (!token) return [];
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.roles || []; // Return roles if present, otherwise return an empty array
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return [];
    }
  };
  