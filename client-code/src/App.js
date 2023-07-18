import { useState } from "react";
import "./App.css";
import BottomBar from "./components/BottomBar";
import CodeEditor from "./components/CodeEditor";
import NavBar from "./components/NavBar";

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
      <NavBar callSetCodeEditorTheme={callSetCodeEditorTheme} />
      <CodeEditor codeEditorTheme={codeEditorTheme} />
      <BottomBar />
    </div>
  );
}

export default App;
