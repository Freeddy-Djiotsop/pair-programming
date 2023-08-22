import { Link } from "react-router-dom";
import "./styles/gast.css";

export default function Gast() {
  return (
    <div className="description-container">
      <h1>Willkommen bei Pair Programming App (PPA)</h1>
      <p>
        Bist du bereit, in die Welt des Codierens einzutauchen? Bei uns musst du
        keine Registrierung vornehmen, um loszulegen. PPA bietet eine intuitive
        Plattform, die es dir ermöglicht, Code zu erstellen und zu bearbeiten,
        ohne ein Konto erstellen zu müssen. Egal, ob du deine Coding-Fähigkeiten
        verbessern, eine schnelle Lösung finden oder einfach nur experimentieren
        möchtest - unsere Anwendung steht dir offen.
      </p>
      <h2>Funktionen für Gäste:</h2>
      <div className="scrollable-cards">
        <div className="feature-card">
          <h3>Programmiersprachen</h3>
          <p>
            Lass deiner Kreativität freien Lauf und erschaffe Großartiges - in
            der Programmiersprache, die dir am besten liegt. Egal, ob du dich
            für Python, JavaScript, Java, C++ oder eine andere Sprache
            entscheidest.
          </p>
        </div>
        <div className="feature-card">
          <h3>Code-Editor</h3>
          <p>
            Erstelle, bearbeite und betrachte deinen Code in Echtzeit.
            Syntaxhervorhebung hilft dir, Fehler zu erkennen und deine Arbeit zu
            optimieren.
          </p>
        </div>
        <div className="feature-card">
          <h3>Keine Registrierung erforderlich</h3>
          <p>
            Du musst dich nicht anmelden, um loszulegen. Klicke einfach
            <a href="gast/editor"> hier</a> und leg los!
          </p>
        </div>
        <div className="feature-card">
          <h3>Projektmanagement</h3>
          <p>
            Organisiere deine Projekte mit einer einfachen Dateiverwaltung.
            Erstelle Ordner, füge Dateien hinzu und halte deine Arbeit
            strukturiert
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
      <div className="gast-buttons">
        <Link to="editor">Zum Editor</Link>
      </div>
    </div>
  );
}
