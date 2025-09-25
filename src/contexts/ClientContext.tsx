import React, { createContext, useContext, ReactNode } from 'react';
import { useClientData, ClientData, MenuItem, MenuCategory, ClientSettings, AdminContent } from '@/hooks/useClientData';

interface ClientContextType {
  client: ClientData | null;
  adminContent: AdminContent | null;
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  clientSettings: ClientSettings | null;
  loading: boolean;
  error: string | null;
  subdomain: string;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  console.log('🔍 useClient: Attempting to access context');
  const context = useContext(ClientContext);
  console.log('🔍 useClient: Context value:', context ? 'FOUND' : 'UNDEFINED');
  
  if (context === undefined) {
    console.error('🚨 useClient: Context is undefined! ClientProvider not found in component tree');
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
  subdomain?: string;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children, subdomain }) => {
  console.log('🔍 ClientProvider: Initializing with subdomain:', subdomain);
  const clientData = useClientData(subdomain);
  
  console.log('🔍 ClientProvider: Client data loaded:', {
    client: clientData.client?.restaurant_name,
    adminContent: clientData.adminContent ? 'LOADED' : 'NULL',
    loading: clientData.loading,
    error: clientData.error
  });

  return (
    <ClientContext.Provider value={clientData}>
      {children}
    </ClientContext.Provider>
  );
};