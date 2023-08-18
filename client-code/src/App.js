import { Route, Routes } from "react-router-dom";
import "./App.css";
import MenuBar from "./components/MenuBar";
import Gast from "./components/user/Gast";
import Home from "./components/Home.js";
import CodeEditor from "./components/CodeEditor";
import Login from "./components/user/Login";
import Register from "./components/user/Register";

export default function App() {
  return (
    <div className="App">
      <MenuBar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="gast" element={<Gast />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="gast/editor" element={<CodeEditor />} />
        <Route path="editor" element={<CodeEditor />} />
      </Routes>
    </div>
  );
}
