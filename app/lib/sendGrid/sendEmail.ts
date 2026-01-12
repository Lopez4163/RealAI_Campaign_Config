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

// ✅ ADD THIS (new)
export async function sendPdfEmail(to: string, pdfBuffer: Buffer) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
  }

  const base64Pdf = pdfBuffer.toString("base64");

  const msg = {
    to,
    from: 'adlopez034@gmail.com',
    subject: 'Your REAL.AI Campaign PDF is ready ✅',
    text: 'Attached is your REAL.AI Campaign PDF.',
    html: `<p>Attached is your <strong>REAL.AI Campaign PDF</strong>.</p>`,
    attachments: [
      {
        content: base64Pdf,
        filename: "realai-campaign.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await sgMail.send(msg as any);
    console.log(`✅ PDF email sent to ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ SendGrid PDF error:', error?.response?.body || error);
    throw error;
  }
}
