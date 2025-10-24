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

interface CustomerConfirmationTemplateProps {
  restaurantName: string;
  claimCode: string;
  claimData: any;
  restaurantEmail: string;
}

export const CustomerConfirmationTemplate = ({
  restaurantName,
  claimCode,
  claimData,
  restaurantEmail,
}: CustomerConfirmationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Confirmación de Reclamación - {claimCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirmación de Reclamación</Heading>
        
        <Text style={text}>
          Estimado(a) <strong>{claimData.fullName}</strong>,
        </Text>

        <Text style={text}>
          Hemos recibido su reclamación en el Libro de Reclamaciones de{" "}
          <strong>{restaurantName}</strong>.
        </Text>

        <Section style={codeBox}>
          <Text style={codeLabel}>Su Código de Reclamación:</Text>
          <Text style={code}>{claimCode}</Text>
          <Text style={codeNote}>
            Por favor, conserve este código para darle seguimiento a su reclamación.
          </Text>
        </Section>

        <Section style={importantBox}>
          <Text style={importantText}>
            📋 <strong>Plazo de Respuesta:</strong> Recibirá una respuesta a su 
            reclamación en un plazo máximo de 30 días calendario, conforme a lo 
            establecido en la Ley N.º 29571 del Código de Protección y Defensa 
            del Consumidor.
          </Text>
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Resumen de su Reclamación</Heading>

        <Text style={text}>
          <strong>Tipo de Reclamación:</strong>{" "}
          {claimData.claimType === "reclamo" ? "Reclamo" : "Queja"}
        </Text>

        <Text style={text}>
          <strong>Producto/Servicio:</strong> {claimData.productDescription}
        </Text>

        <Text style={text}>
          <strong>Fecha de Compra:</strong> {claimData.purchaseDate}
        </Text>

        {claimData.purchaseAmount && (
          <Text style={text}>
            <strong>Monto:</strong> S/ {claimData.purchaseAmount}
          </Text>
        )}

        <Section style={descriptionBox}>
          <Text style={descriptionLabel}>Descripción de su Reclamación:</Text>
          <Text style={description}>{claimData.description}</Text>
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Información de Contacto</Heading>

        <Text style={text}>
          Si tiene alguna consulta sobre su reclamación, puede contactarnos a:
        </Text>

        <Text style={contactText}>
          📧 Email: {restaurantEmail}
        </Text>

        <Hr style={hr} />

        <Section style={infoBox}>
          <Heading style={h3}>¿Qué es una Reclamación y una Queja?</Heading>
          
          <Text style={smallText}>
            <strong>Reclamo:</strong> Disconformidad relacionada a los productos o 
            servicios adquiridos.
          </Text>
          
          <Text style={smallText}>
            <strong>Queja:</strong> Disconformidad no relacionada a los productos o 
            servicios, sino a la atención al público.
          </Text>
        </Section>

        <Text style={footer}>
          Este correo fue generado automáticamente desde el Libro de Reclamaciones 
          de {restaurantName}. Por favor, no responda directamente a este correo.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CustomerConfirmationTemplate;

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

const h3 = {
  color: "#333333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
  padding: "0",
};

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 20px",
};

const smallText = {
  color: "#555555",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "8px 0",
};

const contactText = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 20px",
  fontFamily: "monospace",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 20px",
};

const codeBox = {
  background: "#f0f7ff",
  borderRadius: "8px",
  border: "2px solid #4a90e2",
  margin: "20px 20px",
  padding: "20px",
  textAlign: "center" as const,
};

const codeLabel = {
  color: "#4a90e2",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const code = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  letterSpacing: "3px",
  margin: "8px 0",
  fontFamily: "monospace",
};

const codeNote = {
  color: "#666666",
  fontSize: "12px",
  margin: "12px 0 0 0",
  fontStyle: "italic",
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
  background: "#e8f5e9",
  borderLeft: "4px solid #4caf50",
  borderRadius: "4px",
  margin: "20px 20px",
  padding: "15px",
};

const importantText = {
  color: "#2e7d32",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const infoBox = {
  background: "#f5f5f5",
  borderRadius: "6px",
  margin: "20px 20px",
  padding: "20px",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "32px 20px 20px",
  textAlign: "center" as const,
};
