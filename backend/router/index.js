import express from "express";
import {signup, login, logout, me} from "../controller/auth.js";
import {check_token} from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", check_token, logout);
router.get("/me", check_token, me);

export default router;
