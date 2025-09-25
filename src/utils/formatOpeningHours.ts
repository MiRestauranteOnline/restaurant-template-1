// PROTECTED: Dynamic functionality - DO NOT modify the core logic
// Only styling and UI improvements are allowed

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

const dayNames = {
  monday: "Lunes",
  tuesday: "Martes", 
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo"
};

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const formatOpeningHours = (hours: any): string[] => {
  // PROTECTED: This function handles dynamic data from database
  if (!hours || typeof hours !== 'object') {
    return ["Lunes - Viernes: 9:00 - 22:00", "Sábado - Domingo: 12:00 - 21:00"];
  }

  // Use opening_hours_ordered if available, otherwise convert opening_hours
  let orderedHours: OpeningHour[];
  
  if (Array.isArray(hours)) {
    // hours is already opening_hours_ordered
    orderedHours = hours;
  } else if (hours.opening_hours_ordered && Array.isArray(hours.opening_hours_ordered)) {
    orderedHours = hours.opening_hours_ordered;
  } else {
    // Convert opening_hours object to ordered array
    orderedHours = dayOrder.map(day => {
      const schedule = hours[day];
      return {
        day,
        open: schedule?.open || "09:00",
        close: schedule?.close || "22:00",
        closed: schedule?.closed || false
      };
    }).filter(Boolean);
  }

  if (!orderedHours || orderedHours.length === 0) {
    return ["Lunes - Viernes: 9:00 - 22:00"];
  }

  const grouped: string[] = [];
  let i = 0;

  while (i < orderedHours.length) {
    const currentDay = orderedHours[i];
    const dayName = dayNames[currentDay.day as keyof typeof dayNames] || currentDay.day;

    if (currentDay.closed) {
      // Handle closed days - check if consecutive closed days can be grouped
      let j = i + 1;
      while (j < orderedHours.length && orderedHours[j].closed) {
        j++;
      }
      
      if (j - i === 1) {
        grouped.push(`${dayName}: Cerrado`);
      } else {
        const endDay = dayNames[orderedHours[j - 1].day as keyof typeof dayNames] || orderedHours[j - 1].day;
        grouped.push(`${dayName} - ${endDay}: Cerrado`);
      }
      i = j;
    } else {
      // Handle open days - group consecutive days with same hours
      let j = i + 1;
      while (j < orderedHours.length && 
             !orderedHours[j].closed &&
             orderedHours[j].open === currentDay.open &&
             orderedHours[j].close === currentDay.close) {
        j++;
      }

      const timeRange = `${currentDay.open} - ${currentDay.close}`;
      
      if (j - i === 1) {
        grouped.push(`${dayName}: ${timeRange}`);
      } else {
        const endDay = dayNames[orderedHours[j - 1].day as keyof typeof dayNames] || orderedHours[j - 1].day;
        grouped.push(`${dayName} - ${endDay}: ${timeRange}`);
      }
      i = j;
    }
  }

  return grouped;
};