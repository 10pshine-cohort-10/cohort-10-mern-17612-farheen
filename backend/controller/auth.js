import log from "../config/log.js";
import * as auth from "../services/auth.js";

export const signup = async(req, res) => {
    const {name, email, password, confirmPassword} = req.body ?? {};
    const user = await auth.register(name, email, password, confirmPassword);
    log.info({userId: user.id}, "New user signed up");
    res.status(201).json({id: user.id, name: user.name, email: user.email});
};

export const login = async(req, res) => {
    const {email, password} = req.body ?? {};
    const {token, user} = await auth.sign_in(email, password);
    log.info({userId: user.id}, "User logged in");
    res.json({token, user});
};

export const logout = async(req, res) => {
    await auth.sign_out(req.user.id);
    log.info({userId: req.user.id}, "User logged out");
    res.json({message: "Logged out"});
};

// check_token already loaded the user
export const me = (req, res) => {
    const {user} = req;
    res.json({id: user.id, name: user.name, email: user.email});
};
