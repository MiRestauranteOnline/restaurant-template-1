import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface CustomerConfirmationProps {
  restaurantName: string;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
}

export const CustomerConfirmation = ({
  restaurantName,
  customerName,
  reservationDate,
  reservationTime,
  partySize,
  specialRequests,
}: CustomerConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Confirmación de Reserva - {restaurantName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>¡Reserva Solicitada!</Heading>
        
        <Text style={text}>
          Hola {customerName},
        </Text>
        
        <Text style={text}>
          Hemos recibido tu solicitud de reserva en <strong>{restaurantName}</strong>.
        </Text>

        <Section style={detailsBox}>
          <Text style={detailLabel}>📅 Fecha:</Text>
          <Text style={detailValue}>{reservationDate}</Text>
          
          <Text style={detailLabel}>🕐 Hora:</Text>
          <Text style={detailValue}>{reservationTime}</Text>
          
          <Text style={detailLabel}>👥 Personas:</Text>
          <Text style={detailValue}>{partySize}</Text>
          
          {specialRequests && (
            <>
              <Text style={detailLabel}>📝 Solicitudes Especiales:</Text>
              <Text style={detailValue}>{specialRequests}</Text>
            </>
          )}
        </Section>

        <Hr style={hr} />

        <Text style={text}>
          Te contactaremos pronto para confirmar tu reserva.
        </Text>

        <Text style={footer}>
          Saludos,<br />
          {restaurantName}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CustomerConfirmation;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0 4px 0',
};

const detailValue = {
  color: '#111827',
  fontSize: '16px',
  margin: '0 0 12px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 40px',
};
