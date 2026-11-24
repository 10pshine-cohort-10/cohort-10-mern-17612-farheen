import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as users from "../data/user.js";
import log from "../config/log.js";
import {HttpError} from "../utils/http_error.js";

const normal_email = (e) => (typeof e === "string" ? e.trim().toLowerCase() : "");
const name_re = /^.{2,50}$/;
const email_re = /^(?=.{6,150}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
// strong password: every rule must pass. \p{..} classes so letters and digits from any language count.
const pass_rules = [
    [(p) => [...p].length >= 8, "at least 8 characters"], // [...p] counts an emoji as 1, not 2
    [(p) => /\p{Lu}/u.test(p), "an uppercase letter"],
    [(p) => /\p{Ll}/u.test(p), "a lowercase letter"],
    [(p) => /\p{Nd}/u.test(p), "a number"],
    [(p) => /[^\p{L}\p{N}\s]/u.test(p), "a special character (like ! @ # $ %)"],
];

// returns "" for a strong password, otherwise a message that names every missing rule
export const password_problem = (p) => {
    if (typeof p !== "string") return "Password is required";
    // bcrypt ignores everything after 72 bytes, and letters like Urdu or emoji take 2-4 bytes each
    if (Buffer.byteLength(p) > 72) return "Password is too long (72 bytes max)";
    const missing = pass_rules.filter(([ok]) => !ok(p)).map(([, rule]) => rule);
    if (!missing.length) return "";
    const list = missing.length > 1 ? `${missing.slice(0, -1).join(", ")} and ${missing.at(-1)}` : missing[0];
    return `Password needs ${list}`;
};

// called once at startup: a missing, example or short key would let anyone forge tokens
export const check_secret = (s = process.env.JWT_SECRET) => {
    if (!s || s.startsWith("change_me") || s.length < 32) {
        throw new Error("JWT_SECRET must be set to at least 32 random characters (not the example value)");
    }
};

export const make_token = (user) => jwt.sign({id: user.id, ver: user.ver}, process.env.JWT_SECRET, {expiresIn: "1h"});

export const read_token = (token) => jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});

// token must be valid and still current: the user exists and has not logged out since it was made
export const read_user = async(token) => {
    let data;
    try {
        data = read_token(token);
    }
    catch {
        log.warn("Bad token");
        throw new HttpError(401, "Session is not valid, log in again");
    }
    const user = await users.find_by_id(data.id);
    if (!user || user.ver !== data.ver) {
        log.warn("Old or unknown token");
        throw new HttpError(401, "Session is not valid, log in again");
    }
    return user;
};

// ends every session of this user: tokens made before this no longer match user.ver
export const sign_out = async(id) => users.bump_ver(id);

export const register = async(name, email, password, confirm) => {
    if (typeof name !== "string" || !name_re.test(name.trim())) {
        throw new HttpError(400, "Name needs 2 to 50 characters");
    }
    if (!email_re.test(normal_email(email))) {
        throw new HttpError(400, "Email is not valid");
    }
    const weak = password_problem(password);
    if (weak) {
        throw new HttpError(400, weak);
    }
    // the retyped password must match, so a typo cannot lock the user out of a new account
    if (confirm !== password) {
        throw new HttpError(400, "Passwords do not match");
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
