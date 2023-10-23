import { useState, createContext, useContext } from "react";
import { socket } from "../api/socket";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext(null);
const redirectPath = "/project/share";

export const SocketProvider = ({ children }) => {
  const [shareState, setShareState] = useState(false);
  const [project_id, setProjectId] = useState("");
  const [to, setTo] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const on = () => {
    if (!auth.isAuthenticated || shareState) return;
    socket.emit("set_username", auth.user.email);
    socket.on("transfer_request", (from, data) => {
      if (
        window.confirm(
          `${from} möchte eine Übertragung starten. Möchten Sie akzeptieren?`
        )
      ) {
        socket.emit("confirm_transfer", from, auth.user.email);
        setTo(from);
        setProjectId(data.project_id);
        setShareState(true);
        navigate(redirectPath, { replace: true });
      } else {
        socket.emit("deny_transfer", from, auth.user.email);
      }
    });
  };

  return (
    <SocketContext.Provider
      value={{
        shareState,
        to,
        project_id,
        setProjectId,
        setShareState,
        setTo,
        on,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
