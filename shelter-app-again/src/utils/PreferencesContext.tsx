// PreferencesContext.tsx
import React, { createContext, useContext, useState } from 'react';

const PreferencesContext = createContext<any>(null);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState({});

  const updatePreferences = (updates: Record<string, any>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
