import { join } from "node:path";
import { __dirname, LOGFILE } from "@config";
import type { TransportSingleOptions } from "pino";

export const logFileTransport: TransportSingleOptions = {
	target: "pino/file",
	options: {
		destination: join(__dirname, LOGFILE),
	},
};
