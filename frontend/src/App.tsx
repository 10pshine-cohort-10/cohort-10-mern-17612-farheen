import {useState} from "react";
import Login from "./component/Login.tsx";
import Signup from "./component/Signup.tsx";
import Success from "./component/Success.tsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
    const [screen, setScreen] = useState<"login" | "signup">("login");

  function logout() {
      localStorage.removeItem("token");
      setToken("");
    setScreen("login");
  }

  if (token) {
      return <Success onLogout={logout} />;
  }
  if (screen === "signup") {
      return <Signup goLogin={() => setScreen("login")} />;
  }
  return (
    <Login
      onLogin={() => setToken(localStorage.getItem("token") ?? "")}
      goSignup={() => setScreen("signup")}
    />
  );
}
export default App;
