import { useState, createContext, useContext } from "react";
import { socket } from "../api/socket";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext(null);
const redirectPath = "/project/share";

export const SocketProvider = ({ children }) => {
  const [shareState, setShareState] = useState(false);
  const [to, setTo] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const on = () => {
    if (!auth.isAuthenticated) return;
    socket.emit("set_username", auth.user.email);
    socket.on("transfer_request", (from) => {
      if (
        window.confirm(
          `${from} möchte eine Übertragung starten. Möchtest Sie akzeptieren?`
        )
      ) {
        setTo(from);
        setShareState(true);

        navigate(redirectPath, { replace: true });

        socket.emit("confirm_transfer", from, auth.user.email);
      } else {
        socket.emit("deny_transfer", from, auth.user.email);
      }
    });
  };

  return (
    <SocketContext.Provider
      value={{ shareState, to, setShareState, setTo, on }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
