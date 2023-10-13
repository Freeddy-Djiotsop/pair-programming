import { Link } from "react-router-dom";
import "./styles/menuBar.css";
import { useAuth } from "./Auth";

export default function MenuBar() {
  const auth = useAuth();

  return (
    <header className="header-top-menu-bar">
      <Link className="logo-text" to="">
        <p className="top">Pair-Programming</p>
        <p className="bottom">APP</p>
      </Link>
      <nav className="top-menu-bar">
        <Link to="">Home</Link>
        {auth.isAuthenticated ? (
          <>
            <Link to="/project">Dashboard</Link>
            <a onClick={auth.logout}>Logout</a>
          </>
        ) : null}
      </nav>
      {auth.isAuthenticated ? null : (
        <div className="sing">
          <Link to="login">Sign in</Link>
          <Link to="register">Sign up</Link>
        </div>
      )}
    </header>
  );
}
