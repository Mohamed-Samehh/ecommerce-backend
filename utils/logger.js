const process = require('node:process');
const pino = require('pino');

const targets = [
  {
    target: 'pino-pretty',
    level: 'info',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
];

if (!process.env.VERCEL) {
  targets.push({
    target: 'pino/file',
    level: 'error',
    options: {
      destination: 'logs/app.log',
      mkdir: true
    }
  });
}

const logger = pino({
  level: 'info',
  transport: {
    targets
  }
});

module.exports = logger;
