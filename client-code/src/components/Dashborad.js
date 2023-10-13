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

Modal.setAppElement("#root");

export default function Dashboard() {
  const auth = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadProject, setLoadProject] = useState(false);

  useEffect(() => socket.on(), []);

  useEffect(() => {
    axios
      .get("project", {
        params: {
          email: auth.user.email,
        },
      })
      .then((response) => {
        notisuccess(response.data.message);
        if (Array.isArray(response.data.projects))
          setProjects(response.data.projects);
      })
      .catch((error) => {
        console.log(error);
        let msg = "Seite bitte neu laden";
        if (!error.response) msg = error.response.data.error.message;
        notierror(`Fehler beim Abrufen der Projektdaten: ${msg}`);
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

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-left-panel">
          <a className="dashboard-button-projekt" onClick={openModal}>
            Neues Projekt
          </a>
        </div>
        <div className="dashboard-center-panel">
          <h1>Dashboard</h1>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <a onClick={() => handleClick(project.id)}>{project.name}</a>
              </li>
            ))}
          </ul>
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
