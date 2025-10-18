import { supabase } from '@/integrations/supabase/client';

export interface TableConfig {
  id: string;
  table_name: string;
  seats: number;
  quantity: number;
  min_party_size: number;
  max_party_size: number;
  available?: number;
}

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  capacity: number;
  duration_minutes: number;
  custom_table_configs: TableConfig[] | null;
}

interface Reservation {
  reservation_time: string;
  party_size: number;
  table_config_id: string | null;
  duration_minutes: number;
}

/**
 * Determines which table configurations apply for a schedule
 * Returns custom configs if they exist, otherwise global configs
 */
export const getActiveTableConfigs = (
  schedule: Schedule,
  globalTableConfigs: TableConfig[]
): TableConfig[] => {
  return schedule.custom_table_configs && schedule.custom_table_configs.length > 0
    ? schedule.custom_table_configs
    : globalTableConfigs;
};

/**
 * Calculates available tables for a given time slot
 * Returns array of table configs with their availability
 */
export const calculateTableAvailability = (
  activeTableConfigs: TableConfig[],
  existingReservations: Reservation[],
  slotStartMinutes: number,
  slotEndMinutes: number
): TableConfig[] => {
  if (activeTableConfigs.length === 0) return [];

  return activeTableConfigs.map(config => {
    // Count how many of this table type are already booked
    const bookedCount = existingReservations.filter(res => {
      // Only count reservations assigned to this table type
      if (res.table_config_id !== config.id) return false;

      // Check time overlap using the reservation's stored duration
      const resStartMinutes = parseInt(res.reservation_time.split(':')[0]) * 60 + 
                             parseInt(res.reservation_time.split(':')[1]);
      const resEndMinutes = resStartMinutes + res.duration_minutes;

      // Bidirectional overlap check: slot overlaps with reservation if:
      // slot starts before reservation ends AND slot ends after reservation starts
      return slotStartMinutes < resEndMinutes && slotEndMinutes > resStartMinutes;
    }).length;

    return {
      ...config,
      available: config.quantity - bookedCount
    };
  });
};

/**
 * Finds the best matching table for a party size
 * Returns the config ID of the most suitable table, or null if none available
 */
export const findSuitableTable = (
  partySize: number,
  availableTables: TableConfig[]
): string | null => {
  // Filter tables that can accommodate the party size and have availability
  const suitableTables = availableTables.filter(table => 
    table.available && table.available > 0 &&
    partySize >= table.min_party_size &&
    partySize <= table.max_party_size
  );

  if (suitableTables.length === 0) return null;

  // Sort by smallest seat count first (optimal fit)
  suitableTables.sort((a, b) => a.seats - b.seats);

  return suitableTables[0].id;
};

/**
 * Gets the party size range for display based on table configurations
 * Returns null if no table configs exist (backward compatibility)
 */
export const getPartySizeRange = (
  schedule: Schedule,
  globalTableConfigs: TableConfig[]
): { min: number; max: number } | null => {
  const activeConfigs = getActiveTableConfigs(schedule, globalTableConfigs);
  
  if (activeConfigs.length === 0) return null;

  const minSize = Math.min(...activeConfigs.map(t => t.min_party_size));
  const maxSize = Math.max(...activeConfigs.map(t => t.max_party_size));

  return { min: minSize, max: maxSize };
};

/**
 * Simple capacity check for backward compatibility
 * Used when no table configurations exist
 */
export const checkSimpleCapacity = async (
  clientId: string,
  date: string,
  time: string,
  scheduleCapacity: number,
  scheduleDuration: number
): Promise<number> => {
  const { data: existingReservations } = await supabase
    .from('reservations')
    .select('reservation_time, party_size')
    .eq('client_id', clientId)
    .eq('reservation_date', date)
    .in('status', ['pending', 'confirmed']);

  if (!existingReservations) return scheduleCapacity;

  const slotMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const slotEndMinutes = slotMinutes + scheduleDuration;

  const totalPartySize = existingReservations.reduce((sum, res) => {
    const resTime = res.reservation_time;
    const resStartMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
    const resEndMinutes = resStartMinutes + scheduleDuration;
    const overlaps = slotMinutes < resEndMinutes && slotEndMinutes > resStartMinutes;
    return overlaps ? sum + res.party_size : sum;
  }, 0);

  return scheduleCapacity - totalPartySize;
};
