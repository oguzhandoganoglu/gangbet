import React, { createContext, useContext, useState } from "react";
import { ReactNode } from "react";

interface NavbarContextType {
  balanceContent: ReactNode | null;
  setBalanceContent: (content: ReactNode | null) => void;
}

const NavbarContext = createContext<NavbarContextType>({
  balanceContent: null,
  setBalanceContent: () => {},
});

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [balanceContent, setBalanceContent] = useState<ReactNode | null>(null);

  return (
    <NavbarContext.Provider value={{ balanceContent, setBalanceContent }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
