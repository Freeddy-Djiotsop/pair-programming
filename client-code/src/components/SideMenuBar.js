import "./styles/sideMenuBar.css";
import { useRef } from "react";

export default function SideMenuBar({ callSetCodeEditorTheme }) {
  const modeRef = useRef(null);
  const addDark = () => {
    document.querySelector("body").classList.toggle("dark")
      ? (modeRef.current.innerHTML = "light_mode")
      : (modeRef.current.innerHTML = "dark_mode");
    callSetCodeEditorTheme();
  };

  return (
    <div className="header-sidebar-menu-bar">
      <nav className="sidebar-menu-bar">
        <a href="/#">
          <i className="material-icons icon">description</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">file_open</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">file_upload</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">download</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">note_add</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">play_arrow</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">create_new_folder</i>
        </a>
        <a href="/#">
          <i className="material-icons icon">logout</i>
        </a>

        <div className="mode" onClick={addDark}>
          <a className="dark_light">
            <i ref={modeRef} className="material-icons icon">
              dark_mode
            </i>
          </a>
        </div>
      </nav>
    </div>
  );
}
