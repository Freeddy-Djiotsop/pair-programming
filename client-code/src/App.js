import { useState } from "react";
import "./App.css";
import BottomBar from "./components/BottomBar";
import CodeEditor from "./components/CodeEditor";
import NavBar from "./components/NavBar";
import SidePanel from "./components/SidePanel";
import MenuBar from "./MenuBar";
import TaskBar from "./components/TaskBar";

function App() {
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
      <MenuBar />
      <NavBar callSetCodeEditorTheme={callSetCodeEditorTheme} />
      <SidePanel />
      <TaskBar />
      <CodeEditor codeEditorTheme={codeEditorTheme} />
      <BottomBar />
    </div>
  );
}

export default App;
