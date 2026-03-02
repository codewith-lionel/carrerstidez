const { sendEmail } = require('../utils/email');

exports.sendWelcomeEmail = async (email, name) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to CAREERSTIDEZ!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to CAREERSTIDEZ!</h1>
        <p>Hi ${name},</p>
        <p>Your account has been created successfully. Start exploring thousands of job opportunities and study abroad programs worldwide.</p>
        <p>Best regards,<br/>The CAREERSTIDEZ Team</p>
      </div>
    `,
    text: `Welcome to CAREERSTIDEZ, ${name}! Your account has been created successfully.`,
  });
};

exports.sendApplicationConfirmation = async (email, name, jobTitle, companyName) => {
  await sendEmail({
    to: email,
    subject: `Application Submitted: ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
        <p>We'll notify you when there's an update on your application.</p>
        <p>Best regards,<br/>The CAREERSTIDEZ Team</p>
      </div>
    `,
    text: `Hi ${name}, your application for ${jobTitle} at ${companyName} has been submitted.`,
  });
};

exports.sendStatusUpdateEmail = async (email, name, jobTitle, status) => {
  const statusMessages = {
    reviewed: 'Your application has been reviewed by the recruiter.',
    shortlisted: 'Congratulations! You have been shortlisted for this position.',
    interviewed: 'You have been invited for an interview. The recruiter will contact you shortly.',
    offered: 'Congratulations! You have received a job offer.',
    rejected: 'We regret to inform you that your application was not successful this time.',
  };
  await sendEmail({
    to: email,
    subject: `Application Update: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Status Update</h2>
        <p>Hi ${name},</p>
        <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status.toUpperCase()}</strong></p>
        <p>${statusMessages[status] || 'Your application status has been updated.'}</p>
        <p>Best regards,<br/>The CAREERSTIDEZ Team</p>
      </div>
    `,
    text: `Hi ${name}, your application for ${jobTitle} status: ${status}.`,
  });
};
