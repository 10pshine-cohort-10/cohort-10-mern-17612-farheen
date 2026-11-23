import {useState, type FormEvent} from "react";
import {api} from "../api";

type Props = {
  onLogin: () => void;
    goSignup: () => void;
};

function Login({onLogin, goSignup}: Props) {
    const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");

  async function send(e: FormEvent) {
      e.preventDefault();
    try {
        const res = await api.post("/api/login", {email, password: pass});
      localStorage.setItem("token", res.data.token);
        onLogin();
    }
    catch (err: any) {
        setMsg(err.response?.data?.message ?? "Could not reach the server, check that it is running");
    }
  }

  return (
    <section className="auth">
    <form className="panel" aria-label="sign in form" noValidate onSubmit={send}>
        <p className="label">Account</p>
      <h1 className="display">Sign in</h1>

        <label className="field">
          <span className="label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

      <label className="field">
          <span className="label">Password</span>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
      </label>

        {msg && <p className="error">{msg}</p>}

      <button className="btn solid" type="submit">Sign in</button>
        <button className="link" type="button" onClick={goSignup}>Create an account</button>
    </form>
      <figure className="auth-art"><img src="/note.svg" alt="" /></figure>
    </section>
  );
}
export default Login;
