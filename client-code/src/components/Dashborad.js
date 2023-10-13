import { useEffect, useState } from "react";
import "./styles/dashboard.css";
import Modal from "react-modal";
import axios from "../api/axios";
import { useAuth } from "./Auth";
import { notierror, notisuccess } from "../toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const handleClick = (id) => {
    navigate(`/project/${id}`, { replace: true });
  };

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
        notierror(
          `Fehler beim Abrufen der Projektdaten: ${error.response.data.error.message}`
        );
      });
  }, []);

  return (
    <>
      <div className="dashboard">
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
    </>
  );
}
