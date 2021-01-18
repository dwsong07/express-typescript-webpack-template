import fs from "fs";
import path from "path";
import { transports, createLogger, format } from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = path.join(
    __dirname,
    "..",
    "logs" + (process.env.NODE_ENV === "production" ? "" : "_dev") // in dev mode use logs_dev folder.
);

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logformat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
        (info) =>
            `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`
    )
);

const consoleTransport = new transports.Console({
    level: "debug",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.colorize(),
        format.simple()
    ),
});

const fileTransport = new winstonDaily({
    format: logformat,
    level: "info",
    filename: "info.log",
    dirname: logDir,
    maxFiles: 30,
});

const logger = createLogger({
    transports: [fileTransport, consoleTransport],
});

export const stream = {
    write(message: string) {
        logger.info(message.slice(0, -1)); // "slice(0, -1)" to prevent new line
    },
};

export default logger;
