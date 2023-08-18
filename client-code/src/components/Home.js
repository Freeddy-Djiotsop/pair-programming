import React from "react";
import "./styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>
        Willkommen bei Pair Programming
        <span>App(PPA)</span>
      </h1>
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
        {/* <div className="feature-card">
            <h3>Chat und Kommentare</h3>
            <p>
              Diskutiere Ideen, stelle Fragen oder gebe Feedback direkt in der
              Anwendung. Unser integrierter Chat ermöglicht es dir, in Echtzeit
              zu kommunizieren, ohne die Bearbeitungsumgebung verlassen zu
              müssen.
            </p>
          </div> */}
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
            Lass deiner Kreativität freien Lauf und erschaffe Großartiges
            {"-"} in der Programmiersprache, die dir am besten liegt. Egal, ob
            du dich für Python, JavaScript, Java, C++ oder eine andere Sprache
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
      <div className="home-buttons">
        <a href="login">Login</a>
        <a href="register">Jetzt Registrieren</a>
        <a href="gast/editor">Weiter Als Gast</a>
      </div>
    </div>
  );
}
