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
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);

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
