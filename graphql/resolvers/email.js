const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ email, message }) => {
  try {
    const msg = {
      to: process.env.CAPAZY_EMAIL,
      from: email,
      templateId: 'd-d27c29369c6b4eac92f8343363990bfc',
      dynamic_template_data: {
        subject: 'Help',
        body: message,
      },
    };
    const res = await sgMail.send(msg);
    const { statusCode } = res[0];
    const result = { status: statusCode };
    return result;
  } catch (error) {
    throw error;
  }
};

const sendAdminEmail = async ({ email, subject, message }) => {
  try {
    const msg = {
      to: email,
      from: process.env.CAPAZY_EMAIL,
      templateId: 'd-1d8648e46f5345e8bde93d2df5d191c1',
      dynamic_template_data: {
        subject: subject,
        body: message,
      },
    };
    const res = await sgMail.send(msg);
    const { statusCode } = res[0];
    const result = { status: statusCode };
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmail, sendAdminEmail };
