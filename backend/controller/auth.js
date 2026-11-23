import log from "../config/log.js";
import * as auth from "../services/auth.js";
import * as users from "../data/user.js";
import {HttpError} from "../utils/http_error.js";

export const signup = async(req, res) => {
    const {name, email, password} = req.body ?? {};
    const user = await auth.register(name, email, password);
    log.info({userId: user.id}, "New user signed up");
    res.status(201).json({id: user.id, name: user.name, email: user.email});
};

export const login = async(req, res) => {
    const {email, password} = req.body ?? {};
    const {token, user} = await auth.sign_in(email, password);
    log.info({userId: user.id}, "User logged in");
    res.json({token, user});
};

export const logout = (req, res) => {
    log.info({userId: req.user.id}, "User logged out");
    res.json({message: "Logged out"});
};

export const me = async(req, res) => {
    const user = await users.find_by_id(req.user.id);
    if (!user) throw new HttpError(404, "User not found");
    res.json({id: user.id, name: user.name, email: user.email});
};
