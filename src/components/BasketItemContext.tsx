import React, { useCallback, useMemo, useState } from "react";
import { BasketItemType, ItemType } from "../types";
import { fetchData } from "../utils";
import { useBasketContext } from "../hooks/useBasketContext";
import { useLoginPopupContext } from "../hooks/useLoginPopupContext";
import { useErrorContext } from "../hooks/useErrorContext";
import { useLogoutListener } from "../hooks/useLogoutListener";

interface BasketItemContextProps {
  basketItems: BasketItemType[];
  setBasketItems: (items: BasketItemType[]) => void;
  setBasketItemsAndStore: (items: BasketItemType[]) => void;
  setBasketItemAndStore: (item: BasketItemType) => void;
  addToBasket: (item: ItemType) => void;
  removeFromBasket: (item: ItemType) => void;
  isInBasket: (item: ItemType) => boolean;
}

export const BasketItemContext = React.createContext<
  BasketItemContextProps | undefined
>(undefined);

export const BasketItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [basketItems, setBasketItems] = useState<BasketItemType[]>(
    JSON.parse(localStorage.getItem("basket_items") || "[]"),
  );
  const { setErrorMessage } = useErrorContext();
  const { basket } = useBasketContext();
  const { setShowLoginPopupAndStore } = useLoginPopupContext();

  const setBasketItemsAndStore = useCallback((items: BasketItemType[]) => {
    setBasketItems(items);
    if (items.length > 0) {
      localStorage.setItem("basket_items", JSON.stringify(items));
    } else {
      localStorage.removeItem("basket_items");
    }
  }, []);

  const setBasketItemAndStore = (item: BasketItemType) => {
    setBasketItems((currentItems) => {
      const updatedItems = [...currentItems, item];
      localStorage.setItem("basket_items", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const value = useMemo(() => {
    const isInBasket = (item: ItemType): boolean => {
      return basketItems.some((basketItem) => basketItem.item.id === item.id);
    };

    const addToBasket = async (item: ItemType) => {
      if (!basket) {
        setShowLoginPopupAndStore(true);
        return;
      }

      try {
        const params = {
          basket_id: basket.id,
          item_id: item.id,
        };
        const basketItem = await fetchData(
          "",
          "basketitem",
          "POST",
          params,
          true,
        );
        setBasketItemAndStore(basketItem);
      } catch (error) {
        setErrorMessage(`Error adding item to basket: ${error}`);
      }
    };

    const removeFromBasket = async (excludeItem: ItemType) => {
      try {
        if (!basketItems) {
          setShowLoginPopupAndStore(true);
          return;
        }
        const basketItem = basketItems.find(
          (basketItem) => basketItem.item.id === excludeItem.id,
        );
        if (!basketItem) {
          console.error(`No basket item found with item id ${excludeItem.id}`);
          setErrorMessage("Error removing item from basket");
          return;
        }
        await fetchData("", `basketitem/${basketItem.id}`, "DELETE", {}, true);
        setBasketItems((currentBasket) => {
          const updatedBasket = currentBasket.filter(
            (basketItem) => basketItem.item.id !== excludeItem.id,
          );
          localStorage.setItem("basket_items", JSON.stringify(updatedBasket));
          return updatedBasket;
        });
      } catch (error) {
        setErrorMessage(`Error removing item from basket: ${error}`);
      }
    };

    return {
      basketItems,
      setBasketItems,
      setBasketItemsAndStore,
      setBasketItemAndStore,
      addToBasket,
      removeFromBasket,
      isInBasket,
    };
  }, [
    basket,
    basketItems,
    setBasketItemsAndStore,
    setErrorMessage,
    setShowLoginPopupAndStore,
  ]);

  useLogoutListener(() => setBasketItemsAndStore([]));

  return (
    <BasketItemContext.Provider value={value}>
      {children}
    </BasketItemContext.Provider>
  );
};
