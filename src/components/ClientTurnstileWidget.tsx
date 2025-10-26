import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';

interface ClientTurnstileWidgetProps {
  clientId: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function ClientTurnstileWidget({
  clientId,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
}: ClientTurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Fetch site key for this client
  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('turnstile_site_key')
          .eq('id', clientId)
          .single();

        if (fetchError) throw fetchError;

        if (!(data as any)?.turnstile_site_key) {
          setError('Configuración de seguridad no encontrada');
          setLoading(false);
          return;
        }

        setSiteKey((data as any).turnstile_site_key);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Turnstile site key:', err);
        setError('Error al cargar verificación de seguridad');
        setLoading(false);
      }
    };

    if (clientId) {
      fetchSiteKey();
    }
  }, [clientId]);

  // Render Turnstile widget
  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    // Wait for Turnstile script to load
    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) {
        setTimeout(renderWidget, 100);
        return;
      }

      try {
        // Remove previous widget if exists
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }

        // Render new widget
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token: string) => {
            console.log('✅ Turnstile verification successful');
            onVerify(token);
          },
          'error-callback': () => {
            console.error('❌ Turnstile verification error');
            setError('Error en la verificación de seguridad');
            onError?.();
          },
          'expired-callback': () => {
            console.warn('⏰ Turnstile token expired');
            onExpire?.();
          },
        });
      } catch (err) {
        console.error('Error rendering Turnstile:', err);
        setError('Error al inicializar verificación');
      }
    };

    renderWidget();

    // Cleanup
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (err) {
          console.error('Error removing Turnstile widget:', err);
        }
      }
    };
  }, [siteKey, theme, size, onVerify, onError, onExpire]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Shield className="h-4 w-4 animate-pulse" />
        <span className="text-sm">Cargando verificación de seguridad...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={containerRef} />
    </div>
  );
}
