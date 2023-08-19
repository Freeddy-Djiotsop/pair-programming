import { Link } from "react-router-dom";
import "./styles/menuBar.css";

export default function MenuBar() {
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
      <div className="sing">
        <Link to="login">Sing in</Link>
        <Link to="register">Sing up</Link>
      </div>
    </header>
  );
}
