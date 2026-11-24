import {useCallback, useState} from "react";
import Login from "./component/Login.tsx";
import Signup from "./component/Signup.tsx";
import Forgot from "./component/Forgot.tsx";
import Success from "./component/Success.tsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
    const [screen, setScreen] = useState<"login" | "signup" | "forgot">("login");
  const [notice, setNotice] = useState(""); // e.g. "Account created" shown on the sign in screen

  const go = (next: typeof screen, message = "") => {
      setNotice(message);
    setScreen(next);
  };

  // stable function, so Success does not re-run its /api/me request on every render.
  // old = the token the finished request was sent with. If a different token is stored, the user signed in
  // again since, so keep that session; if none is stored (e.g. another tab logged out), still clear this screen.
  const logout = useCallback((old: string | null) => {
      const now = localStorage.getItem("token");
      if (now && now !== old) return;
      localStorage.removeItem("token");
      setToken("");
    setScreen("login");
  }, []);

  if (token) {
      return <Success onLogout={logout} />;
  }
  if (screen === "signup") {
      return <Signup goLogin={(message) => go("login", message)} />;
  }
  if (screen === "forgot") {
      return <Forgot goLogin={() => go("login")} />;
  }
  return (
    <Login
      notice={notice}
      onLogin={() => setToken(localStorage.getItem("token") ?? "")}
      goSignup={() => go("signup")}
      goForgot={() => go("forgot")}
    />
  );
}
export default App;
