const process = require('node:process');
const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

const logger = isProduction
  ? pino({level: 'info'})
  : pino({
      level: 'info',
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'info',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname'
            }
          },
          {
            target: 'pino/file',
            level: 'error',
            options: {
              destination: 'logs/app.log',
              mkdir: true
            }
          }
        ]
      }
    });

module.exports = logger;
