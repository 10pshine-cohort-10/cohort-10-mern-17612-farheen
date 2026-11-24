import express from "express";
import {signup, login, logout, me} from "../controller/auth.js";
import {check_token} from "../middleware/auth.js";
import {limit} from "../middleware/limit.js";

const router = express.Router();
const auth_limit = limit(10, 15 * 60 * 1000); // 10 tries per IP every 15 minutes

router.post("/signup", auth_limit, signup);
router.post("/login", auth_limit, login);
router.post("/logout", check_token, logout);
router.get("/me", check_token, me);

export default router;
