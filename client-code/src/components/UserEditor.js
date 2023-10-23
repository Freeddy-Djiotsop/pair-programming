import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { socket } from "../api/socket";
import "./styles/userEditor.css";
import { useAuth } from "./Auth";
import { notierror, notisuccess } from "../toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { languages } from "../language";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { useSocket } from "./SocketContext";

Modal.setAppElement("#root");
const onModel = ["Project", "Folder"];
const dashboardEndpunkt = "/project";
const href = "/share";

export default function UserEditor() {
  const { id } = useParams(); //ProjektId
  const auth = useAuth();
  const socketContext = useSocket();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const modeRef = useRef(null);
  const terminalRef = useRef(null);
  const heightTerminalClosed = "87vh";
  const heightTerminalOpened = "70vh";
  const [height, setHeight] = useState(heightTerminalClosed);
  const [theme, setTheme] = useState("vs-light");
  const [outputs, setOutputs] = useState([]);
  const shareRef = useRef(null);
  const editorRef = useRef(null);
  const [projectName, SetProjectName] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [codeValue, setCodeValue] = useState("");
  const [extension, setExtension] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentId, setParentId] = useState("");
  const [isloadProject, setIsLoadProject] = useState(false);
  const [isCreateFile, setIsCreateFile] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState("");

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePopstate = (e) => {
      const href = window.location.href;
      navigate(dashboardEndpunkt, { replace: true });
      e.preventDefault();
      const anwser = window.confirm(
        "Möchten Sie die Seite wirklich verlassen?"
      );
      if (!anwser) {
        window.history.pushState(null, null, href);
      }
    };

    window.addEventListener("popstate", handlePopstate);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (!socketContext.shareState && location.pathname.endsWith(href))
      navigate(dashboardEndpunkt, { replace: true });
    else loadProject();
  }, [isloadProject, socketContext.shareState]);

  useEffect(() => {
    socketContext.on();
    socket.on("error_save_code", () => {
      notierror(`Fehler beim Speichern der Datei in der Datenbank`);
    });
    socket.on("share_problem", (from) => {
      socketContext.setShareState(false);
      notierror(
        `Es gab ein Problem bei der Verbindung mit ${from}\n Laden Sie MÖGLICHERWEISE die Seite neu und versuchen es noch mal`
      );
    });
    socket.on("transfer_stop", (from) => {
      socketContext.setShareState(false);
      socketContext.setProjectId("");
      notierror(`${from} hat die Übertragung beendet`);
      if (location.pathname.endsWith(href))
        navigate(dashboardEndpunkt, { replace: true });
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
    socket.on("reload", (from) => {
      notierror(
        `${from} hat seine Seite neu geladen. Übertragung  wurde gestoppt`
      );
      socketContext.setShareState(false);
      socketContext.setProjectId("");
    });

    socket.on("transfer_confirmed", (from) => {
      try {
        socket.emit("send_file_change", auth.user.email, from, {
          file_id: selectedFileId,
          code: editorRef.current.getValue(),
          extension,
        });
        socketContext.setTo(from);
        socketContext.setShareState(true);
        notisuccess(`${from} hat bestätigt, Übertragen sollen jetzt starten`);
      } catch (error) {
        notierror(
          "unerwartete Fehler. Seite lade und Verbindung noch mal versuchen"
        );
        socket.emit("stop_transfer", auth.user.email, from);
      }
    });
    socket.on("receive_code", (from, data) => {
      socketContext.setTo(from);
      setCodeValue(data.code);
    });
    socket.on("receive_file_change", (from, data) => {
      setExtension(data.extension);
      setSelectedFileId(data.file_id);
      socketContext.setTo(from);
      setCodeValue(data.code);
      fileHighlight(data.file_id);
    });
  }, [socket]);

  const loadProject = () => {
    let projectId = id;
    if (
      location.pathname.endsWith(href) &&
      socketContext.project_id.trim().length !== 0
    )
      projectId = socketContext.project_id;
    if (projectId !== "share") {
      axios
        .get("project", {
          params: {
            id: projectId,
          },
        })
        .then((response) => {
          const tmp = response.data;
          SetProjectName(tmp.project.name);
          setFiles(tmp.files);
          setFolders(tmp.folders);
          setCodeValue(tmp.files[0].content);
          setExtension(tmp.files[0].extension);
          setSelectedFileId(tmp.files[0].id);
        })
        .catch((error) => {
          console.error(error);
          notierror(`Fehler beim Abrufen der Projektdaten, Seite neu laden`);
        });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorDidChange = () => {
    setCodeValue(editorRef.current.getValue());
    if (!location.pathname.endsWith(href))
      socket.emit("save_code", {
        file_id: selectedFileId,
        code: editorRef.current.getValue(),
      });
    if (socketContext.shareState) {
      try {
        socket.emit("send_code", auth.user.email, socketContext.to, {
          code: editorRef.current.getValue(),
        });
      } catch (error) {
        notierror(
          "unerwartete Fehler. Seite lade und Verbindung noch mal versuchen"
        );
        socket.emit("stop_transfer", socketContext.to);
      }
    }
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
        console.error(error);
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
    if (!socketContext.shareState) {
      const input = window.prompt("Bitte geben Sie der Benutzername(email):");
      if (input === null) return;

      if (window.confirm(`Wir versuchen Sie nun zu verbinden mit: ${input}`)) {
        socket.emit("request_transfer", auth.user.email, input, {
          project_id: id,
        });
      }
    } else {
      socket.emit("stop_transfer", auth.user.email, socketContext.to);
      socketContext.setShareState(false);
      socketContext.setProjectId("");
      if (location.pathname.endsWith(href))
        navigate(dashboardEndpunkt, { replace: true });
    }
  };

  const fileHighlight = (id) => {
    document.querySelectorAll("li.file-link").forEach((li) => {
      li.style.backgroundColor = "transparent";
    });
    const li = document.getElementById(id);
    if (li != null) li.style.backgroundColor = "var(--toggle-color)";
  };

  const handleClickFile = (id) => {
    axios
      .get("file", {
        params: {
          id,
        },
      })
      .then((response) => {
        const file = response.data.file;
        setCodeValue(file.content);
        setExtension(file.extension);
        fileHighlight(id);
        if (socketContext.shareState) {
          socket.emit("send_file_change", auth.user.email, socketContext.to, {
            file_id: file.id,
            code: file.content,
            extension: file.extension,
          });
        }
      })
      .catch((error) => {
        notierror(`Fehler beim Abrufen der Datei, Seite bitte neu laden`);
        console.error(error);
      });
  };

  const handleClickFolder = (id) => {
    document.querySelectorAll("li.folder-link").forEach((li) => {
      li.querySelector("a.folder-expanded i.material-icons").innerHTML =
        "expand_more";
      li.querySelector("ul.folder-bar").style.backgroundColor =
        "var(--body-color)";
    });
    const liTag = document.getElementById(id);

    const state = liTag.classList.toggle("open");
    if (state) {
      liTag.querySelector("ul.folder-bar").style.backgroundColor =
        "var(--sidebar-color)";
      liTag.querySelector("a.folder-expanded i.material-icons").innerHTML =
        "expand_less";
    }
  };

  const openModal = (id, status) => {
    setParentId(id);
    setIsCreateFile(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    const { name, language } = data;

    if (name.length <= 2) {
      notierror("Name soll mehr als 2 Zeichen haben");
      return;
    }
    let index = 1;
    if (parentId === id) index = 0;
    try {
      if (isCreateFile)
        await axios.post("file", {
          email: auth.user.email,
          parentId,
          name,
          model: onModel[index],
          extension: languages[language].extension,
        });
      else
        await axios.post("folder", {
          email: auth.user.email,
          parentId,
          name,
          model: onModel[index],
        });
      closeModal();
      setIsLoadProject(!isloadProject);
      notisuccess(`${name} erfolgreich erstellt`);
    } catch (error) {
      notierror(`Fehler beim Erstellen, Anfrage erneut senden`);
    }
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

  const downloadFile = (id) => {
    axios
      .get("file", {
        params: {
          id,
        },
      })
      .then((response) => {
        const file = response.data.file;
        const type = getType(file.extension);
        const blob = new Blob([file.content], { type });
        const url = window.URL.createObjectURL(blob);

        // Link für das Herunterzuladen erstellen
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.style.display = "none";
        document.body.appendChild(a);

        a.click(); // Datei herunterzuladen
        window.URL.revokeObjectURL(url); // Link Entfernen
      })
      .catch((error) => {
        notierror(`Fehler beim Herunterladen der Datei`);
        console.error(error);
      });
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
            <span>{file.name}</span>
          </li>
          <li className="file-three-dot-button">
            <span>
              <i className="material-icons">more_vert</i>
            </span>
            <ul className="file drop-down">
              <li>
                <span className="drop-down-button">delete</span>
              </li>
              <li>
                <a
                  className="drop-down-button"
                  onClick={() => downloadFile(file.id)}
                >
                  download
                </a>
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
                <a
                  className="drop-down-button"
                  onClick={() => openModal(folder.id, true)}
                >
                  New File
                </a>
              </li>
              <li>
                <a
                  className="drop-down-button"
                  onClick={() => openModal(folder.id, false)}
                >
                  New Folder
                </a>
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
    <>
      <div className="editor-panel">
        <nav className="sidebar-menu-bar">
          <a onClick={runCode}>
            <i className="material-icons icon" title="Kompilieren">
              play_arrow
            </i>
          </a>
          <a onClick={handleShare}>
            <i
              ref={shareRef}
              className="material-icons icon"
              title={socketContext.shareState ? "Stop Teilen" : "Teilen"}
            >
              {socketContext.shareState ? "cancel_schedule_send" : "share"}
            </i>
          </a>
          {auth.isAuthenticated ? (
            <a onClick={auth.logout}>
              <i className="material-icons icon" title="logout">
                logout
              </i>
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
                    <a
                      className="drop-down-button"
                      onClick={() => openModal(id, true)}
                    >
                      New File
                    </a>
                  </li>
                  <li>
                    <a
                      className="drop-down-button"
                      onClick={() => openModal(id, false)}
                    >
                      New Folder
                    </a>
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
      <Modal
        isOpen={isModalOpen}
        appElement={document.getElementById("root")}
        className={
          isCreateFile ? "editor-custom-modal" : "folder editor-custom-modal"
        }
        overlayClassName="custom-overlay"
        onRequestClose={closeModal}
        contentLabel={isCreateFile ? "Create new File" : "Create new Folder"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="dashboard-input-box">
            <input
              type="text"
              placeholder="Enter a name"
              autoFocus
              {...register("name", { required: true })}
            />
          </div>
          {isCreateFile ? (
            <div className="dashboard-selection">
              <label htmlFor="language" className="label">
                Choose a language:
              </label>
              <select
                className="select"
                {...register("language", { required: true })}
              >
                {Object.keys(languages).map((key) => (
                  <option key={key} value={key}>
                    {languages[key].extension}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div
            className={
              isCreateFile ? "dasboard-button" : "folder dasboard-button"
            }
          >
            <button onClick={closeModal}>Abbrechen</button>
            <button type="submit">Erstellen</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
