import {useEffect, type ReactNode} from "react";
import side from "../../images/login-page-side.jpg";
import Logo from "./Logo.tsx";

type Props = {
    title: string;
    children: ReactNode;
};

// shared page for sign in, sign up, forgot password and the success screen:
// form on the left half, the picture covering the whole right half
function AuthLayout({title, children}: Props) {
  // each screen gets its own tab title, so the user and screen readers know where they are
  useEffect(() => {
      document.title = `${title} · Quick Notes`;
  }, [title]);

  return (
    <div className="auth">
      <main className="panel">
        {/* one narrow column, so the brand, text and fields all line up on the same left edge */}
        <div className="column">
          <header className="brand-block">
              <p className="brand"><Logo /></p>          </header>
          {children}
        </div>
      </main>
        <figure className="auth-art" aria-hidden="true">
          <img src={side} alt="" width="960" height="1120" decoding="async" fetchPriority="high" />
        </figure>
    </div>
  );
}
export default AuthLayout;
