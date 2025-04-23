const nodemailer = require("nodemailer");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Shiftly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Shiftly",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://i.postimg.cc/G2yrJXk9/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p style="color: #555;">Welcome to <strong>Shiftly – A Seamless Transport System!</strong></p>
            <p style="color: #555;">To complete your registration and start booking your transport seamlessly, please verify your email address. The OTP is valid for only 10 minutes.</p>
            <div style="background: #ff4444; padding: 7px; border-radius: 5px; font-size: 24px; font-weight: bold; color: #fff; margin: 20px 0;">
                ${otp}
            </div>
            <p style="color: #555; margin-top: 20px;">If you didn't create an account with Shiftly, you can safely ignore this email.</p>
            <p style="color: #999; font-size: 12px;">Thanks, <br> <strong>Shiftly Team</strong></p>
          </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send welcome email
const sendWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: `"Shiftly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Shiftly!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://i.postimg.cc/G2yrJXk9/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
            <h2 style="color: #333;">Welcome to Shiftly, ${fullName}!</h2>
            <p style="color: #555;">We're thrilled to have you on board. <strong>Shiftly</strong> is your go-to platform for seamless transportation of goods across India.</p>
            <p style="color: #555;">🚚 <strong>What's Next?</strong></p>
            <ul style="text-align: left; color: #555; margin-left: 20px;">
                <li>Log in to your account: <a href="${process.env.FRONTEND_URL}/login" style="color: #ff4444; text-decoration: none;">Login to Shiftly</a></li>
                <li>Book your first transport</li>
                <li>Track your shipments in real time</li>
            </ul>
            <p style="color: #555;">Need help? Our support team is ready to assist you anytime. Just reach out at <a href="mailto:support@shiftly.in" style="color: #ff4444; text-decoration: none;">support@shiftly.in</a>.</p>
            <p style="color: #999; font-size: 12px;">Happy transporting! <br> <strong>Shiftly Team</strong></p>
        </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, fullName, resetLink) => {
  const mailOptions = {
    from: `"Shiftly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - Shiftly",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <img src="https://i.postimg.cc/G2yrJXk9/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
          <h2 style="color: #333;">Reset Your Password, ${fullName}</h2>
          <p style="color: #555;">We received a request to reset your password for your Shiftly account.</p>
          <p style="color: #555;">Click the button below to set a new password. This link will expire in 30 minutes.</p>
          <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 12px 25px; background: #ff4444; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
          <p style="color: #888; margin-top: 20px;">If you didn't request this, you can ignore this email.</p>
          <p style="color: #999; font-size: 12px;">Happy transporting! <br> <strong>Shiftly Team</strong></p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Add this new function for driver OTP
const sendDriverOTPEmail = async (email, otp, fullName) => {
  try {
    const mailOptions = {
      from: `"Shiftly" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Driver Account - Shiftly",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <img src="https://i.postimg.cc/G2yrJXk9/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
              <h2 style="color: #333;">Welcome to Shiftly Driver Community!</h2>
              <p style="color: #555;">Hello ${fullName},</p>
              <p style="color: #555;">Thank you for choosing to join our driver network. To complete your registration and start accepting deliveries, please verify your email address using the OTP below:</p>
              <div style="background: #ff4444; padding: 10px 20px; border-radius: 5px; font-size: 28px; font-weight: bold; color: #fff; margin: 20px auto; max-width: 200px;">
                  ${otp}
              </div>
              <p style="color: #555; font-size: 14px;">This OTP will expire in 10 minutes for security purposes.</p>
              <div style="margin: 30px 0; padding: 20px; background-color: #f8f8f8; border-radius: 5px;">
                  <p style="color: #666; font-size: 14px; margin: 0;">
                      <strong>Next Steps:</strong><br>
                      1. Enter this OTP to verify your email<br>
                      2. Complete your driver profile<br>
                      3. Start accepting delivery requests
                  </p>
              </div>
              <p style="color: #888; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">
                  Need help? Contact our support team at<br>
                  <a href="mailto:support@shiftly.in" style="color: #ff4444; text-decoration: none;">support@shiftly.in</a>
              </p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email verification code");
  }
};

// Add this function for driver welcome email
const sendDriverWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: `"Shiftly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Shiftly Driver Community!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <img src="https://i.postimg.cc/G2yrJXk9/Shiftly-logo.png" alt="Shiftly Logo" style="width: 120px; margin: 0 auto 20px; display: block;">
          
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to the Shiftly Family!</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${fullName},</p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">Welcome aboard! We're excited to have you join our growing community of professional drivers at Shiftly. Your account has been successfully verified and activated.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #ff4444; margin-bottom: 15px;">Getting Started</h2>
            <ul style="color: #666; list-style-type: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 10px;">✓ Complete your driver profile</li>
              <li style="margin-bottom: 10px;">✓ Add your vehicle information</li>
              <li style="margin-bottom: 10px;">✓ Upload required documents</li>
              <li style="margin-bottom: 10px;">✓ Set your availability</li>
            </ul>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">Our support team is here to help you succeed. If you have any questions, please don't hesitate to reach out at <a href="mailto:support@shiftly.in" style="color: #ff4444; text-decoration: none;">support@shiftly.in</a>.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL_DRIVER}/dashboard" style="background: #ff4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 14px; text-align: center;">
            Best regards,<br>
            <strong>The Shiftly Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Update the exports
module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendDriverOTPEmail,
  sendDriverWelcomeEmail,
};