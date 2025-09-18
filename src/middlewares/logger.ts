import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info", // log level: info, error, debug
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty", // help read easily when you dev
          options: { colorize: true },
        }
      : undefined, // production = JSON log
});

export default logger;