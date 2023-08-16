import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./styles/mainComponent.css";

export default function MainComponent() {
  const apiUrl = "http://localhost:3001/";
  const modeRef = useRef(null);
  const [theme, setTheme] = useState("vs-light");
  const files = [
    {
      name: "main.js",
      language: "javascript",
      abbr: "js",
      value: "",
    },
    {
      name: "main.c",
      language: "c",
      abbr: "c",
      value: "",
    },
    {
      name: "main.cpp",
      language: "cpp",
      abbr: "cpp",
      value: "",
    },
    {
      name: "main.py",
      language: "python",
      abbr: "py",
      value: "",
    },
  ];

  const editorRef = useRef(null);
  const [fileName, setFileName] = useState("main.c");
  const file = files.find((el) => el.name === fileName);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorDidChange = () => {
    file.value = editorRef.current.getValue();
  };

  const addDark = () => {
    document.querySelector("body").classList.toggle("dark");
    if (theme === "vs-light") {
      setTheme("vs-dark");
      modeRef.current.innerHTML = "light_mode";
    } else if (theme === "vs-dark") {
      setTheme("vs-light");
      modeRef.current.innerHTML = "dark_mode";
    }
  };
  const runCode = async () => {
    axios
      .post(`${apiUrl}run`, {
        language: file.abbr,
        code: file.value,
      })
      .then((res) => alert(res.data.output))
      .catch((err) => alert(err));
  };

  return (
    <>
      <div>
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
          <a onClick={runCode}>
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
      <div className="code-editor">
        <Editor
          height="90vh"
          width="100vw"
          theme={theme}
          defaultLanguage={file.language}
          onMount={handleEditorDidMount}
          onChange={handleEditorDidChange}
        />
      </div>
    </>
  );
}
