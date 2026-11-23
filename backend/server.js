import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import pinoHttp from "pino-http";
import router from "./router/index.js";
import log from "./config/log.js";
import handle_err, {not_found} from "./middleware/err.js";
import {check_secret} from "./services/auth.js";

try {
    check_secret();
}
catch (err) {
    log.error(err.message);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3600;
const mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017/notes";

app.use(cors({origin: process.env.CLIENT_URL || "http://localhost:5174"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(pinoHttp({logger: log}));

app.use("/api", router);
app.use("/api", not_found);
app.use(handle_err);

mongoose.connect(mongo_uri)
    .then(() => {
        log.info("MongoDB connected");
        app.listen(port, (err) => {
            if (err) {
                log.error({err}, `Server could not start on port ${port}`);
                process.exit(1);
            }
            log.info(`Server is running on port ${port}.`);
        });
    })
    .catch((err) => {
        log.error({err}, "MongoDB connection failed");
        process.exit(1);
    });
