import {useEffect, useState} from "react";
import {api, error_message, error_status} from "../api";
import AuthLayout from "./AuthLayout.tsx";

type User = {id: string; name: string; email: string};

type Props = {
    onLogout: (old: string | null) => void;
};

// test page: /api/me only answers with a valid token, so seeing the user here proves login worked end to end
function Success({onLogout}: Props) {
    const [user, setUser] = useState<User | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
      // ignore the answer if the page was left before it came back
      let live = true;
      const mine = localStorage.getItem("token");
    api.get<User>("/api/me")
        .then((res) => { if (live) setUser(res.data); })
      .catch((err) => {
          if (!live) return;
          if (error_status(err) === 401) onLogout(mine); // token expired or not valid, back to sign in
          else setMsg(error_message(err));
      });
      return () => { live = false; };
  }, [onLogout]);

  async function logout() {
      const mine = localStorage.getItem("token");
      try {
        await api.post("/api/logout");
      }
    catch {
        // token is dropped below anyway, a failed logout call must not keep the user signed in
    }
      onLogout(mine);
  }

  return (
    <AuthLayout title="Welcome">
    <div role="status">
      <h1 className="display">Login successful</h1>

      {user && (
          <p className="lead">Signed in as <strong>{user.name}</strong> ({user.email})</p>
      )}
        {!user && !msg && <p className="lead">Checking your session...</p>}
      {msg && <p className="error">{msg}</p>}
    </div>
      <div className="actions">
        <button className="btn solid" type="button" onClick={logout}>Log out</button>
      </div>
    </AuthLayout>
  );
}
export default Success;
