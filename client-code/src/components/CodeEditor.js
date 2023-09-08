import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { socket } from "../api/socket";
import "./styles/codeEditor.css";
import { useAuth } from "./Auth";
import { notierror, notisuccess } from "../toast";

export default function CodeEditor() {
  const auth = useAuth();
  socket.emit("set_username", auth.user.email);
  const modeRef = useRef(null);
  const terminalRef = useRef(null);
  const heightTerminalClosed = "87vh";
  const heightTerminalOpened = "70vh";
  const [height, setHeight] = useState(heightTerminalClosed);
  const [theme, setTheme] = useState("vs-light");
  const [fileName, setFileName] = useState("main.c");
  const [outputs, setOutputs] = useState([]);
  const [shareState, setShareState] = useState(false);
  const [to, setTo] = useState("");
  const shareRef = useRef(null);
  const editorRef = useRef(null);
  const files = [
    {
      name: "main.js",
      language: "javascript",
      abbr: "js",
      value: `let res=1;
console.log("Hello World\\n");
for(let i=1; i<=10; i++){
  res *=i;
  console.log("Fahkultaet von %d ist %d\\n", i, res);
}`,
    },
    {
      name: "main.c",
      language: "c",
      abbr: "c",
      value: `#include <stdio.h>

int main()
{
  int res=1;
  printf("Hello World\\n");
  for(int i=1; i<=10; i++){
      res *=i;
      printf("Fahkultaet von %d ist %d\\n", i, res);
  }

  return 0;
}`,
    },
    {
      name: "main.cpp",
      language: "cpp",
      abbr: "cpp",
      value: `#include <iostream>

using namespace std;

int main()
{
  int res = 1;
  for(int i=1; i<=10; i++){
    res *=i;
    cout<<"Fahkultaet von " << i <<" ist "<< res <<endl;
  }

  return 0;
}`,
    },
    {
      name: "main.py",
      language: "python",
      abbr: "py",
      value: `res = 1
for i in range(1, 10):
    res *= i
    print('Fahkultaet von', i , 'ist:', res)`,
    },
  ];
  const file = files.find((el) => el.name === fileName);
  const [editorValue, setEditorValue] = useState(file.value);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorDidChange = () => {
    file.value = editorRef.current.getValue();
    setEditorValue(file.value);
    if (shareState)
      socket.emit("send_code", auth.user.email, to, { code: file.value });
  };

  useEffect(() => {
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
      setEditorValue(data.code);
      setTo(from);
      file.value = data.code;
    });
  }, [socket]);

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
      .post("run", {
        language: file.abbr,
        code: editorValue,
      })
      .then((res) => {
        setOutputs(res.data.output.split("\n"));
      })
      .catch((error) => {
        console.error(error.response.data.error);
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

  return (
    <div className="editor-panel">
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
          width="100%"
          theme={theme}
          defaultLanguage={file.language}
          onMount={handleEditorDidMount}
          onChange={handleEditorDidChange}
          defaultValue={file.value}
          value={editorValue}
        />
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
