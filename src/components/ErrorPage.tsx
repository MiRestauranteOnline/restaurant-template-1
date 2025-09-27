import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-heading font-light mb-4 text-foreground">
          Restaurante No Encontrado
        </h1>
        <p className="text-foreground/70 mb-6">
          Lo sentimos, no pudimos encontrar este restaurante. Verifica que la URL sea correcta.
        </p>
        <p className="text-sm text-foreground/50 mb-8">
          Error: {error}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Intentar Nuevamente
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;