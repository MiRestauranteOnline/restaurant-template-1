// Simple HTML email templates without React dependencies

interface RestaurantEmailProps {
  restaurantName: string;
  claimCode: string;
  claimData: any;
  submittedAt: string;
}

export function generateRestaurantEmail({
  restaurantName,
  claimCode,
  claimData,
  submittedAt,
}: RestaurantEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Reclamación</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f6f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 20px 20px;">
        <h1 style="color: #1a1a1a; font-size: 28px; font-weight: bold; margin: 0;">Nueva Reclamación Recibida</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 20px;">
        <p style="color: #333333; font-size: 14px; line-height: 24px;">
          Se ha registrado una nueva reclamación en el Libro de Reclamaciones de <strong>${restaurantName}</strong>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <div style="background: #f0f7ff; border-radius: 8px; border: 2px solid #4a90e2; padding: 20px; text-align: center;">
          <p style="color: #4a90e2; font-size: 12px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">Código de Reclamación:</p>
          <p style="color: #1a1a1a; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 0; font-family: monospace;">${claimCode}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 20px;">
        <p style="color: #333333; font-size: 14px;"><strong>Fecha y Hora:</strong> ${submittedAt}</p>
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 20px 0 10px;">Información del Reclamante</h2>
        <p style="color: #333333; font-size: 14px;"><strong>Tipo:</strong> ${claimData.personType === "natural" ? "Natural" : "Jurídica"}</p>
        ${claimData.dni ? `<p style="color: #333333; font-size: 14px;"><strong>DNI:</strong> ${claimData.dni}</p>` : ''}
        ${claimData.ruc ? `<p style="color: #333333; font-size: 14px;"><strong>RUC:</strong> ${claimData.ruc}</p>` : ''}
        ${claimData.businessName ? `<p style="color: #333333; font-size: 14px;"><strong>Razón Social:</strong> ${claimData.businessName}</p>` : ''}
        <p style="color: #333333; font-size: 14px;"><strong>Nombre:</strong> ${claimData.fullName}</p>
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 20px 0 10px;">Contacto</h2>
        <p style="color: #333333; font-size: 14px;"><strong>Email:</strong> ${claimData.email}</p>
        ${claimData.phone ? `<p style="color: #333333; font-size: 14px;"><strong>Teléfono:</strong> ${claimData.phone}</p>` : ''}
        ${claimData.address ? `<p style="color: #333333; font-size: 14px;"><strong>Dirección:</strong> ${claimData.address}</p>` : ''}
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 20px 0 10px;">Detalles de la Compra</h2>
        ${claimData.purchaseAmount ? `<p style="color: #333333; font-size: 14px;"><strong>Monto:</strong> S/ ${claimData.purchaseAmount}</p>` : ''}
        <p style="color: #333333; font-size: 14px;"><strong>Producto/Servicio:</strong> ${claimData.productDescription}</p>
        <p style="color: #333333; font-size: 14px;"><strong>Fecha de Compra:</strong> ${claimData.purchaseDate}</p>
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 20px 0 10px;">Reclamación</h2>
        <p style="color: #333333; font-size: 14px;"><strong>Tipo:</strong> ${claimData.claimType === "reclamo" ? "Reclamo" : "Queja"}</p>
        <div style="background: #f9f9f9; border-radius: 6px; border: 1px solid #e1e1e1; padding: 15px; margin: 10px 0;">
          <p style="color: #666666; font-size: 12px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">Descripción:</p>
          <p style="color: #333333; font-size: 14px; line-height: 22px; margin: 0; white-space: pre-wrap;">${claimData.description}</p>
        </div>
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; padding: 15px; margin: 20px 0;">
          <p style="color: #856404; font-size: 14px; line-height: 22px; margin: 0;">
            ⚠️ <strong>IMPORTANTE:</strong> Tiene 30 días calendario para responder según la Ley N.º 29571.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 20px 20px; text-align: center;">
        <p style="color: #898989; font-size: 12px; line-height: 18px;">
          Este correo fue generado automáticamente desde el Libro de Reclamaciones de ${restaurantName}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

interface CustomerEmailProps {
  restaurantName: string;
  claimCode: string;
  claimData: any;
  restaurantEmail: string;
}

export function generateCustomerEmail({
  restaurantName,
  claimCode,
  claimData,
  restaurantEmail,
}: CustomerEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reclamación</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f6f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 20px 20px;">
        <h1 style="color: #1a1a1a; font-size: 28px; font-weight: bold; margin: 0;">Confirmación de Reclamación</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 20px;">
        <p style="color: #333333; font-size: 14px; line-height: 24px;">
          Estimado(a) <strong>${claimData.fullName}</strong>,
        </p>
        <p style="color: #333333; font-size: 14px; line-height: 24px;">
          Hemos recibido su reclamación en el Libro de Reclamaciones de <strong>${restaurantName}</strong>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <div style="background: #f0f7ff; border-radius: 8px; border: 2px solid #4a90e2; padding: 20px; text-align: center;">
          <p style="color: #4a90e2; font-size: 12px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">Su Código de Reclamación:</p>
          <p style="color: #1a1a1a; font-size: 28px; font-weight: bold; letter-spacing: 3px; margin: 8px 0; font-family: monospace;">${claimCode}</p>
          <p style="color: #666666; font-size: 12px; margin: 12px 0 0 0; font-style: italic;">
            Por favor, conserve este código para darle seguimiento a su reclamación.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; padding: 15px;">
          <p style="color: #2e7d32; font-size: 14px; line-height: 22px; margin: 0;">
            📋 <strong>Plazo de Respuesta:</strong> Recibirá una respuesta en un plazo máximo de 30 días calendario, conforme a la Ley N.º 29571.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 20px;">
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 20px 0 10px;">Resumen de su Reclamación</h2>
        <p style="color: #333333; font-size: 14px;"><strong>Tipo:</strong> ${claimData.claimType === "reclamo" ? "Reclamo" : "Queja"}</p>
        <p style="color: #333333; font-size: 14px;"><strong>Producto/Servicio:</strong> ${claimData.productDescription}</p>
        <p style="color: #333333; font-size: 14px;"><strong>Fecha de Compra:</strong> ${claimData.purchaseDate}</p>
        ${claimData.purchaseAmount ? `<p style="color: #333333; font-size: 14px;"><strong>Monto:</strong> S/ ${claimData.purchaseAmount}</p>` : ''}
        <div style="background: #f9f9f9; border-radius: 6px; border: 1px solid #e1e1e1; padding: 15px; margin: 10px 0;">
          <p style="color: #666666; font-size: 12px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">Descripción:</p>
          <p style="color: #333333; font-size: 14px; line-height: 22px; margin: 0; white-space: pre-wrap;">${claimData.description}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 20px 0 10px;">Contacto</h2>
        <p style="color: #333333; font-size: 14px;">Si tiene consultas, puede contactarnos a:</p>
        <p style="color: #333333; font-size: 14px; font-family: monospace;">📧 ${restaurantEmail}</p>
        <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        <div style="background: #f5f5f5; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333333; font-size: 16px; font-weight: bold; margin: 0 0 12px 0;">¿Qué es una Reclamación y una Queja?</h3>
          <p style="color: #555555; font-size: 13px; line-height: 20px; margin: 8px 0;">
            <strong>Reclamo:</strong> Disconformidad relacionada a los productos o servicios adquiridos.
          </p>
          <p style="color: #555555; font-size: 13px; line-height: 20px; margin: 8px 0;">
            <strong>Queja:</strong> Disconformidad no relacionada a los productos o servicios, sino a la atención al público.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 20px 20px; text-align: center;">
        <p style="color: #898989; font-size: 12px; line-height: 18px;">
          Este correo fue generado automáticamente. Por favor, no responda directamente a este correo.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
