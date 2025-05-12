/**
 * Simple logger utility for the application
 */

// Define log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Get current log level from environment or default to INFO
const currentLevel = process.env.LOG_LEVEL
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO
  : LOG_LEVELS.INFO;

// Utility function to format log messages
const formatMessage = (message, data) => {
  const timestamp = new Date().toISOString();
  let formattedMessage = `[${timestamp}] ${message}`;

  if (data) {
    if (typeof data === "object") {
      try {
        formattedMessage += ` ${JSON.stringify(data)}`;
      } catch (error) {
        formattedMessage += ` [Object cannot be stringified]`;
      }
    } else {
      formattedMessage += ` ${data}`;
    }
  }

  return formattedMessage;
};

// Logger functions for different levels
const logger = {
  error: (message, data) => {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(`ERROR: ${formatMessage(message, data)}`);
    }
  },

  warn: (message, data) => {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(`WARN: ${formatMessage(message, data)}`);
    }
  },

  info: (message, data) => {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.info(`INFO: ${formatMessage(message, data)}`);
    }
  },

  debug: (message, data) => {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.debug(`DEBUG: ${formatMessage(message, data)}`);
    }
  },

  // Log at custom level
  log: (level, message, data) => {
    const logLevel = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;

    if (currentLevel >= logLevel) {
      console.log(`${level.toUpperCase()}: ${formatMessage(message, data)}`);
    }
  },
};

module.exports = logger;
