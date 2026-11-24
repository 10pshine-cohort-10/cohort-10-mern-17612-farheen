import {useState, type FormEvent} from "react";
import {api, error_message} from "../api";
import AuthLayout from "./AuthLayout.tsx";
import Field from "./Field.tsx";
import {check_email, check_filled} from "../validate.ts";

type Props = {
  notice: string;
  onLogin: () => void;
    goSignup: () => void;
  goForgot: () => void;
};

const check_login_pass = check_filled("Password");

function Login({notice, onLogin, goSignup, goForgot}: Props) {
  const [form, setForm] = useState({email: "", pass: ""});
    const [touched, setTouched] = useState({email: false, pass: false});
  const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

  const errors = {email: check_email(form.email), pass: check_login_pass(form.pass)};
  // a field shows its error once the user has left it, then updates live while they type
  const shown = (k: keyof typeof errors) => (touched[k] ? errors[k] : "");
    const set = (k: keyof typeof form) => (v: string) => setForm({...form, [k]: v});
  const leave = (k: keyof typeof touched) => () => setTouched({...touched, [k]: true});

  async function send(e: FormEvent) {
      e.preventDefault();
    setTouched({email: true, pass: true});
      if (errors.email || errors.pass || busy) return;
    setMsg("");
      setBusy(true);
    try {
        const res = await api.post<{token: string}>("/api/login", {email: form.email, password: form.pass});
      localStorage.setItem("token", res.data.token);
        onLogin();
    }
    catch (err) {
        setMsg(error_message(err));
    }
    finally {
        setBusy(false);
    }
  }

  return (
    <AuthLayout title="Sign in">
    <form aria-label="sign in form" noValidate onSubmit={send}>
      <h1 className="display">Welcome back!</h1>
        <p className="lead">Please sign in to your account.</p>

      <Field id="email" name="email" label="Email" type="email" autoComplete="email"
        value={form.email} error={shown("email")} onChange={set("email")} onBlur={leave("email")} />
      <Field id="pass" name="password" label="Password" type="password" autoComplete="current-password"
        value={form.pass} error={shown("pass")} onChange={set("pass")} onBlur={leave("pass")} />

      <div className="row-end">
          <button className="link small" type="button" onClick={goForgot}>Forgot password?</button>
      </div>

        {msg && <p className="error" role="alert">{msg}</p>}
      {!msg && notice && <p className="notice" role="status">{notice}</p>}

      <div className="actions">
        <button className="btn solid" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
      </div>

        <p className="switch">Don't have an account? <button className="link" type="button" onClick={goSignup}>Sign up</button></p>
    </form>
    </AuthLayout>
  );
}
export default Login;
