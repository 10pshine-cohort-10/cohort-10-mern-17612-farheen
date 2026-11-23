import {useEffect, useState} from "react";
import {api} from "../api";

type User = {id: string; name: string; email: string};

type Props = {
    onLogout: () => void;
};

// test page: /api/me only answers with a valid token, so seeing the user here proves login worked end to end
function Success({onLogout}: Props) {
    const [user, setUser] = useState<User | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
      api.get("/api/me")
        .then((res) => setUser(res.data))
      .catch((err) => {
          if (err.response?.status === 401) onLogout(); // token expired or not valid, back to sign in
          else setMsg(err.response?.data?.message ?? "Could not reach the server, check that it is running");
      });
  }, [onLogout]);

  async function logout() {
      try {
        await api.post("/api/logout");
      }
    catch {
        // token is dropped below anyway, a failed logout call must not keep the user signed in
    }
      onLogout();
  }

  return (
    <section className="auth">
    <div className="panel" role="status">
        <p className="label">Account</p>
      <h1 className="display">Login successful</h1>

      {user && (
          <p>Signed in as <strong>{user.name}</strong> ({user.email})</p>
      )}
        {!user && !msg && <p className="label">Checking your session...</p>}
      {msg && <p className="error">{msg}</p>}

        <button className="btn solid" type="button" onClick={logout}>Log out</button>
    </div>
      <figure className="auth-art"><img src="/note.svg" alt="" /></figure>
    </section>
  );
}
export default Success;
