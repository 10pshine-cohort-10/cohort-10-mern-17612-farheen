import {useState, type FormEvent} from "react";
import {api, error_message, error_status} from "../api";
import AuthLayout from "./AuthLayout.tsx";
import Field from "./Field.tsx";
import {check_email} from "../validate.ts";

type Props = {
    goLogin: () => void;
};

function Forgot({goLogin}: Props) {
  const [email, setEmail] = useState("");
    const [touched, setTouched] = useState(false);
  const [msg, setMsg] = useState({text: "", ok: false});
    const [busy, setBusy] = useState(false);

  const error = check_email(email);

  async function send(e: FormEvent) {
      e.preventDefault();
    setTouched(true);
      if (error || busy) return;
    setMsg({text: "", ok: false});
      setBusy(true);
    try {
        const res = await api.post("/api/forgot-password", {email});
      setMsg({text: res.data?.message ?? "If this email has an account, a reset link has been sent.", ok: true});
    }
    catch (err) {
        // the backend has no reset route yet, it answers 404 "Route not found"
      const text = error_status(err) === 404 ? "Password reset is not available yet. Please try again later." : error_message(err);
        setMsg({text, ok: false});
    }
    finally {
        setBusy(false);
    }
  }

  return (
    <AuthLayout title="Forgot password">
    <form aria-label="forgot password form" noValidate onSubmit={send}>
      <h1 className="display">Forgot password?</h1>
        <p className="lead">Enter your email and we will send you a link to reset your password.</p>

      <Field id="email" name="email" label="Email" type="email" autoComplete="email"
        value={email} error={touched ? error : ""} onChange={setEmail} onBlur={() => setTouched(true)} />

        {msg.text && <p className={msg.ok ? "notice" : "error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}

      <div className="actions">
        <button className="btn solid" type="submit" disabled={busy}>{busy ? "Sending..." : "Send reset link"}</button>
          <button className="link" type="button" onClick={goLogin}>Back to sign in</button>
      </div>
    </form>
    </AuthLayout>
  );
}
export default Forgot;
