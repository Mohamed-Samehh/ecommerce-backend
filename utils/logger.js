const pino = require('pino');

const logger = pino({
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
