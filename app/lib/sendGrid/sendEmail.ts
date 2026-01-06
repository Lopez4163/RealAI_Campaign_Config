import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);


export async function sendTestEmail(to: string) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
  }
  console.log('emailTS', to)
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
