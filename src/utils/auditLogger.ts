import winston from 'winston';

export const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(), // audit logs are structured
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/audit.log',
    }),
  ],
});
