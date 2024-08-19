import { useContext } from "react";
import { BasketItemContext } from "../components/BasketItemContext";

export const useBasketItemContext = () => {
  const context = useContext(BasketItemContext);
  if (!context) {
    throw new Error(
      "useBasketItemContext must be used within a BasketItemContext",
    );
  }
  return context;
};
