import {read_token} from "../services/auth.js";
import log from "../config/log.js";
import {HttpError} from "../utils/http_error.js";

export const check_token = (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        return next(new HttpError(401, "Please log in first"));
    }

  try {
      req.user = read_token(token);
    next();
  }
  catch {
      log.warn("Bad token");
    next(new HttpError(401, "Session is not valid, log in again"));
  }
};
