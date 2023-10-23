import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import "./styles/gastEditor.css";
import { languages } from "../language";
import { notierror } from "../toast";
import { v4 as uuid } from "uuid";

const heightTerminalClosed = "87vh";
const heightTerminalOpened = "70vh";
const projectName = "PPA Gast";
const name = "main";

export default function GastEditor() {
  const file_id = uuid();
  const modeRef = useRef(null);
  const terminalRef = useRef(null);
  const editorRef = useRef(null);
  const [outputs, setOutputs] = useState([]);
  const [height, setHeight] = useState(heightTerminalClosed);
  const [theme, setTheme] = useState("vs-light");
  const [codeValue, setCodeValue] = useState("");
  const [extension, setExtension] = useState("js");
  const [fileName, setFileName] = useState(`${name}.${extension}`);

  useEffect(() => {
    axios
      .get("gast/basic", {
        params: {
          extension,
        },
      })
      .then((response) => {
        setCodeValue(response.data.code);
      })
      .catch((error) => {
        notierror(`Unerwarteter Fehler`);
        console.error(error);
      });
  }, [extension]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorDidChange = () => {
    setCodeValue(editorRef.current.getValue());
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
    if (extension === "txt" || extension === "html" || extension === "css") {
      notierror(`.${extension} Dateien werden nicht übersetzt`);
      return;
    }
    if (codeValue.length === 0) {
      notierror("Editor ist leer");
      return;
    }
    axios
      .post("run", {
        language: extension,
        code: codeValue,
      })
      .then((res) => {
        terminalRef.current.style.backgroundColor = "#000";
        setOutputs(res.data.output.split("\n"));
      })
      .catch((error) => {
        console.log(error);
        terminalRef.current.style.backgroundColor = "#702626";
        let msg = [];
        if (error.code === "ERR_NETWORK") {
          const errMsg = `${error.message}: bitte auf run code klicken`;
          msg.push(errMsg);
          notierror(errMsg);
        } else {
          msg = error.response.data.error.stderr.split("\n");
        }
        setOutputs(msg);
      })
      .finally(() => {
        openTerminal();
      });
  };

  const openTerminal = () => {
    terminalRef.current.style.opacity = "1";
    setHeight(heightTerminalOpened);
  };

  const closeTerminal = () => {
    terminalRef.current.style.opacity = "0";
    setHeight(heightTerminalClosed);
  };
  const vollscreenTerminal = () => {
    terminalRef.current.style.opacity = "1";
    terminalRef.current.style.height = heightTerminalClosed;
    setHeight("0vh");
  };

  const getType = (fileExtension) => {
    let mime = undefined;
    switch (fileExtension) {
      case "c":
        mime = "text/x-c";
        break;
      case "cpp":
        mime = "text/x-c++";
        break;
      case "css":
        mime = "text/css";
        break;
      case "html":
        mime = "text/html";
        break;
      case "js":
        mime = "application/javascript";
        break;
      case "php":
        mime = "application/x-php";
        break;
      case "py":
        mime = "text/x-python";
        break;
      case "txt":
        mime = "text/plain";
        break;
      default:
        throw "Ungültiger Dateityp";
    }
    return mime;
  };

  const downloadFile = () => {
    try {
      const type = getType(extension);
      const blob = new Blob([editorRef.current.getValue()], { type });
      const url = window.URL.createObjectURL(blob);

      // Erstelle einen Link, um die Datei herunterzuladen
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);

      a.click(); // Klicke auf den Link, um die Datei herunterzuladen
      window.URL.revokeObjectURL(url); // Entferne den Link nach dem Herunterladen
    } catch (error) {
      notierror(`Fehler beim Herunterladen der Datei`);
      console.error(error);
    }
  };

  const handelSelection = (event) => {
    setExtension(event.target.value);
    setExtension(event.target.value);
    setFileName(`${name}.${event.target.value}`);
  };

  return (
    <div className="editor-panel">
      <nav className="sidebar-menu-bar">
        <a onClick={runCode}>
          <i className="material-icons icon" title="Kompilieren">
            play_arrow
          </i>
        </a>
        <div className="mode" onClick={addDark}>
          <a className="dark_light">
            <i ref={modeRef} className="material-icons icon">
              dark_mode
            </i>
          </a>
        </div>
      </nav>
      <div className="code-editor">
        <Editor
          height={height}
          width="80%"
          theme={theme}
          language={extension ? languages[extension].name : "txt"}
          onMount={handleEditorDidMount}
          onChange={handleEditorDidChange}
          value={codeValue}
        />
      </div>
      <div className="editor-right-panel">
        <div className="editor-right-panel-bar">
          <ul className="bar-content">
            <li className="project-name truncate-text">
              <span>{projectName}</span>
            </li>
          </ul>
        </div>
        <div className="editor-right-panel-content">
          <div className="project-files">
            <ul className="editor-files">
              <li className="file-link" key={file_id} id={file_id}>
                <ul
                  className="file-bar"
                  style={{ backgroundColor: "var(--toggle-color)" }}
                >
                  <li className="file-name truncate-text">
                    <span>{fileName}</span>
                  </li>
                  <li className="file-three-dot-button">
                    <span>
                      <i className="material-icons">more_vert</i>
                    </span>
                    <ul className="file drop-down">
                      <li>
                        <a className="drop-down-button" onClick={downloadFile}>
                          download
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="gast-selection">
            <label htmlFor="language" className="label">
              Choose a language:
            </label>
            <select
              value={extension}
              className="select"
              onChange={handelSelection}
            >
              {Object.keys(languages).map((key) => (
                <option key={key} value={key}>
                  {languages[key].extension}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="terminal-bar">
        <a onClick={closeTerminal}>
          <i className="material-icons icon">close</i>
        </a>
        <a onClick={openTerminal}>
          <i className="material-icons icon">minimize</i>
        </a>
        <a onClick={vollscreenTerminal}>
          <i className="material-icons icon">expand_less</i>
        </a>
      </div>
      <div ref={terminalRef} className="terminal">
        <div className="termin-output">
          {outputs.map((text, index) => (
            <p key={index}>
              {text.includes(".c:") ? text.split(".c:")[1] : text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
