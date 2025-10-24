import { useState, useEffect } from "react";

import { useClient } from "@/contexts/ClientContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageMetadata from "@/components/PageMetadata";

// Determine which components to use
import Navigation from "@/components/Navigation";
import NavigationMinimalistic from "@/components/NavigationMinimalistic";
import NavigationRustic from "@/components/NavigationRustic";
import Footer from "@/components/Footer";
import FooterMinimalistic from "@/components/FooterMinimalistic";
import FooterRustic from "@/components/FooterRustic";

const formSchema = z.object({
  personType: z.enum(["natural", "juridica"]),
  dni: z.string().optional(),
  ruc: z.string().optional(),
  businessName: z.string().optional(),
  fullName: z.string().min(1, "El nombre completo es obligatorio").max(100),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().optional(),
  address: z.string().optional(),
  purchaseAmount: z.string().optional(),
  productDescription: z.string().min(1, "La descripción es obligatoria").max(500),
  purchaseDate: z.string().min(1, "La fecha de compra es obligatoria"),
  claimType: z.enum(["reclamo", "queja"]),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  dataConsent: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar el tratamiento de datos personales",
  }),
}).refine(
  (data) => {
    if (data.personType === "natural") {
      return data.dni && data.dni.length > 0;
    }
    return true;
  },
  {
    message: "El DNI es obligatorio para personas naturales",
    path: ["dni"],
  }
).refine(
  (data) => {
    if (data.personType === "juridica") {
      return data.ruc && data.ruc.length > 0 && data.businessName && data.businessName.length > 0;
    }
    return true;
  },
  {
    message: "El RUC y Razón Social son obligatorios para personas jurídicas",
    path: ["ruc"],
  }
);

type FormValues = z.infer<typeof formSchema>;

