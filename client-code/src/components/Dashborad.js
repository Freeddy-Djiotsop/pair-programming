import { useEffect, useState } from "react";
import "./styles/dashboard.css";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import { useAuth } from "./Auth";
import { languages } from "../language";
import { notierror, notisuccess } from "../toast";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";
import { socket } from "../api/socket";

Modal.setAppElement("#root");

export default function Dashboard() {
  const auth = useAuth();
  const socketContext = useSocket();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadProject, setLoadProject] = useState(false);

  useEffect(() => {
    if (socketContext.shareState) {
      socketContext.setShareState(false);
      socketContext.setProjectId("");
      socket.emit("stop_transfer", socketContext.to);
    }
    socketContext.on();
  }, []);

  useEffect(() => {
    axios
      .get("project", {
        params: {
          email: auth.user.email,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data.projects))
          setProjects(response.data.projects);
      })
      .catch((error) => {
        console.log(error);
        let msg = "";
        if (error.code === "ERR_NETWORK")
          msg = `${error.message}: Seite bitte neu laden`;
        else
          msg = `Fehler beim Abrufen der Projektdaten: ${error.response.data.error.message}`;
        notierror(msg);
      });
  }, [loadProject]);

  const onSubmit = async (data) => {
    const { name, language, description } = data;
    try {
      await axios.post("project", {
        email: auth.user.email,
        name,
        description,
        extension: languages[language].extension,
      });
      closeModal();
      setLoadProject(!loadProject);
      notisuccess(`${name} erfolgreich erstellt`);
    } catch (error) {
      notierror(error.response.data.error.message);
    }
  };

  const handleClick = (id) => {
    navigate(`/project/${id}`, { replace: true });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const timeSinceLastModified = (lastModified) => {
    const lastModifiedDate = new Date(lastModified);
    const currentDate = new Date();
    const timeDifference = currentDate - lastModifiedDate;

    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const mountsDifference = Math.floor(daysDifference / 30);

    if (mountsDifference > 0) {
      return `vor ${mountsDifference} Monat(en)`;
    } else if (daysDifference > 0) {
      return `vor ${daysDifference} Tag(en)`;
    } else if (hoursDifference > 0) {
      return `vor ${hoursDifference} Stunde(n)`;
    } else if (minutesDifference > 0) {
      return `vor ${minutesDifference} Minute(n)`;
    } else {
      return `vor ${secondsDifference} Sekunde(n)`;
    }
  };

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-left-panel">
          <a className="dashboard-button-projekt" onClick={openModal}>
            Neues Projekt
          </a>
        </div>
        <div className="dashboard-center-panel">
          <h1>{projects.length === 0 ? "Keine" : "Alle"} Projekte</h1>
          {projects.length === 0 ? null : (
            <ul className="dashboard-projekts">
              <li className="projekt-header">
                <div className="projekt-header-content">
                  <a className="projekt-header-name">Name</a>
                  <span className="projekt-header-lastmodified">
                    Zuletzt bearbeitet
                  </span>
                </div>
              </li>
              {projects.map((project) => (
                <li className="projekt-link" key={project.id}>
                  <div className="projekt-link-content">
                    <a
                      className="projekt-link-name"
                      onClick={() => handleClick(project.id)}
                    >
                      {project.name}
                    </a>
                    <span className="projekt-link-lastmodified">
                      {timeSinceLastModified(project.lastModified)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        appElement={document.getElementById("root")}
        className="custom-modal"
        overlayClassName="custom-overlay"
        onRequestClose={closeModal}
        contentLabel="Neues Projekt erstellen"
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
          <div className="dashboard-text-area">
            <textarea
              placeholder="Optional ReadMe"
              {...register("description")}
            />
          </div>
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
          <div className="dasboard-button">
            <button onClick={closeModal}>Abbrechen</button>
            <button type="submit">Erstellen</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
