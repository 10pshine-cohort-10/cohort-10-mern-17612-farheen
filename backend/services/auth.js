import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as users from "../data/user.js";
import log from "../config/log.js";
import {HttpError} from "../utils/http_error.js";

const normal_email = (e) => (typeof e === "string" ? e.trim().toLowerCase() : "");
const name_re = /^.{2,50}$/;
const email_re = /^(?=.{6,150}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pass_re = /^.{6,72}$/;

export const make_token = (user) => jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});

export const read_token = (token) => jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});

export const register = async(name, email, password) => {
    if (typeof name !== "string" || !name_re.test(name.trim())) {
        throw new HttpError(400, "Name needs 2 to 50 characters");
    }
    if (!email_re.test(normal_email(email))) {
        throw new HttpError(400, "Email is not valid");
    }
    if (typeof password !== "string" || !pass_re.test(password)) {
        throw new HttpError(400, "Password needs 6 to 72 characters");
    }

    const taken = await users.find_by_email(normal_email(email));
    if (taken) {
        log.warn("Signup failed, email taken");
        throw new HttpError(409, "This email is already used");
    }

    const hash = await bcrypt.hash(password, 10);
    return users.save_user({name: name.trim(), email: normal_email(email), password: hash});
};

export const sign_in = async(email, password) => {
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        throw new HttpError(400, "Email and password are needed");
    }

    const user = await users.find_by_email(normal_email(email));
    const good = user && await bcrypt.compare(password, user.password);

    if (!good) {
        log.warn("Wrong login try");
        throw new HttpError(401, "Wrong email or password");
    }

    return {
        token: make_token(user),
        user: {id: user.id, name: user.name, email: user.email},
    };
};
