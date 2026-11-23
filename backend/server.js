import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import pinoHttp from "pino-http";
import router from "./router/index.js";
import log from "./config/log.js";
import handle_err, {not_found} from "./middleware/err.js";

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
        app.listen(port, () => log.info(`Server is running on port ${port}.`));
    })
    .catch((err) => {
        log.error({err}, "MongoDB connection failed");
        process.exit(1);
    });
