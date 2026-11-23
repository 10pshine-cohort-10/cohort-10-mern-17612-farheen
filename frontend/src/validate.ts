// each check returns an error message, or "" when the value is fine. Same limits as the backend.

export const check_name = (v: string) => {
    const t = v.trim();
    if (!t) return "Name is required";
    if (t.length < 2 || t.length > 50) return "Name needs 2 to 50 characters";
    // letters from any language (Urdu, Arabic, ...), spaces, ' . -
    if (!/^[\p{L}\p{M}' .-]+$/u.test(t)) return "Name can only have letters, spaces and ' . -";
    return "";
};

export const check_email = (v: string) => {
    const t = v.trim();
    if (!t) return "Email is required";
    if (!/^(?=.{6,150}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "Enter a valid email, like name@example.com";
    return "";
};

// same strong password rules as the backend (backend/services/auth.js), short names for the live hint
const pass_rules: [(p: string) => boolean, string][] = [
    [(p) => p.length >= 8, "8+ characters"],
    [(p) => /\p{Lu}/u.test(p), "uppercase"],
    [(p) => /\p{Ll}/u.test(p), "lowercase"],
    [(p) => /\p{Nd}/u.test(p), "number"],
    [(p) => /[^\p{L}\p{N}\s]/u.test(p), "symbol"],
];

const strength_names = ["Too weak", "Weak", "Almost there", "Strong"];

// live strength while typing: level 0-3 for the bar, and what is still missing
export const pass_strength = (v: string) => {
    const missing = pass_rules.filter(([ok]) => !ok(v)).map(([, rule]) => rule);
    const met = pass_rules.length - missing.length;
    const level = met === 5 ? 3 : met === 4 ? 2 : met === 3 ? 1 : 0;
    return {level, name: strength_names[level], missing};
};

export const check_pass = (v: string) => {
    if (!v) return "Password is required";
    // bcrypt on the backend only reads 72 bytes, and Urdu letters or emoji take 2-4 bytes each
    if (new TextEncoder().encode(v).length > 72) return "Password is too long (72 bytes max)";
    const {name, missing} = pass_strength(v);
    return missing.length ? `${name} · needs ${missing.join(", ")}` : "";
};

export const check_confirm = (pass: string, confirm: string) => {
    if (!confirm) return "Please retype your password";
    return confirm === pass ? "" : "Passwords do not match";
};

export const check_filled = (label: string) => (v: string) => (v ? "" : `${label} is required`);
