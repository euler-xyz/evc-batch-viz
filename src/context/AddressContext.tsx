import React, { createContext, useContext, useState, ReactNode } from "react";
import { AddressMetadata, AddressMetadataMap } from "../lib/types";

type AddressMetadataContextType<T extends AddressMetadata> = {
  metadata: AddressMetadataMap<T>;
  setMetadata: React.Dispatch<React.SetStateAction<AddressMetadataMap<T>>>;
};

export const AddressMetadataContext = createContext<
  AddressMetadataContextType<any> | undefined
>(undefined);

type AddressMetadataProviderProps<T extends AddressMetadata> = {
  children: ReactNode;
  initialMetadata: AddressMetadataMap<T>;
};

export function AddressMetadataProvider<T extends AddressMetadata>({
  children,
  initialMetadata,
}: AddressMetadataProviderProps<T>) {
  const [metadata, setMetadata] =
    useState<AddressMetadataMap<T>>(initialMetadata);

  return (
    <AddressMetadataContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </AddressMetadataContext.Provider>
  );
}

export function useAddressMetadata<T extends AddressMetadata>() {
  const context = useContext(AddressMetadataContext);
  if (!context) {
    throw new Error(
      "useAddressMetadata must be used within an AddressMetadataProvider"
    );
  }
  return context as AddressMetadataContextType<T>;
}
