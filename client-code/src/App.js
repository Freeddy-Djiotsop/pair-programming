import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MenuBar from "./components/MenuBar";
import Gast from "./components/user/Gast";
import Home from "./components/Home.js";
import CodeEditor from "./components/CodeEditor";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { AuthProvider } from "./components/Auth";
import { ProtectedRoutesGuard, UserGuard } from "./components/Guard";

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <MenuBar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route
            path="gast"
            element={
              <ProtectedRoutesGuard>
                <Gast />
              </ProtectedRoutesGuard>
            }
          />
          <Route
            path="login"
            element={
              <ProtectedRoutesGuard>
                <Login />
              </ProtectedRoutesGuard>
            }
          />
          <Route
            path="register"
            element={
              <ProtectedRoutesGuard>
                <Register />
              </ProtectedRoutesGuard>
            }
          />
          <Route
            path="gast/editor"
            element={
              <ProtectedRoutesGuard>
                <CodeEditor />
              </ProtectedRoutesGuard>
            }
          />
          <Route
            path="editor"
            element={
              <UserGuard>
                <CodeEditor />
              </UserGuard>
            }
          />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </div>
  );
}
