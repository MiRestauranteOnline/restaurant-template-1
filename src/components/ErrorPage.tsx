import React from 'react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';

interface ErrorPageProps {
  error: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const { adminContent } = useClient();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-heading font-light mb-4 text-foreground">
          {(adminContent as any)?.error_label || 'Restaurante No Encontrado'}
        </h1>
        <p className="text-foreground/70 mb-6">
          Lo sentimos, no pudimos encontrar este restaurante. Verifica que la URL sea correcta.
        </p>
        <p className="text-sm text-foreground/50 mb-8">
          {(adminContent as any)?.error_label || 'Error'}: {error}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          {(adminContent as any)?.try_again_label || 'Intentar Nuevamente'}
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;