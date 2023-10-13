import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { socket } from "../api/socket";
import "./styles/userEditor.css";
import { useAuth } from "./Auth";
import { notierror, notisuccess } from "../toast";
import { useParams } from "react-router-dom";
import { languages } from "../language";

export default function UserEditor() {
  const { id } = useParams(); //ProjektId
  const auth = useAuth();
  socket.emit("set_username", auth.user.email);
  const modeRef = useRef(null);
  const terminalRef = useRef(null);
  const heightTerminalClosed = "87vh";
  const heightTerminalOpened = "70vh";
  const [height, setHeight] = useState(heightTerminalClosed);
  const [theme, setTheme] = useState("vs-light");
  const [outputs, setOutputs] = useState([]);
  const [shareState, setShareState] = useState(false);
  const [to, setTo] = useState("");
  const shareRef = useRef(null);
  const editorRef = useRef(null);
  const [projectName, SetProjectName] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [codeValue, setCodeValue] = useState("");
  const [extension, setExtension] = useState("");

  useEffect(() => {
    axios
      .get("project", {
        params: {
          id,
        },
      })
      .then((response) => {
        const tmp = response.data;
        console.log(tmp);
        SetProjectName(tmp.project.name);
        setFiles(tmp.files);
        setFolders(tmp.folders);
        setCodeValue(tmp.files[0].content);
        setExtension(tmp.files[0].extension);
      })
      .catch((error) => {
        console.log(error);
        notierror(`Fehler beim Abrufen der Projektdaten, Seite erneut laden`);
      });
  }, []);

  useEffect(() => {
    socket.emit("set_username", auth.user.email);

    socket.on("share_problem", (from) => {
      setShareState(false);
      notierror(
        `Es gab ein Problem bei der Verbindung mit${from}\nLaden Sie die Page erneut und versuchen es noch mal`
      );
    });
    socket.on("transfer_stop", () => {
      setShareState(false);
    });
    socket.on("transfer_request", (from) => {
      if (
        window.confirm(
          `${from} möchte eine Übertragung starten. Möchtest Sie akzeptieren?`
        )
      ) {
        setTo(from);
        setShareState(true);
        socket.emit("confirm_transfer", from, auth.user.email);
      } else {
        socket.emit("deny_transfer", from, auth.user.email);
      }
    });

    socket.on("transfer_confirmed", (from) => {
      notisuccess(`${from} hat bestätigt, Übertragen sollen jetzt starten`);
      setTo(from);
      setShareState(true);
    });
    socket.on("no_user", (from) => {
      notierror(`${from} nicht gefunden oder ist offline no-user`);
    });
    socket.on("same_user", (from) => {
      notierror(
        `Übertragung nicht möglich, denn das ist Ihr username: ${from}`
      );
    });
    socket.on("transfer_denied", (from) => {
      notierror(`${from} hat die Übertragung abgehlt bestätigt`);
    });
    socket.on("receive_code", (from, data) => {
      setCodeValue(data.code);
      setTo(from);
      setCodeValue(data.code);
    });
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorDidChange = () => {
    setCodeValue(editorRef.current.getValue());
    if (shareState)
      socket.emit("send_code", auth.user.email, to, { code: codeValue });
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
        console.error(error.response.data.error);
        terminalRef.current.style.backgroundColor = "#702626";
        setOutputs(error.response.data.error.stderr.split("\n"));
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

  const handleShare = () => {
    if (!shareState) {
      const input = window.prompt("Bitte geben Sie der Benutzername(email):");
      if (input === null) return;

      if (window.confirm(`Wir versuchen Sie nun zu verbinden mit: ${input}`)) {
        socket.emit("request_transfer", auth.user.email, input);
      }
    } else {
      socket.emit("stop_transfer", to);
      setShareState(false);
    }
  };

  const handleClickFile = (id) => {
    axios
      .get("file", {
        params: {
          id,
        },
      })
      .then((response) => {
        console.error(response);
        const file = response.data.file;
        setCodeValue(file.content);
        setExtension(file.extension);
        document.querySelectorAll("li.file-link").forEach((li) => {
          li.style.backgroundColor = "transparent";
        });
        document.getElementById(id).style.backgroundColor = "#dddada";
      })
      .catch((error) => {
        notierror(error.response.data.error.message);
        console.error(error);
      });
  };

  const handleClickFolder = (id) => {
    document.querySelectorAll("li.folder-link").forEach((li) => {
      li.querySelector("a.folder-expanded i.material-icons").innerHTML =
        "expand_more";
      li.querySelector("ul.folder-bar").style.backgroundColor = "#e4e9f7";
    });
    const liTag = document.getElementById(id);

    const state = liTag.classList.toggle("open");
    if (state) {
      liTag.querySelector("ul.folder-bar").style.backgroundColor = "#cad6f7";
      liTag.querySelector("a.folder-expanded i.material-icons").innerHTML =
        "expand_less";
    }
  };

  const loadFiles = (data) => {
    return data.map((file) => (
      <li
        className="file-link"
        key={file.id}
        id={file.id}
        onClick={() => handleClickFile(file.id)}
      >
        <ul className="file-bar">
          <li className="file-name truncate-text">
            <a>{file.name}</a>
          </li>
          <li className="file-three-dot-button">
            <a>
              <i className="material-icons">more_vert</i>
            </a>
            <ul className="file drop-down">
              <li>
                <a className="drop-down-button">delete</a>
              </li>
              <li>
                <a className="drop-down-button">download</a>
              </li>
              <li>
                <a className="drop-down-button" onClick={() => {}}>
                  share
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    ));
  };

  const loadFolders = (data) => {
    return data.map((folder) => (
      <li
        className="folder-link"
        key={folder.id}
        id={folder.id}
        onClick={() => handleClickFolder(folder.id)}
      >
        <ul className="folder-bar">
          <li className="folder-name truncate-text">
            <a className="folder-expanded">
              <i className="material-icons">expand_more</i>
            </a>
            <a className="folder-name">{folder.name}</a>
          </li>
          <li className="folder-three-dot-button">
            <a>
              <i className="material-icons">more_vert</i>
            </a>
            <ul className="folder drop-down">
              <li>
                <a className="drop-down-button">delete</a>
              </li>
              <li>
                <a className="drop-down-button">New File</a>
              </li>
              <li>
                <a className="drop-down-button">New Folder</a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="folder-content">
          <div>
            <ul>{loadFolders(folder.subfolders)}</ul>
          </div>
          <div>
            <ul>{loadFiles(folder.files)}</ul>
          </div>
        </div>
      </li>
    ));
  };

  return (
    <div className="editor-panel">
      <nav className="sidebar-menu-bar">
        <a onClick={runCode}>
          <i className="material-icons icon">play_arrow</i>
        </a>
        <a onClick={handleShare}>
          <i ref={shareRef} className="material-icons icon">
            {shareState ? "cancel_schedule_send" : "share"}
          </i>
        </a>
        {auth.isAuthenticated ? (
          <a onClick={auth.logout}>
            <i className="material-icons icon">logout</i>
          </a>
        ) : null}
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

            <li className="three-dot">
              <a className="three-dot-button">
                <i className="material-icons">more_vert</i>
              </a>
              <ul className="project drop-down">
                <li>
                  <a className="drop-down-button">New File</a>
                </li>
                <li>
                  <a className="drop-down-button">New Folder</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="editor-right-panel-content">
          <div className="project-folders">
            <ul className="editor-folders">{loadFolders(folders)}</ul>
          </div>
          <div className="project-files">
            <ul className="editor-files">{loadFiles(files)}</ul>
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
