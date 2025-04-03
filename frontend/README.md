# Overview:
"Shiftly" is a web-based transport system designed to facilitate seamless transportation of goods across India. Whether it's shifting household items during relocation or transporting industrial materials for businesses, Shiftly ensures a hassle-free experience by connecting customers with suitable vehicles and reliable drivers. The platform is built to simplify the process, ensure affordability, and maintain reliability for both customers and drivers.

# Key Features and Functionalities:

## User Registration and Login:

Users (customers and drivers) can create an account with basic details for secure access.
Multiple authentication options, including email, phone number, and social logins.

## Goods and Address Input:

Customers can enter pick-up and destination addresses.
Option to specify goods details like type (household or industrial), weight, and size.
If weight and size are unknown, the platform provides an intuitive estimation tool using AI to predict weight and volume based on goods descriptions.

## Vehicle Selection:

Displays a list of vehicles suitable for the goods based on size and weight.
Options range from mini-tempos for smaller items to large trucks for industrial transport.

## Driver Bidding System:

Drivers within the pick-up area submit their bids based on distance, size, and type of goods.
Customers can compare bids, view driver profiles and reviews, and choose the most suitable driver.

## Dynamic Pricing Model:

Pricing is calculated based on multiple factors: distance, weight, volume, vehicle type, and time of day.
The system ensures affordability for customers while maintaining fair profits for drivers and the platform.

## Booking and Scheduling:

Customers can book a vehicle and driver for immediate or future transport.
A flexible calendar interface allows customers to select their preferred time slots.
Live Tracking:

Customers can track their goods in real-time through a GPS-enabled interface.
The live map shows the vehicle's location, estimated delivery time, and updates on the delivery status.
Damage Policy:

Transparent policies for reporting damages during transit.
Goods-in-transit insurance ensures compensation for customers in case of losses.
Continuous training for drivers to minimize damage risks.

## Driver Benefits:

Flexible earning opportunities by taking up transport jobs as per availability.
Transparent commission structure for better earnings.
Access to more customers and transport jobs through the platform.

## Preventing Unauthorized Direct Deals:

Drivers and customers cannot share personal contact details through the platform.
Communication is handled entirely through in-app messaging and calls to ensure bookings remain within the platform.

## Customer Feedback System:

After delivery, customers can rate drivers and provide feedback.
Reviews help future customers choose the best drivers and maintain platform quality.

## Eco-friendly Initiatives (Future Scope):

Introduce electric vehicles for transport to reduce carbon emissions.
Promote optimized delivery routes to save fuel and time.

## Technological Integration:

### AI/ML Applications:

Dynamic pricing models for fair pricing.
Predictive algorithms for route optimization and delivery time estimation.
AI-based weight and volume estimators for goods when exact details are unknown.

### Web Technologies:

- Frontend: React.js for a responsive and user-friendly interface.
- Backend: Node.js for handling requests and logic.
- Database: MongoDB for user, driver, and transport data storage and firebase.

## Real-time Functionality:

Firebase or WebSocket technology for live tracking and updates.

## Security:

Authentication using JWT tokens for secure logins.
Encrypted communication between customers and drivers.

## Challenges Faced:

Deciding on a pricing model that is fair for customers, drivers, and the platform.

Solution: Implemented an AI-driven dynamic pricing model that accounts for multiple factors.
Acquiring freelance drivers who may already work for other transport businesses.

Solution: Offered attractive commissions and a flexible schedule to encourage drivers to join.
Preventing customers from bypassing the platform to save money.

Solution: Restricted personal communication outside the platform and incentivized in-platform bookings.
Target Audience:

Individuals relocating homes.
Small and large businesses needing industrial goods transport.
Freelance drivers looking for flexible earning opportunities.

Impact:
Shiftly aims to revolutionize goods transport in India by providing a digital solution that bridges the gap between customers and transport service providers. The platform focuses on affordability, efficiency, and customer satisfaction, making it a win-win for all stakeholders involved.
