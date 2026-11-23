import {test} from "node:test";
import assert from "node:assert/strict";
import {password_problem, register, check_secret} from "../services/auth.js";

test("weak passwords are rejected with every missing rule named", () => {
    assert.equal(password_problem("123456"),
        "Password needs at least 8 characters, an uppercase letter, a lowercase letter and a special character (like ! @ # $ %)");
    assert.equal(password_problem("password"),
        "Password needs an uppercase letter, a number and a special character (like ! @ # $ %)");
    assert.equal(password_problem("Password1"), "Password needs a special character (like ! @ # $ %)");
    assert.equal(password_problem("Pass1!"), "Password needs at least 8 characters");
    assert.equal(password_problem("PASSWORD1!"), "Password needs a lowercase letter");
    assert.equal(password_problem("password1!"), "Password needs an uppercase letter");
    assert.equal(password_problem("Password!!"), "Password needs a number");
    assert.equal(password_problem("Pass word1"), "Password needs a special character (like ! @ # $ %)"); // a space is not special
});

test("strong passwords pass", () => {
    for (const p of ["Password1!", "Str0ng#Pass", "Farheen@2026", "ابجد Aa1!"]) {
        assert.equal(password_problem(p), "", p);
    }
});

test("missing and too long passwords are rejected", () => {
    assert.equal(password_problem(undefined), "Password is required");
    assert.equal(password_problem(12345678), "Password is required");
    assert.equal(password_problem("Aa1!" + "a".repeat(69)), "Password is too long (72 bytes max)");
    assert.equal(password_problem("Aa1!" + "a".repeat(68)), ""); // exactly 72 bytes is fine
});

// these fail before register() touches the database, so no MongoDB is needed
test("signup rejects a missing or different retyped password", async () => {
    const mismatch = {status: 400, message: "Passwords do not match"};
    await assert.rejects(register("Test User", "t@test.com", "Password1!", "Password2!"), mismatch);
    await assert.rejects(register("Test User", "t@test.com", "Password1!", undefined), mismatch);
    await assert.rejects(register("Test User", "t@test.com", "Password1!", "password1!"), mismatch); // case matters
});

test("a weak password is reported before the retype check", async () => {
    await assert.rejects(register("Test User", "t@test.com", "weak", "weak"), {status: 400, message: /^Password needs/});
});

test("the JWT signing key must be set, not the example and at least 32 characters", () => {
    for (const bad of [undefined, "", "change_me", "short_key", "change_me_to_at_least_32_random_characters"]) {
        assert.throws(() => check_secret(bad), /JWT_SECRET/, String(bad));
    }
    assert.doesNotThrow(() => check_secret("x".repeat(32)));
});
