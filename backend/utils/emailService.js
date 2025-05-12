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

// General function to send emails
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Shiftly" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${options.to}:`, error);
    return false;
  }
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Shiftly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Shiftly",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="https://i.postimg.cc/2y9038sD/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
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
            <img src="https://i.postimg.cc/2y9038sD/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
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
          <img src="https://i.postimg.cc/2y9038sD/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
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
              <img src="https://i.postimg.cc/2y9038sD/Shiftly-logo.png" alt="Shiftly Logo" style="width: 100px; margin-bottom: 20px;">
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
          <img src="https://i.postimg.cc/2y9038sD/Shiftly-logo.png" alt="Shiftly Logo" style="width: 120px; margin: 0 auto 20px; display: block;">
          
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

// Send booking confirmation email to driver
async function sendDriverBookingConfirmationEmail(driverEmail, booking) {
  try {
    // Normalize the driver parameter to handle both object and string cases
    const email =
      typeof driverEmail === "object" ? driverEmail.email : driverEmail;

    // Helper function to format address from object
    const formatAddress = (location) => {
      if (!location) return "Not specified";

      // Handle string locations
      if (typeof location === "string") return location;

      // Handle object locations
      const parts = [];

      if (location.street || location.addressLine1)
        parts.push(location.street || location.addressLine1);
      if (location.addressLine2) parts.push(location.addressLine2);
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      if (location.pincode || location.zipcode)
        parts.push(location.pincode || location.zipcode);

      return parts.length > 0 ? parts.join(", ") : "Address not available";
    };

    // Format the pickup date
    const pickupDate =
      booking.schedule && booking.schedule.date
        ? new Date(booking.schedule.date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Not specified";

    // Format price with currency symbol
    const formattedPrice = booking.finalPrice
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(booking.finalPrice)
      : "₹" + (booking.finalPrice || 0);

    // Format goods type (convert snake_case to Title Case)
    const goodsType =
      booking.goods && booking.goods.type
        ? booking.goods.type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Standard Goods";

    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        /* Base styles */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 150px;
          height: auto;
        }
        .heading {
          font-size: 24px;
          font-weight: bold;
          color: #0056b3;
          margin-bottom: 20px;
          text-align: center;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .details-row {
          display: flex;
          border-bottom: 1px solid #eeeeee;
          padding: 8px 0;
        }
        .details-label {
          font-weight: bold;
          width: 40%;
          padding: 8px;
          color: #666666;
        }
        .details-value {
          width: 60%;
          padding: 8px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #db0b23;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #888888;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eeeeee;
        }
        .highlight {
          color: #0056b3;
          font-weight: bold;
        }
        
        /* Responsive styles for mobile */
        @media only screen and (max-width: 480px) {
          .container {
            padding: 15px;
            width: 100%;
          }
          .logo img {
            max-width: 120px;
          }
          .heading {
            font-size: 20px;
          }
          .content {
            font-size: 14px;
          }
          .details-row {
            flex-direction: column;
          }
          .details-label, .details-value {
            width: 100%;
            padding: 4px 8px;
          }
          .button {
            display: block;
            padding: 10px;
            font-size: 14px;
            width: 80%;
            margin: 0 auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://i.postimg.cc/2y9038sD/Shiftly-logo.png" alt="Shiftly Logo">
        </div>
        
        <div class="heading">Booking Confirmation</div>
        
        <div class="content">
          Hello ${
            typeof driverEmail === "object"
              ? driverEmail.fullName || "Driver"
              : "Driver"
          },
          <br><br>
          Your booking has been confirmed! Here are the details of the booking:
        </div>
        
        <div class="details-container">
          <div class="details-row">
            <div class="details-label">Booking ID:</div>
            <div class="details-value">${
              booking.bookingId || "Not available"
            }</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Pickup Date:</div>
            <div class="details-value">${pickupDate}</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Pickup Location:</div>
            <div class="details-value">${formatAddress(booking.pickup)}</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Delivery Location:</div>
            <div class="details-value">${formatAddress(booking.delivery)}</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Goods Type:</div>
            <div class="details-value">${goodsType}</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Payment Amount:</div>
            <div class="details-value">${formattedPrice}</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Customer Name:</div>
            <div class="details-value">${
              booking.customer?.name ||
              booking.userName ||
              booking.customerName ||
              "Not available"
            }</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Customer Phone:</div>
            <div class="details-value">${
              booking.customer?.phone ||
              booking.userPhone ||
              booking.customerPhone ||
              "Not available"
            }</div>
          </div>
          
          <div class="details-row">
            <div class="details-label">Customer Email:</div>
            <div class="details-value">${
              booking.customer?.email ||
              booking.userEmail ||
              booking.customerEmail ||
              "Not available"
            }</div>
          </div>
        </div>
        
        <div class="button-container">
          <a href="${process.env.DRIVER_FRONTEND_URL}/bookings/${
      booking.bookingId
    }" class="button">View Booking Details</a>
        </div>
        
        <div class="content">
          Please ensure you arrive at the pickup location on time. If you have any questions or need to make changes, please contact our support team or use the driver app.
          <br><br>
          Thank you for using Shiftly!
        </div>
        
        <div class="footer">
          &copy; ${new Date().getFullYear()} Shiftly. All rights reserved.
          <br>
          This is an automated email, please do not reply.
        </div>
      </div>
    </body>
    </html>
    `;

    // Send the email
    return await sendEmail({
      to: email,
      subject: `Booking Confirmed: ${booking.bookingId}`,
      html: emailContent,
    });
  } catch (error) {
    console.error(`Error sending driver confirmation email: ${error.message}`);
    return false;
  }
}

// Update the exports
module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendDriverOTPEmail,
  sendDriverWelcomeEmail,
  sendDriverBookingConfirmationEmail,
};
