# Shiftly

![Shiftly Logo](./frontend/src/assets/logo-light.png)

## Overview

**Shiftly** is a web-based transport system designed to facilitate seamless transportation of goods across India. Whether it's shifting household items during relocation or transporting industrial materials for businesses, Shiftly ensures a hassle-free experience by connecting customers with suitable vehicles and reliable drivers. The platform is built to simplify the process, ensure affordability, and maintain reliability for both customers and drivers.

## Key Features

### For Customers

- **User Registration and Login**: Secure account creation with multiple authentication options (email, phone number, social logins).
- **Goods and Address Input**: Customers can enter pick-up and destination addresses, specify goods details, and use an AI estimation tool for unknown weights and sizes.
- **Vehicle Selection**: Displays a list of vehicles suitable for the goods based on size and weight.
- **Driver Bidding System**: Customers can compare bids from drivers based on distance, size, and type of goods.
- **Dynamic Pricing Model**: Pricing is calculated based on distance, weight, volume, vehicle type, and time of day.
- **Booking and Scheduling**: Customers can book vehicles for immediate or future transport with a flexible calendar interface.
- **Live Tracking**: Real-time tracking of goods through a GPS-enabled interface.
- **Customer Feedback System**: Customers can rate drivers and provide feedback to maintain platform quality.

### For Drivers

- **Driver Registration and Login**: Secure account creation and login for drivers.
- **Bid Submission**: Drivers can submit bids for transport jobs based on customer requests.
- **Profile Management**: Drivers can manage their profiles, including vehicle details and availability.
- **Earnings Tracking**: Drivers can view their earnings and transaction history.
- **Customer Ratings**: Drivers can view feedback and ratings from customers to improve service quality.

## Technologies Used

- **Frontend**: React.js for a responsive and user-friendly interface.
- **Backend**: Node.js and Express.js for handling requests and logic.
- **Database**: MongoDB for user, driver, and transport data storage.
- **Cloud Storage**: Cloudinary for image and asset management.
- **SMS Service**: Twilio for sending SMS notifications.
- **Distance Calculation**: OpenRoute API for calculating distances and routes.
- **Email Service**: Nodemailer for sending emails, including OTPs and notifications.
- **Animation**: Framer Motion for smooth animations and transitions.
- **Real-time Functionality**: Firebase or WebSocket technology for live tracking and updates.
- **Security**: Authentication using JWT tokens for secure logins and encrypted communication.

## Installation

To get started with Shiftly, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Shaw145/Shiftly.git
   cd Shiftly
   ```

2. **Install backend dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**:

   - Create a `.env` file in the `backend` directory and add the necessary environment variables. Refer to the `.env.example` file for guidance.
   - Ensure you have the following environment variables set up:
     - `MONGODB_URI`: Your MongoDB connection string.
     - `CLOUDINARY_URL`: Your Cloudinary URL for image uploads.
     - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID.
     - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
     - `TWILIO_PHONE_NUMBER`: Your Twilio phone number for sending SMS.
     - `EMAIL_USER`: Your email address for sending emails.
     - `EMAIL_PASS`: Your email password or app-specific password.

5. **Run the application**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```

## Usage

Once the application is running, you can access it at `http://localhost:5173` for the frontend and `http://localhost:5000` for the backend API.

### Important Screenshots/Demo

#### Customer Side

- **Login Page**: ![Customer Login](path/to/customer-login.png) <!-- Add your screenshot path here -->
- **Registration Page**: ![Customer Registration](path/to/customer-registration.png) <!-- Add your screenshot path here -->
- **Booking Interface**: ![Booking Interface](path/to/booking-interface.png) <!-- Add your screenshot path here -->
- **Live Tracking**: ![Live Tracking](path/to/live-tracking.png) <!-- Add your screenshot path here -->

#### Driver Side

- **Driver Login Page**: ![Driver Login](path/to/driver-login.png) <!-- Add your screenshot path here -->
- **Driver Dashboard**: ![Driver Dashboard](path/to/driver-dashboard.png) <!-- Add your screenshot path here -->
- **Bid Submission**: ![Bid Submission](path/to/bid-submission.png) <!-- Add your screenshot path here -->
- **Earnings Overview**: ![Earnings Overview](path/to/earnings-overview.png) <!-- Add your screenshot path here -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please reach out to [sumanshaw706@gmail.com](mailto:sumanshaw706@gmail.com).

---

Shiftly aims to revolutionize goods transport in India by providing a digital solution that bridges the gap between customers and transport service providers. The platform focuses on affordability, efficiency, and customer satisfaction, making it a win-win for all stakeholders involved.
