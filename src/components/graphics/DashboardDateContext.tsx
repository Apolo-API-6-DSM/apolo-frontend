import React, { createContext, useContext, useState } from "react";

type DashboardDateContextType = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
};

const DashboardDateContext = createContext<DashboardDateContextType | undefined>(undefined);

export const DashboardDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <DashboardDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DashboardDateContext.Provider>
  );
};

export const useDashboardDate = () => {
  const context = useContext(DashboardDateContext);
  if (!context) throw new Error("useDashboardDate must be used within DashboardDateProvider");
  return context;
};
