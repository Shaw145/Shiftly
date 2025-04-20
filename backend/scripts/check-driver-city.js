/**
 * Script to check if drivers have city information in their profile
 * This helps diagnose issues with the city-based booking filtering
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Driver = require('../models/Driver');

async function checkDriverCities() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');

    // Find all drivers
    const drivers = await Driver.find({});
    console.log(`Found ${drivers.length} drivers`);

    // Check each driver for city data
    for (const driver of drivers) {
      console.log('\n--- Driver Info ---');
      console.log(`ID: ${driver._id}`);
      console.log(`Username: ${driver.username}`);
      console.log(`Email: ${driver.email}`);
      
      // Check if personal details exist
      if (!driver.personalDetails) {
        console.log('❌ No personalDetails object');
        continue;
      }

      // Check if address exists
      if (!driver.personalDetails.address) {
        console.log('❌ No address object');
        continue;
      }

      // Check if current address exists
      if (!driver.personalDetails.address.current) {
        console.log('❌ No current address object');
        continue;
      }

      // Check for city
      const city = driver.personalDetails.address.current.city;
      if (!city) {
        console.log('❌ No city value');
      } else {
        console.log(`✅ City: ${city}`);
      }

      // Check for state
      const state = driver.personalDetails.address.current.state;
      if (!state) {
        console.log('❌ No state value');
      } else {
        console.log(`✅ State: ${state}`);
      }
    }

    mongoose.disconnect();
    console.log('\nCheck complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDriverCities(); 