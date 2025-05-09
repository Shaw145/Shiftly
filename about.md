Shiftly Project Documentation
Project Overview
Shiftly is a comprehensive web platform that connects customers with verified transport service providers across India. The platform addresses key pain points in the logistics industry, including lack of price transparency, difficulty in finding reliable services, and inefficient route planning.
Core Value Proposition
Real-time driver bidding system for fair pricing
Transparent pricing algorithm based on distance, vehicle type, and load
Comprehensive verification process for drivers
Live tracking capabilities for all shipments
Multiple payment options
Dispute resolution system
Rating and review system
Technology Stack
Frontend
React.js with Tailwind CSS for responsive design
Framer Motion for animations
WebSocket integration for real-time updates
Backend
Node.js with Express.js framework
MongoDB for primary database
JWT for authentication
WebSockets for real-time tracking and bidding
External Services Integration
Google Maps API for distance calculation
Razorpay for payment processing
System Architecture
The system follows a three-tier architecture:
Client Tier
Customer Web App
Driver Web App
Admin Dashboard
Service Tier
Core Services: Authentication, Payment Processing, Notifications
Business Logic: Booking Management, Price Calculation, Bidding System, Driver Matching, Live Tracking
Utility Services: Dispute Handling, Analytics
Data Tier
MongoDB for document storage
Location data storage for tracking
Key Components and Data Flow
User Management
Registration and authentication with role-based access
Profile management for customers and drivers
Document verification for drivers
Vehicle registration for service providers
Booking Process
Customer creates a booking request with pickup/dropoff locations, goods type, and weight
System calculates estimated price based on distance, vehicle type, and weight
Available drivers receive the request and can place bids
Customer selects a bid, confirming the booking
Driver accepts and proceeds to pickup
Live tracking begins for the journey
Customer receives status notifications
Payment processed upon delivery
Both parties can leave reviews
Bidding System
Drivers view available jobs in their area
Drivers place competitive bids
Customers select the most suitable bid
System tracks bid history and metrics
Tracking and Notifications
Real-time location tracking
Automated notifications for status changes
ETA calculations
Payment System
Multiple payment methods supported
Secure transaction processing
Transaction history and receipts
User Interfaces
Customer Web App
Dashboard with booking history
Booking creation with location selection
Price calculator
Bid selection interface
Live tracking map
Payment processing
Profile management
Review submission
Notification center
Driver Web App
Dashboard with earnings and job history
Available jobs listing
Bidding interface
Navigation for accepted jobs
Status update controls
Earnings management
Profile and vehicle management
Document submission
Ratings and reviews
Admin Dashboard
User management
Booking oversight
Dispute resolution
Performance analytics
System configuration
Database Design
Key entities in the database schema:
Users (authentication, common attributes)
Customers (shipping preferences)
Drivers (verification status)
Vehicles (transport vehicles linked to drivers)
Bookings (transport requests)
Bids (driver bids on bookings)
Payments (transaction records)
Location Updates (vehicle positions)
Reviews (customer and driver feedback)
Disputes (issues and resolutions)
Notifications (system messages)
Technical Implementation
Authentication
JWT-based authentication
Role-based permissions
Secure password hashing
Booking and Pricing
Distance calculation via Google Maps API
Vehicle type and capacity consideration
Goods weight and type factors
Time-based demand factors
Real-time Features
WebSocket connections for live updates
Bid notifications
Location tracking
Status updates
Payment Integration
Razorpay payment gateway
Multiple payment methods
Transaction recording
This documentation reflects the current implementation of the Shiftly platform, focusing on the developed features and core functionality.