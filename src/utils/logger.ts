import winston from 'winston';
import { config } from '../configs/config';

const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: config.app.nodeEnv === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    // Console transport for all environments
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      )
    })
  ]
});

// Only add file transport in development environment
if (config.app.nodeEnv !== 'production') {
  try {
    logger.add(new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }));
    logger.add(new transports.File({ 
      filename: 'logs/combined.log' 
    }));
  } catch (error) {
    logger.warn('Could not create log files. Using console transport only.');
  }
}

export default logger;