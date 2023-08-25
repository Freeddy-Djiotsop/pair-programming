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
        <a href="/#">My work</a>
        <a href="/#">Blog</a>
        <a href="/#">About me</a>
      </nav>
      {!auth.isLogged ? (
        <div className="sing">
          <Link to="login">Sign in</Link>
          <Link to="register">Sign up</Link>
        </div>
      ) : null}
    </header>
  );
}
