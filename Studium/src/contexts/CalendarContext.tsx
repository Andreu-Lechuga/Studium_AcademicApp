import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface CalendarSettings {
  showDayNumbers: boolean;
  showSunday: boolean;
  showSaturday: boolean;
  firstHour: number;
  lastHour: number;
  setShowDayNumbers: (value: boolean) => void;
  setShowSunday: (value: boolean) => void;
  setShowSaturday: (value: boolean) => void;
  setFirstHour: (value: number) => void;
  setLastHour: (value: number) => void;
}

const CalendarContext = createContext<CalendarSettings | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [showDayNumbers, setShowDayNumbers] = useState(() => {
    const saved = localStorage.getItem('calendarShowDayNumbers');
    return saved ? JSON.parse(saved) : false;
  });

  const [showSunday, setShowSunday] = useState(() => {
    const saved = localStorage.getItem('calendarShowSunday');
    return saved ? JSON.parse(saved) : false;
  });

  const [showSaturday, setShowSaturday] = useState(() => {
    const saved = localStorage.getItem('calendarShowSaturday');
    return saved ? JSON.parse(saved) : false;
  });

  const [firstHour, setFirstHour] = useState(() => {
    const saved = localStorage.getItem('calendarFirstHour');
    return saved ? JSON.parse(saved) : 8;
  });

  const [lastHour, setLastHour] = useState(() => {
    const saved = localStorage.getItem('calendarLastHour');
    return saved ? JSON.parse(saved) : 20;
  });

  useEffect(() => {
    localStorage.setItem('calendarShowDayNumbers', JSON.stringify(showDayNumbers));
  }, [showDayNumbers]);

  useEffect(() => {
    localStorage.setItem('calendarShowSunday', JSON.stringify(showSunday));
  }, [showSunday]);

  useEffect(() => {
    localStorage.setItem('calendarShowSaturday', JSON.stringify(showSaturday));
  }, [showSaturday]);

  useEffect(() => {
    localStorage.setItem('calendarFirstHour', JSON.stringify(firstHour));
  }, [firstHour]);

  useEffect(() => {
    localStorage.setItem('calendarLastHour', JSON.stringify(lastHour));
  }, [lastHour]);

  return (
    <CalendarContext.Provider
      value={{
        showDayNumbers,
        showSunday,
        showSaturday,
        firstHour,
        lastHour,
        setShowDayNumbers,
        setShowSunday,
        setShowSaturday,
        setFirstHour,
        setLastHour,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarSettings() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarSettings must be used within CalendarProvider');
  }
  return context;
}