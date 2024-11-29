import React, { createContext, useContext, useState, ReactNode } from "react";
import { PublicClient } from "viem";
import { ChainConfig } from "../lib/types";

type ChainConfigContextType = {
  chain: ChainConfig;
  setChain: React.Dispatch<React.SetStateAction<ChainConfig>>;
};

export const ChainConfigContext = createContext<
  ChainConfigContextType | undefined
>(undefined);

type ChainConfigProviderProps = {
  children: ReactNode;
  initialChain: ChainConfig;
};

export function ChainConfigProvider({
  children,
  initialChain,
}: ChainConfigProviderProps) {
  const [chain, setChain] = useState<ChainConfig>(initialChain);

  return (
    <ChainConfigContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainConfigContext.Provider>
  );
}

export function useChainConfig() {
  const context = useContext(ChainConfigContext);
  if (!context) {
    throw new Error("useChainConfig must be used within a ChainConfigProvider");
  }
  return context;
}
