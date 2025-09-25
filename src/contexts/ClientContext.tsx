import React, { createContext, useContext, ReactNode } from 'react';
import { useClientData, ClientData, MenuItem, MenuCategory, ClientSettings } from '@/hooks/useClientData';

interface ClientContextType {
  client: ClientData | null;
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  clientSettings: ClientSettings | null;
  loading: boolean;
  error: string | null;
  subdomain: string;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
  subdomain?: string;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children, subdomain }) => {
  const clientData = useClientData(subdomain);

  return (
    <ClientContext.Provider value={clientData}>
      {children}
    </ClientContext.Provider>
  );
};