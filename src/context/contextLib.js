import { useContext, createContext } from 'react';

export const NetworkConfigContext = createContext(null);

export function useNetworkConfigContext() {
  return useContext(NetworkConfigContext);
}
