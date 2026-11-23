import pino from "pino";

// tokens and cookies never reach the logs, anyone reading them could act as that user
const log = pino({
    level: process.env.LOG_LEVEL || "info",
    redact: {paths: ["req.headers.authorization", "req.headers.cookie"], censor: "[hidden]"},
});

export default log;
