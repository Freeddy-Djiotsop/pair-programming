import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { socket } from "../api/socket";
import "./styles/userEditor.css";
import { useAuth } from "./Auth";
import { notierror, notisuccess } from "../toast";
import { useParams } from "react-router-dom";
import { languages } from "../language";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { useSocket } from "./SocketContext";

Modal.setAppElement("#root");
const onModel = ["Project", "Folder"];

export default function UserEditor() {
  const { id } = useParams(); //ProjektId
  const auth = useAuth();
  const socketContext = useSocket();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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

  useEffect(() => loadProject(), [isloadProject]);

  useEffect(() => {
    socketContext.on();
    socket.on("share_problem", (from) => {
      socketContext.setShareState(false);
      notierror(
        `Es gab ein Problem bei der Verbindung mit${from}\nLaden Sie die Page erneut und versuchen es noch mal`
      );
    });
    socket.on("transfer_stop", () => {
      socketContext.setShareState(false);
    });

    socket.on("transfer_confirmed", (from) => {
      notisuccess(`${from} hat bestätigt, Übertragen sollen jetzt starten`);
      socket.emit("send_first_code", auth.user.email, from, {
        project_id: id,
        code: editorRef.current.getValue(),
        extension,
      });
      socketContext.setTo(from);
      socketContext.setShareState(true);
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
      socketContext.setTo(from);
      setCodeValue(data.code);
    });
    socket.on("receive_first_code", (from, data) => {
      setCodeValue(data.code);
      setExtension(data.extension);
      loadProject(data.project_id);
      socketContext.setTo(from);
      setCodeValue(data.code);
    });
  }, []);

  const loadProject = (fromId) => {
    let projektId = id;
    if (fromId === undefined && id === "share") return;
    if (fromId) projektId = fromId;
    axios
      .get("project", {
        params: {
          id: projektId,
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
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorDidChange = () => {
    setCodeValue(editorRef.current.getValue());
    if (socketContext.shareState)
      socket.emit("send_code", auth.user.email, socketContext.to, {
        code: editorRef.current.getValue(),
      });
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
    if (!socketContext.shareState) {
      const input = window.prompt("Bitte geben Sie der Benutzername(email):");
      if (input === null) return;

      if (window.confirm(`Wir versuchen Sie nun zu verbinden mit: ${input}`)) {
        socket.emit("request_transfer", auth.user.email, input);
      }
    } else {
      socket.emit("stop_transfer", socketContext.to);
      socketContext.setShareState(false);
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
      notierror(error.response.data.error.message);
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
                <a className="drop-down-button" onClick={openModal}>
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
            <i className="material-icons icon">play_arrow</i>
          </a>
          <a onClick={handleShare}>
            <i ref={shareRef} className="material-icons icon">
              {socketContext.shareState ? "cancel_schedule_send" : "share"}
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
