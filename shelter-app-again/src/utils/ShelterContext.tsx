import React, { createContext, useState, useContext } from "react";

// Define the context type
interface ShelterContextType {
  selectedShelterId: number | null;
  setSelectedShelterId: (id: number) => void;
}

// Create context with default values
const ShelterContext = createContext<ShelterContextType | undefined>(undefined);

// Create provider component
export const ShelterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load shelter ID from localStorage if available
  const [selectedShelterId, setSelectedShelterIdState] = useState<number | null>(() => {
    const storedId = localStorage.getItem("selectedShelterId");
    return storedId ? parseInt(storedId, 10) : null;
  });

  // Update localStorage when selectedShelterId changes
  const setSelectedShelterId = (id: number) => {
    setSelectedShelterIdState(id);
    localStorage.setItem("selectedShelterId", id.toString());
  };

  return (
    <ShelterContext.Provider value={{ selectedShelterId, setSelectedShelterId }}>
      {children}
    </ShelterContext.Provider>
  );
};

// Custom hook to use shelter context
export const useShelter = (): ShelterContextType => {
  const context = useContext(ShelterContext);
  if (!context) {
    throw new Error("useShelter must be used within a ShelterProvider");
  }
  return context;
};