const LibroReclamaciones = () => {
  const { client, clientSettings, loading } = useClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimCode, setClaimCode] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personType: "natural",
      dni: "",
      ruc: "",
      businessName: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      purchaseAmount: "",
      productDescription: "",
      purchaseDate: "",
      claimType: "reclamo",
      description: "",
      dataConsent: false,
    },
  });

  const personType = form.watch("personType");

  // Determine template - cast to access layout_type
  const template = (clientSettings as any)?.layout_type || "layout1";
  const NavComponent =
    template === "layout2"
      ? NavigationMinimalistic
      : template === "layout3"
      ? NavigationRustic
      : Navigation;
  const FooterComponent =
    template === "layout2"
      ? FooterMinimalistic
      : template === "layout3"
      ? FooterRustic
      : Footer;

  // Check if feature is enabled
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [reclamacionesEnabled, setReclamacionesEnabled] = useState(false);

  useEffect(() => {
    const checkPolicies = async () => {
      if (!client?.id) {
        setReclamacionesEnabled(true);
        setPoliciesLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("client_policies")
        .select("reclamaciones_enabled")
        .eq("client_id", client.id)
        .maybeSingle();

      if (error) {
        console.warn("Failed to read client_policies; defaulting reclamaciones to enabled:", error);
        setReclamacionesEnabled(true);
      } else {
        setReclamacionesEnabled(data?.reclamaciones_enabled ?? true);
      }
      setPoliciesLoading(false);
    };

    checkPolicies();
  }, [client?.id]);

  if (loading || policiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!reclamacionesEnabled) {
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-reclamacion", {
        body: {
          clientId: client?.id,
          ...values,
        },
      });

      if (error) throw error;

      setClaimCode(data.claimCode);
      setShowSuccess(true);
      form.reset();
      toast.success("Reclamación enviada exitosamente");
    } catch (error: any) {
      console.error("Error submitting claim:", error);
      toast.error("Error al enviar la reclamación. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewClaim = () => {
    setShowSuccess(false);
    setClaimCode(null);
    form.reset();
  };

  return (
    <>
      <PageMetadata
        pageType="home"
      />
      
      <div className="min-h-screen flex flex-col">
        <NavComponent />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <FileText className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Libro de Reclamaciones
                </h1>
                <p className="text-lg text-muted-foreground">
                  {client?.restaurant_name}
                </p>
              </div>
            </div>
          </section>

          {/* Info Section */}
          <section className="py-12 border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Información Legal:</strong> Este libro de reclamaciones está 
                    conforme a lo dispuesto en la Ley N.º 29571 del Código de Protección 
                    y Defensa del Consumidor. Su reclamación será atendida en un plazo 
                    máximo de <strong>30 días calendario</strong>.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {showSuccess ? (
                  <div className="space-y-6">
                    <div className="bg-success/10 border border-success rounded-lg p-8 text-center">
                      <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success" />
                      <h2 className="text-2xl font-bold mb-4">
                        ¡Reclamación Enviada Exitosamente!
                      </h2>
                      <div className="bg-background rounded-lg p-6 mb-6">
                        <p className="text-sm text-muted-foreground mb-2">
                          Su Código de Reclamación:
                        </p>
                        <p className="text-3xl font-bold font-mono tracking-wider text-primary">
                          {claimCode}
                        </p>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Hemos enviado una copia de su reclamación a su correo electrónico. 
                        Por favor, conserve su código de reclamación para darle seguimiento.
                      </p>
                      <p className="text-sm text-muted-foreground mb-8">
                        Recibirá una respuesta en un plazo máximo de <strong>30 días calendario</strong>.
                      </p>
                      <Button onClick={handleNewClaim} size="lg">
                        Enviar Otra Reclamación
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Personal/Business Info */}
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Información Personal</h2>

                        <FormField
                          control={form.control}
                          name="personType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Persona *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="natural" id="natural" />
                                    <label htmlFor="natural" className="cursor-pointer">
                                      Persona Natural
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="juridica" id="juridica" />
                                    <label htmlFor="juridica" className="cursor-pointer">
                                      Persona Jurídica
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {personType === "natural" && (
                          <FormField
                            control={form.control}
                            name="dni"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>DNI *</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345678" maxLength={8} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {personType === "juridica" && (
                          <>
                            <FormField
                              control={form.control}
                              name="ruc"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>RUC *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="20123456789" maxLength={11} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="businessName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Razón Social *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Empresa S.A.C." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombres y Apellidos *</FormLabel>
                              <FormControl>
                                <Input placeholder="Juan Pérez García" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Información de Contacto</h2>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="ejemplo@correo.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono (Opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="987654321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección (Opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Av. Principal 123, Lima" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Purchase Details */}
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Detalles de la Compra</h2>

                        <FormField
                          control={form.control}
                          name="purchaseAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monto de la Compra (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="50.00"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="productDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Producto o Servicio *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Plato de ceviche, servicio de delivery, etc."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="purchaseDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Compra *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Claim Details */}
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Detalle de la Reclamación</h2>

                        <FormField
                          control={form.control}
                          name="claimType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Reclamación *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="reclamo">
                                    Reclamo - Disconformidad con el producto o servicio
                                  </SelectItem>
                                  <SelectItem value="queja">
                                    Queja - Disconformidad con la atención
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción del Reclamo o Queja *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describa detalladamente su reclamo o queja..."
                                  className="min-h-[150px] resize-none"
                                  maxLength={500}
                                  {...field}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground text-right">
                                {field.value?.length || 0}/500 caracteres
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Data Consent */}
                      <FormField
                        control={form.control}
                        name="dataConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                Acepto el tratamiento de mis datos personales de acuerdo con 
                                la política de privacidad para atender mi reclamación conforme 
                                a la Ley N.º 29733 de Protección de Datos Personales. *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-center pt-6">
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="mr-2"><LoadingSpinner /></div>
                              Enviando...
                            </>
                          ) : (
                            "Enviar Reclamación"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </section>
        </main>

        <FooterComponent />
      </div>
    </>
  );
};

export default LibroReclamaciones;
