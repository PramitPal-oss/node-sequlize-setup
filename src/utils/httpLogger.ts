import winston from 'winston';

export const httpLogger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ message, timestamp }) => `${timestamp} [HTTP]: ${message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/http.log',
    }),
  ],
});
