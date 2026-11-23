import {useState, type FormEvent} from "react";
import {api, error_message} from "../api";
import AuthLayout from "./AuthLayout.tsx";
import Field from "./Field.tsx";
import {check_name, check_email, check_pass} from "../validate.ts";

type Props = {
    goLogin: (notice?: string) => void;
};

function Signup({goLogin}: Props) {
  const [form, setForm] = useState({name: "", email: "", pass: ""});
    const [touched, setTouched] = useState({name: false, email: false, pass: false, agree: false});
  const [agree, setAgree] = useState(false);
  const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

  const errors = {
      name: check_name(form.name),
      email: check_email(form.email),
      pass: check_pass(form.pass),
      agree: agree ? "" : "Please accept the Terms & Conditions",
  };
  // a field shows its error once the user has left it, then updates live while they type
  const shown = (k: keyof typeof errors) => (touched[k] ? errors[k] : "");
    const set = (k: keyof typeof form) => (v: string) => setForm({...form, [k]: v});
  const leave = (k: keyof typeof touched) => () => setTouched({...touched, [k]: true});

  async function send(e: FormEvent) {
      e.preventDefault();
    setTouched({name: true, email: true, pass: true, agree: true});
      if (errors.name || errors.email || errors.pass || errors.agree || busy) return;
    setMsg("");
      setBusy(true);
    try {
        await api.post("/api/signup", {name: form.name, email: form.email, password: form.pass});
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
      <Field id="pass" name="password" label="Password, at least 6 characters" type="password" autoComplete="new-password"
        value={form.pass} error={shown("pass")} onChange={set("pass")} onBlur={leave("pass")} />

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
