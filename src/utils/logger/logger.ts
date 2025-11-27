import { __dirname, ENV, LOG_LEVEL, LOGFILE } from "@config";
import { logFileTransport } from "@utils/logger/logFileTransport.js";
import { writeFileSync } from "fs";
import { join } from "path";
import pino, {
    type Logger,
    type LoggerOptions,
    type TransportSingleOptions,
} from "pino";

/* clear log file */
// truncateSync(join(__dirname, LOGFILE), 0);
writeFileSync(join(__dirname, LOGFILE), "");

const targets: TransportSingleOptions[] = [logFileTransport];
/* disable logs in test mode */
if (ENV !== "test")
    targets.push({
        target: "./pinoPrettyTransport.js",
        options: {
            colorize: true,
            ignore: "pid,hostname",
        },
    });

const config: LoggerOptions = {
    level: LOG_LEVEL,
    transport: {
        targets,
    },
};

export const logger: Logger = pino(config);
