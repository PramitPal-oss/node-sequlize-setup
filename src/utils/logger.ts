import winston from 'winston';

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n ${JSON.stringify(stack)}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // 🔑 REQUIRED
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  }),
);

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    // 📄 App logs
    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
      format: fileFormat,
    }),

    // ❌ Error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
    }),

    // 🖥 Console logs (DEV)
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
});
