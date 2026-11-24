import log from "../config/log.js";
import {HttpError} from "../utils/http_error.js";

// shortcut: memory per process, use express-rate-limit with a shared store when running more than one server
export const limit = (max, window_ms) => {
    const hits = new Map();
    setInterval(() => {
        const now = Date.now();
        for (const [ip, hit] of hits) if (hit.reset <= now) hits.delete(ip);
    }, window_ms).unref();

    return (req, res, next) => {
        const now = Date.now();
        let hit = hits.get(req.ip);
        if (!hit || hit.reset <= now) {
            hit = {count: 0, reset: now + window_ms};
            hits.set(req.ip, hit);
        }
        hit.count++;

        if (hit.count > max) {
            log.warn({path: req.path}, "Too many tries");
            res.set("Retry-After", Math.ceil((hit.reset - now) / 1000));
            return next(new HttpError(429, "Too many tries, please wait and try again"));
        }
        next();
    };
};
