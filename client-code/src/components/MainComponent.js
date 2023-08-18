import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { socket, apiUrl } from "./../socket";
import "./styles/mainComponent.css";

export default function MainComponent() {
  const modeRef = useRef(null);
  const terminalRef = useRef(null);
  const [height, setHeight] = useState("70vh");
  const [theme, setTheme] = useState("vs-light");
  const [fileName, setFileName] = useState("main.js");
  const [outputs, setOutputs] = useState([]);
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
          for(int i=1; i<=100; i++){
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
      value: "",
    },
    {
      name: "main.py",
      language: "python",
      abbr: "py",
      value: `res=1
print("Hello World\\n")
for(let i=1; i<=10; i++):
  res *=i
  console.log("Fahkultaet von %d ist %d\\n", i, res)`,
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
    socket.emit("send_code", { code: file.value });
  };

  useEffect(() => {
    socket.on("receive_code", (data) => {
      console.log(data.code);
      setEditorValue(data.code);
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
    // const terminalOutput = terminalRef.current.querySelector(".termin-output");
    axios
      .post(new URL("run", apiUrl), {
        language: file.abbr,
        code: editorValue,
      })
      .then((res) => {
        setOutputs(res.data.output.split("\n"));
      })
      .catch((error) => {
        console.error(error.response.data.error.stderr);
        setOutputs(error.response.data.error.stderr.split("\n"));
      })
      .finally((_) => {
        terminalRef.current.style.opacity = "1";
        setHeight("70vh");
      });
  };

  const closeTerminal = () => {
    terminalRef.current.style.opacity = "0";
    setHeight("100vh");
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
      <div ref={terminalRef} className="terminal">
        <div className="terminal-bar">
          <a onClick={closeTerminal}>x</a>
        </div>
        <div className="termin-output">
          {outputs.map((text, index) => (
            <p key={index}>
              {text.includes(".c:") ? text.split(".c:")[1] : text}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
