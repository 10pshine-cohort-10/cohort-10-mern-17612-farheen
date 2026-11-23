import {useState, type FormEvent} from "react";
import {api, error_message} from "../api";
import AuthLayout from "./AuthLayout.tsx";
import Field from "./Field.tsx";
import {check_name, check_email, check_pass, check_confirm, pass_strength} from "../validate.ts";

type Props = {
    goLogin: (notice?: string) => void;
};

function Signup({goLogin}: Props) {
  const [form, setForm] = useState({name: "", email: "", pass: "", confirm: ""});
    const [touched, setTouched] = useState({name: false, email: false, pass: false, confirm: false, agree: false});
  const [agree, setAgree] = useState(false);
  const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

  const errors = {
      name: check_name(form.name),
      email: check_email(form.email),
      pass: check_pass(form.pass),
      confirm: check_confirm(form.pass, form.confirm),
      agree: agree ? "" : "Please accept the Terms & Conditions",
  };
  // a field shows its error once the user has left it, then updates live while they type.
  // the two password fields check live from the first letter typed, no need to leave the field.
  const live = (k: "pass" | "confirm") => touched[k] || form[k] !== "";
  const shown = (k: keyof typeof errors) =>
      (k === "pass" || k === "confirm" ? live(k) : touched[k]) ? errors[k] : "";
  const strength = pass_strength(form.pass);
    const set = (k: keyof typeof form) => (v: string) => setForm({...form, [k]: v});
  const leave = (k: keyof typeof touched) => () => setTouched({...touched, [k]: true});

  async function send(e: FormEvent) {
      e.preventDefault();
    setTouched({name: true, email: true, pass: true, confirm: true, agree: true});
      if (Object.values(errors).some(Boolean) || busy) return;
    setMsg("");
      setBusy(true);
    try {
        await api.post("/api/signup", {
          name: form.name, email: form.email, password: form.pass, confirmPassword: form.confirm,
        });
      goLogin("Account created. Please sign in.");
    }
    catch (err) {
        setMsg(error_message(err));
    }
    finally {
        setBusy(false);
    }
  }

  return (
    <AuthLayout title="Create account">
    <form aria-label="sign up form" noValidate onSubmit={send}>
      <h1 className="display">Create account</h1>
        <p className="lead">Start keeping your notes in one place.</p>

      <Field id="name" name="name" label="Name" type="text" autoComplete="name"
        value={form.name} error={shown("name")} onChange={set("name")} onBlur={leave("name")} />
      <Field id="email" name="email" label="Email" type="email" autoComplete="email"
        value={form.email} error={shown("email")} onChange={set("email")} onBlur={leave("email")} />
      <Field id="pass" name="password" label="Password" type="password" autoComplete="new-password"
        value={form.pass} error={shown("pass")} ok={form.pass && !errors.pass ? "Strong password" : ""}
        onChange={set("pass")} onBlur={leave("pass")}>
        {/* strength bar, 4 parts filled from "Too weak" to "Strong"; the text line below says the same for screen readers */}
        <div className="meter" aria-hidden="true" data-level={form.pass ? strength.level : -1}>
          <span /><span /><span /><span />
        </div>
      </Field>
      <Field id="confirm" name="confirmPassword" label="Retype password" type="password" autoComplete="new-password"
        value={form.confirm} error={shown("confirm")} ok={form.confirm && !errors.confirm ? "Passwords match" : ""}
        onChange={set("confirm")} onBlur={leave("confirm")} />

      <div className="check">
        <label>
          <input
            type="checkbox"
            checked={agree}
            aria-invalid={shown("agree") ? true : undefined}
            aria-describedby={shown("agree") ? "agree-error" : undefined}
            onChange={(e) => { setAgree(e.target.checked); leave("agree")(); }}
          />
            <span>I agree to the <strong>Terms &amp; Conditions</strong></span>
        </label>
          <p className="field-error" id="agree-error">{shown("agree")}</p>
      </div>

      {msg && <p className="error" role="alert">{msg}</p>}

      <div className="actions">
        <button className="btn solid" type="submit" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
          <button className="link" type="button" onClick={() => goLogin()}>Sign in</button>
      </div>
    </form>
    </AuthLayout>
  );
}
export default Signup;
