import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface RestaurantEmailTemplateProps {
  restaurantName: string;
  claimCode: string;
  claimData: any;
  submittedAt: string;
}

export const RestaurantEmailTemplate = ({
  restaurantName,
  claimCode,
  claimData,
  submittedAt,
}: RestaurantEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Nueva reclamación recibida - {claimCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nueva Reclamación Recibida</Heading>
        
        <Text style={text}>
          Se ha registrado una nueva reclamación en el Libro de Reclamaciones de <strong>{restaurantName}</strong>.
        </Text>

        <Section style={codeBox}>
          <Text style={codeLabel}>Código de Reclamación:</Text>
          <Text style={code}>{claimCode}</Text>
        </Section>

        <Text style={text}>
          <strong>Fecha y Hora de Envío:</strong> {submittedAt}
        </Text>

        <Hr style={hr} />

        <Heading style={h2}>Información del Reclamante</Heading>
        
        <Text style={text}>
          <strong>Tipo de Persona:</strong>{" "}
          {claimData.personType === "natural" ? "Natural" : "Jurídica"}
        </Text>

        {claimData.personType === "natural" && claimData.dni && (
          <Text style={text}>
            <strong>DNI:</strong> {claimData.dni}
          </Text>
        )}

        {claimData.personType === "juridica" && (
          <>
            <Text style={text}>
              <strong>RUC:</strong> {claimData.ruc}
            </Text>
            <Text style={text}>
              <strong>Razón Social:</strong> {claimData.businessName}
            </Text>
          </>
        )}

        <Text style={text}>
          <strong>Nombre Completo:</strong> {claimData.fullName}
        </Text>

        <Hr style={hr} />

        <Heading style={h2}>Información de Contacto</Heading>

        <Text style={text}>
          <strong>Email:</strong> {claimData.email}
        </Text>

        {claimData.phone && (
          <Text style={text}>
            <strong>Teléfono:</strong> {claimData.phone}
          </Text>
        )}

        {claimData.address && (
          <Text style={text}>
            <strong>Dirección:</strong> {claimData.address}
          </Text>
        )}

        <Hr style={hr} />

        <Heading style={h2}>Detalles de la Compra</Heading>

        {claimData.purchaseAmount && (
          <Text style={text}>
            <strong>Monto:</strong> S/ {claimData.purchaseAmount}
          </Text>
        )}

        <Text style={text}>
          <strong>Producto/Servicio:</strong> {claimData.productDescription}
        </Text>

        <Text style={text}>
          <strong>Fecha de Compra:</strong> {claimData.purchaseDate}
        </Text>

        <Hr style={hr} />

        <Heading style={h2}>Detalle de la Reclamación</Heading>

        <Text style={text}>
          <strong>Tipo:</strong>{" "}
          {claimData.claimType === "reclamo" ? "Reclamo" : "Queja"}
        </Text>

        <Section style={descriptionBox}>
          <Text style={descriptionLabel}>Descripción:</Text>
          <Text style={description}>{claimData.description}</Text>
        </Section>

        <Hr style={hr} />

        <Section style={importantBox}>
          <Text style={importantText}>
            ⚠️ <strong>IMPORTANTE:</strong> Tiene un plazo de 30 días calendario 
            para dar respuesta a esta reclamación según la Ley N.º 29571 del 
            Código de Protección y Defensa del Consumidor.
          </Text>
        </Section>

        <Text style={footer}>
          Este correo fue generado automáticamente desde el Libro de Reclamaciones 
          de {restaurantName}.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default RestaurantEmailTemplate;

const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 20px 20px",
  padding: "0",
};

const h2 = {
  color: "#333333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 20px 10px",
  padding: "0",
};

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 20px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 20px",
};

const codeBox = {
  background: "#f4f4f4",
  borderRadius: "8px",
  border: "2px solid #e1e1e1",
  margin: "20px 20px",
  padding: "20px",
  textAlign: "center" as const,
};

const codeLabel = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const code = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "2px",
  margin: "0",
  fontFamily: "monospace",
};

const descriptionBox = {
  background: "#f9f9f9",
  borderRadius: "6px",
  border: "1px solid #e1e1e1",
  margin: "10px 20px",
  padding: "15px",
};

const descriptionLabel = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const description = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const importantBox = {
  background: "#fff3cd",
  borderLeft: "4px solid #ffc107",
  borderRadius: "4px",
  margin: "20px 20px",
  padding: "15px",
};

const importantText = {
  color: "#856404",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "32px 20px 20px",
  textAlign: "center" as const,
};
