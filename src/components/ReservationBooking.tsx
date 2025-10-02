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
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function ReservationBooking() {
  const { client } = useClient();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
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

  const fetchSchedules = async () => {
    if (!client?.id) return;
    
    const { data, error } = await supabase
      .from('reservation_schedules')
      .select('*')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .order('day_of_week')
      .order('start_time');

    if (!error && data) {
      setSchedules(data);
    }
  };

  const getAvailableTimes = () => {
    if (!formData.date) return [];
    
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
    
    if (!schedule) return [];

    const times = [];
    const start = parseInt(schedule.start_time.split(':')[0]);
    const end = parseInt(schedule.end_time.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return times;
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

  if (schedules.length === 0) return null;

  const availableDays = schedules.map(s => DAYS[s.day_of_week]).join(', ');

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
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
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
                    {getAvailableTimes().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <Calendar className="mr-2 h-5 w-5" />
              {loading ? 'Enviando...' : 'Solicitar Reserva'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
