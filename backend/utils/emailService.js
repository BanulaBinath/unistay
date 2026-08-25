const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  };

  console.log('📧 Email transporter config:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    passwordSet: !!config.auth.pass && config.auth.pass !== 'your_app_password_here'
  });

  return nodemailer.createTransport(config);
};

// Send OTP email
const sendOTPEmail = async (email, otp, fullName) => {
  console.log(`\n📧 Attempting to send OTP email to: ${email}`);
  
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
        process.env.EMAIL_USER === 'your_email@gmail.com' ||
        process.env.EMAIL_PASSWORD === 'your_app_password_here') {
      const error = new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file.');
      error.code = 'EMAIL_NOT_CONFIGURED';
      console.error('❌ Email not configured. OTP for testing:', otp);
      throw error;
    }

    const transporter = createTransporter();

    // Verify SMTP connection
    console.log('🔍 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError.message);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    const mailOptions = {
      from: `"Unistay Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Unistay Account - OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-top: 20px; }
            .otp-box { background-color: #dbeafe; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Unistay</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Thank you for registering with Unistay! To complete your registration, please verify your email address using the OTP below:</p>
              <div class="otp-box">${otp}</div>
              <p><strong>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</strong></p>
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Unistay. All rights reserved.</p>
              <p>SLIIT Student Support Services</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📤 Sending email...');
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ OTP Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('\n❌ Failed to send OTP email');
    console.error('   Error type:', error.code || error.name);
    console.error('   Error message:', error.message);
    console.error('   Full error:', error);
    console.error(`   OTP for manual testing: ${otp}\n`);
    throw error;
  }
};

// Send welcome email after successful activation
const sendWelcomeEmail = async (email, fullName, role) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Unistay Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Unistay - Account Activated',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Unistay!</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Your account has been successfully activated! You now have full access to all Unistay services.</p>
              <p>You can now log in and start exploring our platform.</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Unistay. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error, as this is not critical
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};
