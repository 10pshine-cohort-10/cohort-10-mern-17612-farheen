import {read_user} from "../services/auth.js";
import {HttpError} from "../utils/http_error.js";

export const check_token = async(req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        return next(new HttpError(401, "Please log in first"));
    }

  req.user = await read_user(token);
    next();
};
