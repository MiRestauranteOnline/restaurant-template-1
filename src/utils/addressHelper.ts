/**
 * Helper utilities for handling single or multiple addresses
 * Ensures backward compatibility with old single-string format
 */

export interface LocationAddress {
  address: string;
  name?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Normalizes address data to always return an array
 * @param address - Can be a JSON string, string, array of strings, or array of location objects
 * @returns Array of LocationAddress objects
 */
export const normalizeAddresses = (
  address: string | string[] | LocationAddress[] | null | undefined
): LocationAddress[] => {
  if (!address) return [];
  
  // If it's a string, try to parse as JSON first
  if (typeof address === 'string') {
    try {
      const parsed = JSON.parse(address);
      if (Array.isArray(parsed)) {
        return parsed.map((addr: any, index: number) => {
          if (typeof addr === 'object' && addr.address) {
            return addr as LocationAddress;
          }
          return {
            address: typeof addr === 'string' ? addr : String(addr),
            name: parsed.length > 1 ? `Ubicación ${index + 1}` : undefined
          };
        });
      }
    } catch {
      // If parsing fails, treat as single address (backward compatibility)
      return [{ address }];
    }
  }
  
  // If it's already an array of location objects
  if (Array.isArray(address) && address.length > 0 && typeof address[0] === 'object') {
    return address as LocationAddress[];
  }
  
  // If it's an array of strings
  if (Array.isArray(address)) {
    return address.map((addr, index) => ({
      address: addr,
      name: address.length > 1 ? `Ubicación ${index + 1}` : undefined
    }));
  }
  
  // Fallback: treat as single string
  return [{ address: String(address) }];
};

/**
 * Gets the primary (first) address for backward compatibility
 */
export const getPrimaryAddress = (
  address: string | string[] | LocationAddress[] | null | undefined
): string | null => {
  const addresses = normalizeAddresses(address);
  return addresses.length > 0 ? addresses[0].address : null;
};

/**
 * Gets map URL for the first location
 */
export const getMapUrl = (
  address: string | string[] | LocationAddress[] | null | undefined,
  useCoordinates?: boolean,
  coordinates?: { lat?: number; lng?: number }
): string | null => {
  if (useCoordinates && coordinates?.lat && coordinates?.lng) {
    return `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  
  const primaryAddress = getPrimaryAddress(address);
  if (!primaryAddress) return null;
  
  return `https://maps.google.com/maps?q=${encodeURIComponent(primaryAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};
