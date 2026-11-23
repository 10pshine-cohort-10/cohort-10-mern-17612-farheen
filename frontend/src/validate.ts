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

export const check_pass = (v: string) => {
    if (v.length < 6) return "Password needs at least 6 characters";
    // bcrypt on the backend only reads 72 bytes, and Urdu letters or emoji take 2-4 bytes each
    if (new TextEncoder().encode(v).length > 72) return "Password is too long (72 bytes max)";
    return "";
};

export const check_filled = (label: string) => (v: string) => (v ? "" : `${label} is required`);
