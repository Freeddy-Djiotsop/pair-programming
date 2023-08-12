import "./styles/menuBar.css";

export default function MenuBar() {
  return (
    <div className="header-top-menu-bar">
      <div className="logo-text">
        <p className="top">Pair-Programming</p>
        <p className="bottom">APP</p>
      </div>
      <nav className="top-menu-bar">
        <a href="/#">Home</a>
        <a href="/#">My work</a>
        <a href="/#">Blog</a>
        <a href="/#">About me</a>
      </nav>
      <div className="sing">
        <a>Sing in</a>
        <a>Sing up</a>
      </div>
    </div>
  );
}
