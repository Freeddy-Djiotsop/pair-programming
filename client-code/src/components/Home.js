import { Link } from "react-router-dom";
import "./styles/home.css";
import { useAuth } from "./Auth";
import { useSocket } from "./SocketContext";
import { useEffect } from "react";
import { socket } from "../api/socket";

export default function Home() {
  const auth = useAuth();
  const socketContext = useSocket();

  useEffect(() => {
    if (socketContext.shareState) {
      socketContext.setShareState(false);
      socketContext.setProjectId("");
      socket.emit("stop_transfer", socketContext.to);
    }
    socketContext.on();
  }, []);

  return (
    <div className="description-container">
      <h1>Willkommen bei Pair Programming App(PPA)</h1>
      <p>
        Mit PPA kannst du reibungslos mit anderen Entwicklern zusammenarbeiten,
        um Code in Echtzeit zu bearbeiten, zu teilen und zu besprechen. Egal, ob
        du an einem Schulprojekt, einem Open-Source-Beitrag oder einem
        Teamprojekt arbeitest, unsere Plattform bietet dir die Werkzeuge, die du
        benötigst, um effizient und effektiv zusammenzuarbeiten.
      </p>
      <h2>Funktionen:</h2>
      <div className="scrollable-cards">
        <div className="feature-card">
          <h3>Echtzeit-Kollaboration</h3>
          <p>
            Arbeite in Echtzeit mit Teammitgliedern oder Freunden an derselben
            Code-Datei. Änderungen werden sofort synchronisiert, sodass ihr
            gemeinsam Fortschritte erzielen könnt.
          </p>
        </div>
        {/* <div className="feature-card">
            <h3>Dateiverwaltung</h3>
            <p>
              Organisiere deine Projekte mühelos mit einer benutzerfreundlichen
              Dateiverwaltung. Erstelle Ordner, Dateien und Unterprojekte, um
              deine Arbeit übersichtlich zu strukturieren.
            </p>
          </div> */}
        <div className="feature-card">
          <h3>Syntaxhervorhebung</h3>
          <p>
            Unsere integrierte Syntaxhervorhebung unterstützt eine Vielzahl von
            Programmiersprachen, um deine Code-Bearbeitungserfahrung zu
            optimieren und Fehler leichter zu erkennen.
          </p>
        </div>
        <div className="feature-card">
          <h3>Sicherheit</h3>
          <p>
            Deine Daten sind uns wichtig. Wir setzen modernste
            Verschlüsselungstechnologien ein, um sicherzustellen, dass deine
            Arbeit geschützt ist.
          </p>
        </div>
        <div className="feature-card">
          <h3>Programmiersprachen</h3>
          <p>
            Lass deiner Kreativität freien Lauf und erschaffe Großartiges - in
            der Programmiersprache, die dir am besten liegt. Egal, ob du dich
            für Python, JavaScript, Java, C++ oder eine andere Sprache
            entscheidest.
          </p>
        </div>
      </div>
      <p>
        Bereit, deine kollaborative Code-Editing-Reise zu beginnen? Registriere
        dich noch heute und lade deine Teammitglieder ein, um gemeinsam
        bahnbrechenden Code zu schreiben!
      </p>
      <p>
        Bei Fragen oder Feedback steht unser Support-Team bereit, um dir zu
        helfen. Viel Spaß beim Codieren!
      </p>

      {!auth.isAuthenticated ? (
        <div className="home-buttons">
          <Link to="login">Login</Link>
          <Link to="register">Jetzt Registrieren</Link>
          <Link to="gast">Weiter Als Gast</Link>
        </div>
      ) : null}
    </div>
  );
}
