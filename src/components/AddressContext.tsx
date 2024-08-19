import React, { Dispatch, SetStateAction, useState } from "react";
import { AddressType, CountryType } from "../types";
import { useLogoutListener } from "../hooks/useLogoutListener";

export const AddressContext = React.createContext<{
  address: AddressType | null;
  setAddress: Dispatch<SetStateAction<AddressType | null>>;
  setAddressAndStore: (value: AddressType | null) => void;
  updateAddressField: <K extends keyof AddressType>(
    fieldName: K,
    newValue: AddressType[K] extends CountryType
      ? CountryType | null
      : AddressType[K] extends number
        ? AddressType[K] | undefined
        : AddressType[K],
  ) => void;
}>({
  address: null,
  setAddress: () => {
    // No-op placeholder function
  },
  setAddressAndStore: () => {
    // No-op placeholder function
  },
  updateAddressField: () => {
    // No-op placeholder function
  },
});

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<AddressType | null>(
    JSON.parse(localStorage.getItem("address") || "null"),
  );

  const setAddressAndStore = (value: AddressType | null) => {
    setAddress(value);
    if (value) {
      localStorage.setItem("address", JSON.stringify(value));
    } else {
      localStorage.removeItem("address");
    }
  };

  const updateAddressField = <K extends keyof AddressType>(
    fieldName: K,
    newValue: AddressType[K] extends CountryType
      ? CountryType | null
      : AddressType[K] extends number
        ? AddressType[K] | undefined
        : AddressType[K],
  ) => {
    setAddress((prevAddress) => {
      if (prevAddress) {
        return { ...prevAddress, [fieldName]: newValue };
      }
      return {
        id: 0,
        address: "",
        country_id: 0,
        country: {
          id: 0,
          title: "",
          code: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        city: "",
        zipcode: "",
        user_id: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });
  };

  useLogoutListener(() => setAddressAndStore(null));

  return (
    <AddressContext.Provider
      value={{ address, setAddress, setAddressAndStore, updateAddressField }}
    >
      {children}
    </AddressContext.Provider>
  );
};
