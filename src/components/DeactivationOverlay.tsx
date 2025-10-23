import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DeactivationOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            Este sitio web está desactivado
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Si este es tu sitio web y crees que esto es un error, por favor contáctanos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            asChild 
            size="lg"
            className="w-full"
          >
            <a href="mailto:soporte@mirestaurante.online">
              Contactar Soporte
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
