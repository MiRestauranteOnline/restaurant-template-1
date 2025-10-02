import { useState, useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  capacity: number;
  duration_minutes: number;
  min_party_size: number;
  max_party_size: number;
  special_groups_enabled: boolean;
  special_groups_condition: string | null;
  special_groups_contact_method: string | null;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function ReservationBooking() {
  const { client } = useClient();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availableCapacity, setAvailableCapacity] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: '2',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, [client]);

  const [availableDates, setAvailableDates] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (schedules.length > 0) {
      getAvailableDates().then(setAvailableDates);
    }
  }, [schedules]);

  useEffect(() => {
    if (formData.date) {
      getAvailableTimes().then(setAvailableTimes);
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, schedules]);

  useEffect(() => {
    if (formData.time && formData.date) {
      updateAvailableCapacity();
    } else {
      setAvailableCapacity(null);
    }
  }, [formData.time, formData.date, schedules]);

  const fetchSchedules = async () => {
    if (!client?.id) {
      console.log('ReservationBooking: No client ID yet');
      return;
    }
    
    console.log('ReservationBooking: Fetching schedules for client:', client.id);
    
    const { data, error } = await supabase
      .from('reservation_schedules')
      .select('id, day_of_week, start_time, end_time, capacity, duration_minutes, min_party_size, max_party_size, special_groups_enabled, special_groups_condition, special_groups_contact_method')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      console.error('ReservationBooking: Error fetching schedules:', error);
    } else {
      console.log('ReservationBooking: Schedules fetched:', data);
      setSchedules((data as unknown as Schedule[]) || []);
    }
  };

  const getAvailableDates = async () => {
    if (!client?.id || schedules.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 28); // 4 weeks = 28 days

    const availableDatesArray: { value: string; label: string }[] = [];
    const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsInSpanish = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    for (let i = 0; i < 28; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayOfWeek = checkDate.getDay();

      // Check if this day has a schedule configured
      const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
      if (!schedule) continue;

      // Format date as YYYY-MM-DD
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      // Check if there's any available capacity for this date
      const { data: existingReservations } = await supabase
        .from('reservations')
        .select('reservation_time, party_size')
        .eq('client_id', client.id)
        .eq('reservation_date', dateStr)
        .in('status', ['pending', 'confirmed']);

      // Check if at least one time slot has capacity
      let hasAvailableSlot = false;
      const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
      const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const newResStartMinutes = currentHour * 60 + currentMinute;
        const newResEndMinutes = newResStartMinutes + schedule.duration_minutes;
        
        const totalPartySize = (existingReservations || []).reduce((sum, res) => {
          const resTime = res.reservation_time;
          const resStartMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
          const resEndMinutes = resStartMinutes + schedule.duration_minutes;
          // Check if NEW reservation window overlaps with EXISTING reservation window
          const overlaps = newResStartMinutes < resEndMinutes && newResEndMinutes > resStartMinutes;
          return overlaps ? sum + res.party_size : sum;
        }, 0);

        const availableCapacity = schedule.capacity - totalPartySize;
        if (availableCapacity >= 1) {
          hasAvailableSlot = true;
          break;
        }
        
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
      }

      if (hasAvailableSlot) {
        const dayName = daysInSpanish[dayOfWeek];
        const dayNumber = checkDate.getDate();
        const monthName = monthsInSpanish[checkDate.getMonth()];
        availableDatesArray.push({
          value: dateStr,
          label: `${dayName} - ${dayNumber} de ${monthName}`
        });
      }
    }

    return availableDatesArray;
  };

  const getAvailableTimes = async () => {
    if (!formData.date) return [];
    
    // Parse date correctly to avoid timezone issues
    const [year, month, day] = formData.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();
    
    console.log('Selected date:', formData.date, 'Day of week:', dayOfWeek, 'Available schedules:', schedules);
    
    const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
    
    console.log('Found schedule:', schedule);
    
    if (!schedule) return [];

    const times = [];
    const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
    const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
    
    // Generate all potential time slots in 30-minute intervals
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      times.push(timeStr);
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }
    
    // Fetch existing reservations for the selected date
    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('reservation_time, party_size')
      .eq('client_id', client?.id)
      .eq('reservation_date', formData.date)
      .in('status', ['pending', 'confirmed']);

    if (!existingReservations) return times;

    // Filter out times that don't have available capacity
    const availableTimes = times.filter(time => {
      const newResStartMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
      const newResEndMinutes = newResStartMinutes + schedule.duration_minutes;
      
      // Calculate available capacity by checking overlapping reservations
      // A new reservation would run from newResStartMinutes to newResEndMinutes
      const totalPartySize = existingReservations.reduce((sum, res) => {
        const resTime = res.reservation_time;
        const resStartMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
        const resEndMinutes = resStartMinutes + schedule.duration_minutes;
        
        // Check if the NEW reservation window overlaps with this EXISTING reservation window
        // Overlap occurs if: new_start < existing_end AND new_end > existing_start
        const overlaps = newResStartMinutes < resEndMinutes && newResEndMinutes > resStartMinutes;
        
        if (overlaps) {
          return sum + res.party_size;
        }
        return sum;
      }, 0);

      const availableCapacity = schedule.capacity - totalPartySize;
      // Only show slots where available capacity >= 1
      return availableCapacity >= 1;
    });
    
    return availableTimes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          client_id: client?.id,
          reservation_date: formData.date,
          reservation_time: formData.time,
          party_size: parseInt(formData.partySize),
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          special_requests: formData.specialRequests || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('¡Reserva solicitada! Te contactaremos pronto para confirmar.');
      setFormData({
        date: '',
        time: '',
        partySize: '2',
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Error al crear la reserva. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if client hasn't loaded yet
  if (!client?.id) {
    console.log('ReservationBooking: Waiting for client to load');
    return null;
  }

  // Always render the form; show info if no schedules configured
  const hasSchedules = schedules.length > 0;

  const availableDays = hasSchedules ? schedules.map(s => DAYS[s.day_of_week]).join(', ') : 'Próximamente';

  // Get current schedule for party size validation
  const getCurrentSchedule = () => {
    if (!formData.date) return null;
    // Parse date correctly to avoid timezone issues
    const [year, month, day] = formData.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();
    return schedules.find(s => s.day_of_week === dayOfWeek) || null;
  };

  const currentSchedule = getCurrentSchedule();
  const partySize = parseInt(formData.partySize);

  // Check if party size is outside allowed range
  const isPartySizeOutOfRange = currentSchedule && (
    partySize < currentSchedule.min_party_size || 
    partySize > currentSchedule.max_party_size
  );

  // Determine if we should show special groups message
  const shouldShowSpecialGroupsMessage = currentSchedule?.special_groups_enabled && isPartySizeOutOfRange && (
    (currentSchedule.special_groups_condition === 'bigger' && partySize > currentSchedule.max_party_size) ||
    (currentSchedule.special_groups_condition === 'smaller' && partySize < currentSchedule.min_party_size) ||
    (currentSchedule.special_groups_condition === 'both' && isPartySizeOutOfRange)
  );

  // Get contact method message
  const getContactMethodMessage = () => {
    if (!currentSchedule || !shouldShowSpecialGroupsMessage) return null;
    
    const method = currentSchedule.special_groups_contact_method;
    const whatsapp = client?.whatsapp ? `${client.whatsapp_country_code}${client.whatsapp}` : null;
    const phone = client?.phone ? `${client.phone_country_code}${client.phone}` : null;

    if (method === 'whatsapp' && whatsapp) {
      return (
        <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
            Para grupos {partySize < currentSchedule.min_party_size ? 'pequeños' : 'grandes'}, por favor contáctanos por WhatsApp:
          </p>
          <a 
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      );
    }

    if (method === 'phone' && phone) {
      return (
        <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
            Para grupos {partySize < currentSchedule.min_party_size ? 'pequeños' : 'grandes'}, por favor llámanos:
          </p>
          <a 
            href={`tel:${phone}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        </div>
      );
    }

    if (method === 'both' && (whatsapp || phone)) {
      return (
        <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <p className="text-sm text-amber-900 dark:text-amber-100 mb-3">
            Para grupos {partySize < currentSchedule.min_party_size ? 'pequeños' : 'grandes'}, por favor contáctanos:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            )}
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Llamar
              </a>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // Calculate available capacity for selected time slot
  const updateAvailableCapacity = async () => {
    if (!currentSchedule || !formData.date || !formData.time) {
      setAvailableCapacity(null);
      return;
    }
    
    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('reservation_time, party_size')
      .eq('client_id', client?.id)
      .eq('reservation_date', formData.date)
      .in('status', ['pending', 'confirmed']);

    if (!existingReservations) {
      setAvailableCapacity(currentSchedule.capacity);
      return;
    }

    const slotMinutes = parseInt(formData.time.split(':')[0]) * 60 + parseInt(formData.time.split(':')[1]);
    const slotEndMinutes = slotMinutes + 30;
    
    const totalPartySize = existingReservations.reduce((sum, res) => {
      const resTime = res.reservation_time;
      const resMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
      const resEndMinutes = resMinutes + currentSchedule.duration_minutes;
      
      const overlaps = slotMinutes < resEndMinutes && slotEndMinutes > resMinutes;
      
      if (overlaps) {
        return sum + res.party_size;
      }
      return sum;
    }, 0);

    setAvailableCapacity(currentSchedule.capacity - totalPartySize);
  };

  // Generate party size options based on current schedule and available capacity
  const getPartySizeOptions = () => {
    if (!currentSchedule) {
      return Array.from({ length: 10 }, (_, i) => i + 1);
    }
    
    const min = currentSchedule.min_party_size;
    let max = currentSchedule.max_party_size;
    
    // If we have a selected time and know the available capacity, limit max to available capacity
    if (availableCapacity !== null && formData.time) {
      max = Math.min(max, availableCapacity);
    }
    
    // Show options from min to max only
    const options = [];
    for (let i = min; i <= max; i++) {
      options.push(i);
    }
    
    return options.length > 0 ? options : [min]; // Ensure at least one option
  };

  // Get special groups info message
  const getSpecialGroupsInfoMessage = () => {
    if (!currentSchedule?.special_groups_enabled) return null;
    
    const condition = currentSchedule.special_groups_condition;
    const method = currentSchedule.special_groups_contact_method;
    
    let conditionText = '';
    if (condition === 'bigger') {
      conditionText = 'grupos más grandes';
    } else if (condition === 'smaller') {
      conditionText = 'grupos más pequeños';
    } else if (condition === 'both') {
      conditionText = 'grupos más grandes o más pequeños';
    }
    
    let methodText = '';
    if (method === 'whatsapp') {
      methodText = 'WhatsApp';
    } else if (method === 'phone') {
      methodText = 'teléfono';
    } else if (method === 'both') {
      methodText = 'WhatsApp o teléfono';
    }
    
    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
        <p className="text-blue-900 dark:text-blue-100">
          Para {conditionText}, contáctanos por {methodText}.
        </p>
      </div>
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Reserva tu Mesa</h2>
          <p className="text-muted-foreground">
            Disponible: {availableDays}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-lg border">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Select
                  value={formData.date}
                  onValueChange={(value) => setFormData({ ...formData, date: value, time: '' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates.length > 0 ? (
                      availableDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No hay fechas disponibles
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time">Hora</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                  disabled={!formData.date}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.length > 0 ? (
                      availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No hay horarios disponibles
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="partySize">Número de Personas</Label>
              <Select
                value={formData.partySize}
                onValueChange={(value) => setFormData({ ...formData, partySize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getPartySizeOptions().map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentSchedule && (
                <p className="text-xs text-muted-foreground mt-1">
                  Capacidad: {currentSchedule.min_party_size}-{currentSchedule.max_party_size} personas
                </p>
              )}
            </div>

            {getSpecialGroupsInfoMessage()}

            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">Solicitudes Especiales (Opcional)</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Alergias, preferencias de mesa, etc."
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={loading || (shouldShowSpecialGroupsMessage && !currentSchedule?.special_groups_contact_method)}
            >
              <Calendar className="mr-2 h-5 w-5 text-primary-foreground" />
              {loading ? 'Enviando...' : 'Solicitar Reserva'}
            </Button>
            
            {shouldShowSpecialGroupsMessage && !currentSchedule?.special_groups_contact_method && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                Por favor contacta al restaurante directamente para grupos de este tamaño.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
