import { useContext } from "react";
import { CurrencyContext } from "../components/CurrencyContext";

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      "useCurrencyContext must be used within a CurrencyProvider",
    );
  }
  return context;
};
