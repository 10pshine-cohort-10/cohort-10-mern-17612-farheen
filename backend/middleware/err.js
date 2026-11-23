import log from "../config/log.js";

const handle_err = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    let code = err.status || 500;
    let msg = err.message;

    if (err.name === "CastError") {
        code = 400;
        msg = "Bad id";
    }
    if (err.name === "ValidationError") {
        code = 400;
    }

    if (code >= 500) {
        log.error({err, path: req.path, status: code}, err.message);
        msg = "Something went wrong";
    }
    else {
        log.warn({path: req.path, status: code}, msg);
    }

    res.status(code).json({message: msg});
};

export const not_found = (req, res) => {
    res.status(404).json({message: "Route not found"});
};

export default handle_err;
