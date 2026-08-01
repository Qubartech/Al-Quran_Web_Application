"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("quran_leftbar_open");
    if (saved !== null) {
      setIsLeftBarOpen(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsLeftBarOpen((prev) => {
      const nextState = !prev;
      localStorage.setItem("quran_leftbar_open", String(nextState));
      return nextState;
    });
  };

  const setSidebarOpen = (isOpen) => {
    setIsLeftBarOpen(isOpen);
    localStorage.setItem("quran_leftbar_open", String(isOpen));
  };

  return (
    <SidebarContext.Provider value={{ isLeftBarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
