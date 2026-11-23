import {test} from "node:test";
import assert from "node:assert/strict";
import {password_problem} from "../services/auth.js";

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
