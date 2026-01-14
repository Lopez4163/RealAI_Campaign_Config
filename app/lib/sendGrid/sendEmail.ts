import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendTestEmail(to: string) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
  }
  console.log('emailTS', to);

  const msg = {
    to,
    from: 'adlopez034@gmail.com',
    subject: 'Your REAL.AI Campaign Results are inside 🚀',
    text: 'This is a test email sent using SendGrid.',
    html: `<p><strong>This is a test email</strong> sent using SendGrid.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Test email sent to ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ SendGrid error:', error?.response?.body || error);
    throw error;
  }
}


sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

type PdfTemplateData = {
  // Match whatever you used in the template:
  // e.g. {{recipientName}}, {{supportEmail}}, etc.
  recipientName?: string;
  supportEmail?: string;
};

export async function sendPdfEmail(
  to: string,
  pdfBuffer: Buffer,
  templateData: PdfTemplateData = {}
) {
  if (!process.env.SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not set");
  if (!process.env.SENDGRID_PDF_TEMPLATE_ID) {
    throw new Error("SENDGRID_PDF_TEMPLATE_ID is not set");
  }

  const base64Pdf = pdfBuffer.toString("base64");

  const msg = {
    to,
    from: "adlopez034@gmail.com",
    templateId: process.env.SENDGRID_PDF_TEMPLATE_ID,
    dynamicTemplateData: {
      ...templateData,
      // You can also pass constants here if you want:
      // subject: "Your REAL.AI Campaign PDF is ready ✅",
    },
    attachments: [
      {
        content: base64Pdf,
        filename: "realai-campaign.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg as any);
  return { success: true };
}
