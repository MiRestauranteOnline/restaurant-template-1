import { useState, useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getCachedAdminContent } from '@/utils/cachedContent';
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
  custom_table_configs: any[] | null;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ReservationBookingMinimalistic = () => {
  const { client, adminContent } = useClient();
  const cachedAdminContent = getCachedAdminContent();
  
  // Get all text labels from admin content with fallbacks
  const dateLabel = (adminContent as any)?.reservation_date_label || (cachedAdminContent as any)?.reservation_date_label || 'Fecha';
  const timeLabel = (adminContent as any)?.reservation_time_label || (cachedAdminContent as any)?.reservation_time_label || 'Hora';
  const partySizeLabel = (adminContent as any)?.reservation_party_size_label || (cachedAdminContent as any)?.reservation_party_size_label || 'Número de Personas';
  const nameLabel = (adminContent as any)?.reservation_name_label || (cachedAdminContent as any)?.reservation_name_label || 'Nombre Completo';
  const emailLabel = (adminContent as any)?.reservation_email_label || (cachedAdminContent as any)?.reservation_email_label || 'Email';
  const phoneLabel = (adminContent as any)?.reservation_phone_label || (cachedAdminContent as any)?.reservation_phone_label || 'Teléfono';
  const specialRequestsLabel = (adminContent as any)?.reservation_special_requests_label || (cachedAdminContent as any)?.reservation_special_requests_label || 'Solicitudes Especiales (Opcional)';
  const specialRequestsPlaceholder = (adminContent as any)?.reservation_special_requests_placeholder || (cachedAdminContent as any)?.reservation_special_requests_placeholder || 'Alergias, preferencias de asiento, celebraciones...';
  const submitButtonText = (adminContent as any)?.reservation_submit_button || (cachedAdminContent as any)?.reservation_submit_button || 'Solicitar Reserva';
  const loadingText = (adminContent as any)?.reservation_loading_text || (cachedAdminContent as any)?.reservation_loading_text || 'Procesando...';
  const selectDatePlaceholder = (adminContent as any)?.reservation_select_date_placeholder || (cachedAdminContent as any)?.reservation_select_date_placeholder || 'Selecciona una fecha';
  const loadingDatesText = (adminContent as any)?.reservation_loading_dates || (cachedAdminContent as any)?.reservation_loading_dates || 'Cargando fechas...';
  const selectTimePlaceholder = (adminContent as any)?.reservation_select_time_placeholder || (cachedAdminContent as any)?.reservation_select_time_placeholder || 'Selecciona una hora';
  const selectDateFirstText = (adminContent as any)?.reservation_select_date_first || (cachedAdminContent as any)?.reservation_select_date_first || 'Primero selecciona una fecha';
  const noTimesAvailableText = (adminContent as any)?.reservation_no_times_available || (cachedAdminContent as any)?.reservation_no_times_available || 'No hay horarios disponibles';
  const capacityAvailableText = (adminContent as any)?.reservation_capacity_available || (cachedAdminContent as any)?.reservation_capacity_available || 'Capacidad disponible';
  const availableDaysText = (adminContent as any)?.reservation_available_days || (cachedAdminContent as any)?.reservation_available_days || 'Días disponibles';
  const systemConfiguringText = (adminContent as any)?.reservation_system_configuring || (cachedAdminContent as any)?.reservation_system_configuring || 'El sistema de reservas se está configurando. Mientras tanto, puedes contactarnos directamente.';
  const whatsappButtonText = (adminContent as any)?.whatsapp_button_text || (cachedAdminContent as any)?.whatsapp_button_text || 'WhatsApp';
  const callButtonText = (adminContent as any)?.call_button_text || (cachedAdminContent as any)?.call_button_text || 'Llamar';
  const smallGroupMessage = (adminContent as any)?.reservation_small_group_message || (cachedAdminContent as any)?.reservation_small_group_message || 'Para grupos pequeños, por favor contáctanos';
  const largeGroupMessage = (adminContent as any)?.reservation_large_group_message || (cachedAdminContent as any)?.reservation_large_group_message || 'Para grupos grandes, por favor contáctanos';
  const contactWhatsappText = (adminContent as any)?.reservation_contact_whatsapp || (cachedAdminContent as any)?.reservation_contact_whatsapp || 'Contactar por WhatsApp';
  const personsText = (adminContent as any)?.persons_text || (cachedAdminContent as any)?.persons_text || 'personas';
  const reservationTitle = (adminContent as any)?.homepage_reservation_title || cachedAdminContent?.homepage_reservation_title || 'Reserva Tu Mesa';
  const reservationDescription = (adminContent as any)?.homepage_reservation_description || cachedAdminContent?.homepage_reservation_description || '¿Listo para disfrutar de una experiencia culinaria excepcional?';
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [globalTableConfigs, setGlobalTableConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availableCapacity, setAvailableCapacity] = useState<number | null>(null);
  const [availableDates, setAvailableDates] = useState<{ value: string; label: string }[]>([]);
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

  // Real-time updates: Listen for new reservations to refresh availability
  useEffect(() => {
    if (!client?.id || !formData.date) return;

    const channel = supabase
      .channel('reservation-updates-minimalistic')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations',
          filter: `client_id=eq.${client.id}`
        },
        (payload) => {
          console.log('New reservation detected, refreshing availability');
          if (formData.date) {
            getAvailableTimes().then(setAvailableTimes);
            if (formData.time) {
              updateAvailableCapacity();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [client?.id, formData.date, formData.time]);

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
    if (!client?.id) return;
    
    const { data, error } = await supabase
      .from('reservation_schedules')
      .select('id, day_of_week, start_time, end_time, capacity, duration_minutes, min_party_size, max_party_size, special_groups_enabled, special_groups_condition, special_groups_contact_method, custom_table_configs')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      console.error('Error fetching schedules:', error);
    } else {
      setSchedules((data as unknown as Schedule[]) || []);
    }

    // Fetch global table configurations
    const { data: tableConfigs } = await supabase
      .from('table_configurations' as any)
      .select('id, table_name, seats, quantity, min_party_size, max_party_size')
      .eq('client_id', client.id)
      .eq('is_active', true);

    setGlobalTableConfigs((tableConfigs as any) || []);
  };

  const getAvailableDates = async () => {
    if (!client?.id || schedules.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availableDatesArray: { value: string; label: string }[] = [];
    const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsInSpanish = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    for (let i = 0; i < 28; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayOfWeek = checkDate.getDay();

      const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
      if (!schedule) continue;

      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      const { data: existingReservations } = await supabase
        .from('reservations')
        .select('reservation_time, party_size, duration_minutes')
        .eq('client_id', client.id)
        .eq('reservation_date', dateStr)
        .in('status', ['pending', 'confirmed']);

      let hasAvailableSlot = false;
      const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
      const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const newResStartMinutes = currentHour * 60 + currentMinute;
        const newResEndMinutes = newResStartMinutes + schedule.duration_minutes;
        
        const totalPartySize = (existingReservations || []).reduce((sum, res: any) => {
          const resTime = res.reservation_time;
          const resStartMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
          const resEndMinutes = resStartMinutes + (res.duration_minutes || schedule.duration_minutes);
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
    
    const [year, month, day] = formData.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();
    
    const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
    if (!schedule) return [];

    const times = [];
    const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
    const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
    
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
    
    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('reservation_time, party_size, duration_minutes')
      .eq('client_id', client?.id)
      .eq('reservation_date', formData.date)
      .in('status', ['pending', 'confirmed']);

    if (!existingReservations) return times;

    const availableTimes = times.filter(time => {
      const newResStartMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
      const newResEndMinutes = newResStartMinutes + schedule.duration_minutes;
      
      const totalPartySize = existingReservations.reduce((sum, res: any) => {
        const resTime = res.reservation_time;
        const resStartMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
        const resEndMinutes = resStartMinutes + (res.duration_minutes || schedule.duration_minutes);
        const overlaps = newResStartMinutes < resEndMinutes && newResEndMinutes > resStartMinutes;
        return overlaps ? sum + res.party_size : sum;
      }, 0);

      const availableCapacity = schedule.capacity - totalPartySize;
      return availableCapacity >= 1;
    });
    
    return availableTimes;
  };

  const updateAvailableCapacity = async () => {
    const currentSchedule = getCurrentSchedule();
    if (!currentSchedule || !formData.date || !formData.time) {
      setAvailableCapacity(null);
      return;
    }
    
    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('reservation_time, party_size, duration_minutes')
      .eq('client_id', client?.id)
      .eq('reservation_date', formData.date)
      .in('status', ['pending', 'confirmed']);

    if (!existingReservations) {
      setAvailableCapacity(currentSchedule.capacity);
      return;
    }

    const slotMinutes = parseInt(formData.time.split(':')[0]) * 60 + parseInt(formData.time.split(':')[1]);
    const slotEndMinutes = slotMinutes + currentSchedule.duration_minutes;
    
    const totalPartySize = existingReservations.reduce((sum, res: any) => {
      const resTime = res.reservation_time;
      const resStartMinutes = parseInt(resTime.split(':')[0]) * 60 + parseInt(resTime.split(':')[1]);
      const resEndMinutes = resStartMinutes + (res.duration_minutes || currentSchedule.duration_minutes);
      const overlaps = slotMinutes < resEndMinutes && slotEndMinutes > resStartMinutes;
      return overlaps ? sum + res.party_size : sum;
    }, 0);

    setAvailableCapacity(currentSchedule.capacity - totalPartySize);
  };

  const getCurrentSchedule = () => {
    if (!formData.date) return null;
    const [year, month, day] = formData.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();
    return schedules.find(s => s.day_of_week === dayOfWeek) || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PRE-INSERT CHECK: Re-verify availability right before inserting to prevent race conditions
      const availableTimes = await getAvailableTimes();
      if (!availableTimes.includes(formData.time)) {
        toast.error('Este horario acaba de llenarse. Por favor selecciona otro.');
        setLoading(false);
        return;
      }

      const { getActiveTableConfigs, findSuitableTable, calculateTableAvailability } = await import('@/utils/reservationTableLogic');
      const currentSchedule = getCurrentSchedule();
      
      let tableConfigId: string | null = null;
      
      if (currentSchedule && globalTableConfigs.length > 0) {
        const activeConfigs = getActiveTableConfigs(currentSchedule, globalTableConfigs);
        
        if (activeConfigs.length > 0) {
          const { data: existingReservations } = await supabase
            .from('reservations')
            .select('reservation_time, party_size, table_config_id, duration_minutes')
            .eq('client_id', client?.id)
            .eq('reservation_date', formData.date)
            .in('status', ['pending', 'confirmed']);

          const slotStartMinutes = parseInt(formData.time.split(':')[0]) * 60 + 
                                   parseInt(formData.time.split(':')[1]);
          const slotEndMinutes = slotStartMinutes + (currentSchedule.duration_minutes || 120);

          const availableTables = calculateTableAvailability(
            activeConfigs,
            (existingReservations as any) || [],
            slotStartMinutes,
            slotEndMinutes
          );

          tableConfigId = findSuitableTable(parseInt(formData.partySize), availableTables);

          if (!tableConfigId) {
            toast.error(`No hay mesas disponibles para ${formData.partySize} personas en este horario. Por favor intenta otro horario o contáctanos directamente.`);
            setLoading(false);
            return;
          }
        }
      }

      const reservationData = {
        client_id: client?.id,
        reservation_date: formData.date,
        reservation_time: formData.time,
        party_size: parseInt(formData.partySize),
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        special_requests: formData.specialRequests || null,
        table_config_id: tableConfigId,
        duration_minutes: currentSchedule?.duration_minutes || 120,
        status: 'pending'
      };

      // Store local date and time (no timezone) to match DB schema and schedules
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select();

      if (error) {
        console.error('Reservation insert error:', error);
        throw error;
      }
      
      console.log('Reservation created successfully:', data);

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

  if (!client?.id) return null;

  const hasSchedules = schedules.length > 0;
  const availableDays = hasSchedules ? schedules.map(s => DAYS[s.day_of_week]).join(', ') : 'Próximamente';
  const currentSchedule = getCurrentSchedule();
  const partySize = parseInt(formData.partySize);
  const isPartySizeOutOfRange = currentSchedule && (
    partySize < currentSchedule.min_party_size || 
    partySize > currentSchedule.max_party_size
  );

  const shouldShowSpecialGroupsMessage = currentSchedule?.special_groups_enabled && isPartySizeOutOfRange && (
    (currentSchedule.special_groups_condition === 'bigger' && partySize > currentSchedule.max_party_size) ||
    (currentSchedule.special_groups_condition === 'smaller' && partySize < currentSchedule.min_party_size) ||
    (currentSchedule.special_groups_condition === 'both' && isPartySizeOutOfRange)
  );

  const getContactMethodMessage = () => {
    if (!currentSchedule || !shouldShowSpecialGroupsMessage) return null;
    
    const method = currentSchedule.special_groups_contact_method;
    const whatsapp = client?.whatsapp ? `${client.whatsapp_country_code}${client.whatsapp}` : null;
    const phone = client?.phone ? `${client.phone_country_code}${client.phone}` : null;

    if (method === 'whatsapp' && whatsapp) {
      return (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm">
          <p className="text-sm text-foreground/70 mb-2">
            {partySize < currentSchedule.min_party_size ? smallGroupMessage : largeGroupMessage}:
          </p>
          <a 
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm"
          >
            {contactWhatsappText}
          </a>
        </div>
      );
    }

    if (method === 'phone' && phone) {
      return (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm">
          <p className="text-sm text-foreground/70 mb-2">
            {partySize < currentSchedule.min_party_size ? smallGroupMessage : largeGroupMessage}:
          </p>
          <a 
            href={`tel:${phone}`}
            className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm"
          >
            {phone}
          </a>
        </div>
      );
    }

    if (method === 'both' && (whatsapp || phone)) {
      return (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm">
          <p className="text-sm text-foreground/70 mb-3">
            {partySize < currentSchedule.min_party_size ? smallGroupMessage : largeGroupMessage}:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm transition-colors text-sm"
              >
                {whatsappButtonText}
              </a>
            )}
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center px-4 py-2 border border-accent text-accent hover:bg-accent/10 rounded-sm transition-colors text-sm"
              >
                {callButtonText}
              </a>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              {(adminContent as any)?.reservation_label || 'Reservaciones'}
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {reservationTitle}
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/70 text-lg">
              {reservationDescription}
            </p>
          </div>

          {/* Reservation Form */}
          {hasSchedules ? (
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm tracking-wider uppercase text-foreground/70">
                    {dateLabel}
                  </Label>
                  <Select
                    value={formData.date}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, date: value, time: '' }))}
                    disabled={availableDates.length === 0}
                  >
                    <SelectTrigger id="date" className="bg-background border-border rounded-none">
                      <SelectValue placeholder={availableDates.length === 0 ? loadingDatesText : selectDatePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm tracking-wider uppercase text-foreground/70">
                    {timeLabel}
                  </Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                    disabled={!formData.date || availableTimes.length === 0}
                  >
                    <SelectTrigger id="time" className="bg-background border-border rounded-none">
                      <SelectValue placeholder={!formData.date ? selectDateFirstText : availableTimes.length === 0 ? noTimesAvailableText : selectTimePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Party Size */}
                <div className="space-y-2">
                  <Label htmlFor="partySize" className="text-sm tracking-wider uppercase text-foreground/70">
                    {partySizeLabel}
                  </Label>
                  <Input
                    id="partySize"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.partySize}
                    onChange={(e) => setFormData(prev => ({ ...prev, partySize: e.target.value }))}
                    className="bg-background border-border rounded-none"
                    required
                  />
                  {availableCapacity !== null && (
                    <p className="text-xs text-foreground/60">
                      {capacityAvailableText}: {availableCapacity} {personsText}
                    </p>
                  )}
                </div>

                {/* Special Groups Message */}
                {getContactMethodMessage()}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm tracking-wider uppercase text-foreground/70">
                    {nameLabel}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-background border-border rounded-none"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm tracking-wider uppercase text-foreground/70">
                    {emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-background border-border rounded-none"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm tracking-wider uppercase text-foreground/70">
                    {phoneLabel}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-background border-border rounded-none"
                    required
                  />
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="text-sm tracking-wider uppercase text-foreground/70">
                    {specialRequestsLabel}
                  </Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    className="bg-background border-border rounded-none min-h-[100px]"
                    placeholder={specialRequestsPlaceholder}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !formData.date || !formData.time || isPartySizeOutOfRange}
                  className="btn-primary w-full py-6 text-sm tracking-wider uppercase rounded-none"
                >
                  {loading ? loadingText : submitButtonText}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 text-center fade-in">
              <p className="text-foreground/70 mb-6">
                {systemConfiguringText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {client?.whatsapp && (
                  <Button 
                    className="btn-primary px-8 py-3 text-sm rounded-none tracking-wider uppercase"
                    onClick={() => {
                      const whatsappNumber = `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}`;
                      const message = (adminContent as any)?.whatsapp_reservation_message || 'Hola, me gustaría hacer una reserva';
                      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    {whatsappButtonText}
                  </Button>
                )}
                
                {client?.phone && (
                  <Button 
                    className="btn-ghost px-8 py-3 text-sm rounded-none tracking-wider uppercase"
                    onClick={() => {
                      const phoneNumber = `${client.phone_country_code || '+51'}${client.phone}`;
                      window.open(`tel:${phoneNumber}`, '_self');
                    }}
                  >
                    {callButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Available Days Info */}
          {hasSchedules && (
            <div className="mt-8 text-center text-sm text-foreground/60">
              <p>{availableDaysText}: {availableDays}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReservationBookingMinimalistic;
