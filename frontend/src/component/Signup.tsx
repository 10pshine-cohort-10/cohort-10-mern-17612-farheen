import {useState, type FormEvent} from "react";
import {api} from "../api";

type Props = {
    goLogin: () => void;
};

function Signup({goLogin}: Props) {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");

  async function send(e: FormEvent) {
      e.preventDefault();
    if (!/^.{2,50}$/.test(name.trim())) {
        setMsg("Name needs 2 to 50 characters");
        return;
    }
    if (!/^(?=.{6,150}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setMsg("Email is not valid");
        return;
    }
    // same rule as the backend: bcrypt only reads 72 bytes, and Urdu letters or emoji take 2-4 bytes each
    if (pass.length < 6 || new TextEncoder().encode(pass).length > 72) {
        setMsg("Password needs at least 6 characters and must not be too long (72 bytes max)");
        return;
    }
    try {
        await api.post("/api/signup", {name, email, password: pass});
      goLogin();
    }
    catch (err: any) {
        setMsg(err.response?.data?.message ?? "Could not reach the server, check that it is running");
    }
  }

  return (
    <section className="auth">
    <form className="panel" aria-label="sign up form" noValidate onSubmit={send}>
        <p className="label">New account</p>
      <h1 className="display">Sign up</h1>

      <label className="field">
          <span className="label">Name</span>
        <input type="text" maxLength={50} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="field">
          <span className="label">Email</span>
        <input type="email" maxLength={150} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

        <label className="field">
          <span className="label">Password, at least 6 characters</span>
            <input type="password"value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>

      {msg && <p className="error">{msg}</p>}

        <button className="btn solid" type="submit">Create account</button>
      <button className="link" type="button" onClick={goLogin}>I already have one</button>
    </form>
      <figure className="auth-art"><img src="/note.svg" alt="" /></figure>
    </section>
  );
}
export default Signup;
