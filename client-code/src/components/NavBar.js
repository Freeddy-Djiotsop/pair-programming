export default function NavBar({ callSetCodeEditorTheme }) {
  const addDark = () => {
    document.querySelector("body").classList.toggle("dark");
    callSetCodeEditorTheme();
  };

  return (
    <nav className="sidebar close">
      <header>
        <div className="image-text">
          <span>
            <span>DDF</span>
          </span>
          <div className="text logo-text">
            <span className="title">CodeEditor</span>
            <span className="subtitle">Pair Programming</span>
          </div>
        </div>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <a href="#">
                <i className="material-icons icon">description</i>
              </a>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className="material-icons icon">file_upload</i>
              </a>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className="material-icons icon">download</i>
              </a>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className="material-icons icon">note_add</i>
              </a>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className="material-icons icon">play_arrow</i>
              </a>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className="material-icons icon">create_new_folder</i>
              </a>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
          <ul>
            <li>
              <a href="#">
                <i className="material-icons icon">logout</i>
              </a>
            </li>

            <li className="mode" onClick={addDark}>
              <div className="toggle-switch">
                <i className="material-icons icon moon">dark_mode</i>
                <i className="material-icons icon sun">light_mode</i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
