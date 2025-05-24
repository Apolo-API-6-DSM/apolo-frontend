import React, { createContext, useContext, useState } from "react";

type DashboardDateRange = { start: Date | null; end: Date | null };

type DashboardDateContextType = {
  selectedRange: DashboardDateRange;
  setSelectedRange: (range: DashboardDateRange) => void;
};

const DashboardDateContext = createContext<DashboardDateContextType | undefined>(undefined);

export const DashboardDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRange, setSelectedRange] = useState<DashboardDateRange>({ start: new Date(), end: null });
  return (
    <DashboardDateContext.Provider value={{ selectedRange, setSelectedRange }}>
      {children}
    </DashboardDateContext.Provider>
  );
};

export const useDashboardDate = () => {
  const context = useContext(DashboardDateContext);
  if (!context) throw new Error("useDashboardDate must be used within DashboardDateProvider");
  return context;
};
