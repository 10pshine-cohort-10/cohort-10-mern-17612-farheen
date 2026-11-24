import {expect} from "chai";
import {password_problem, register, check_secret} from "../services/auth.js";

const fails = async (fn) => {
    try {
        await fn();
        return null;
    }
    catch (err) {
        return err;
    }
};

describe("password rules", () => {
    it("names every missing rule", () => {
        expect(password_problem("123456")).to.equal("Password needs at least 8 characters, an uppercase letter, a lowercase letter and a special character (like ! @ # $ %)");
        expect(password_problem("password")).to.equal("Password needs an uppercase letter, a number and a special character (like ! @ # $ %)");
        expect(password_problem("Password1")).to.equal("Password needs a special character (like ! @ # $ %)");
        expect(password_problem("Pass1!")).to.equal("Password needs at least 8 characters");
        expect(password_problem("PASSWORD1!")).to.equal("Password needs a lowercase letter");
        expect(password_problem("password1!")).to.equal("Password needs an uppercase letter");
        expect(password_problem("Password!!")).to.equal("Password needs a number");
        expect(password_problem("Pass word1")).to.equal("Password needs a special character (like ! @ # $ %)");
    });

    it("passes strong passwords", () => {
        for (const p of ["Password1!", "Str0ng#Pass", "Farheen@2026", "ابجد Aa1!"]) {
            expect(password_problem(p), p).to.equal("");
        }
    });

    it("rejects missing and too long passwords", () => {
        expect(password_problem(undefined)).to.equal("Password is required");
        expect(password_problem(12345678)).to.equal("Password is required");
        expect(password_problem("Aa1!" + "a".repeat(69))).to.equal("Password is too long (72 bytes max)");
        expect(password_problem("Aa1!" + "a".repeat(68))).to.equal("");
    });

    it("counts emoji as one character each", () => {
        expect(password_problem("Aa1!\u{1F600}\u{1F600}")).to.equal("Password needs at least 8 characters");
        expect(password_problem("Aa1!\u{1F600}\u{1F600}\u{1F600}\u{1F600}")).to.equal("");
    });
});

describe("signup password checks", () => {
    it("rejects a missing or different retyped password", async () => {
        const mismatch = "Passwords do not match";
        expect((await fails(() => register("Test User", "t@test.com", "Password1!", "Password2!"))).message).to.equal(mismatch);
        expect((await fails(() => register("Test User", "t@test.com", "Password1!", undefined))).message).to.equal(mismatch);
        expect((await fails(() => register("Test User", "t@test.com", "Password1!", "password1!"))).message).to.equal(mismatch);
    });

    it("reports a weak password before the retype check", async () => {
        const err = await fails(() => register("Test User", "t@test.com", "weak", "weak"));
        expect(err.status).to.equal(400);
        expect(err.message).to.match(/^Password needs/);
    });
});

describe("JWT_SECRET check", () => {
    it("rejects missing, example and short secrets", () => {
        for (const bad of [undefined, "", "change_me", "short_key", "change_me_to_at_least_32_random_characters"]) {
            expect(() => check_secret(bad), String(bad)).to.throw(/JWT_SECRET/);
        }
    });

    it("accepts a long secret", () => {
        expect(() => check_secret("x".repeat(32))).to.not.throw();
    });
});