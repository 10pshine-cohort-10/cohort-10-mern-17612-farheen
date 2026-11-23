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

  // stable function, so Success does not re-run its /api/me request on every render
  const logout = useCallback(() => {
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
