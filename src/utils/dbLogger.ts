import winston from 'winston';

export const dbLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ message, timestamp }) => `${timestamp} [DB]: ${message}`,
    ),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/db.log',
    }),
  ],
});
