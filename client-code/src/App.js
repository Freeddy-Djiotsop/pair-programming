import { useState } from "react";
import "./App.css";
import CodeEditor from "./components/CodeEditor";
import MenuBar from "./components/MenuBar";
import SideMenuBar from "./components/SideMenuBar";

export default function App() {
  const [codeEditorTheme, setCodeEditorTheme] = useState("vs-light");
  const callSetCodeEditorTheme = () => {
    if (codeEditorTheme === "vs-light") {
      setCodeEditorTheme("vs-dark");
    } else if (codeEditorTheme === "vs-dark") {
      setCodeEditorTheme("vs-light");
    }
  };
  return (
    <div className="App">
      <header>
        <MenuBar />
        <SideMenuBar callSetCodeEditorTheme={callSetCodeEditorTheme} />
      </header>
      <CodeEditor codeEditorTheme={codeEditorTheme} />
    </div>
  );
}
