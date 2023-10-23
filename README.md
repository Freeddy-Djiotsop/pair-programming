# pair-programming-app

In dieser Arbeit steht die Entwicklung einer Webanwendung für Pair-Programmierung im Fokus.
Es wird einen kollaborativen Code-Editor für die gemeinsame Bearbeitung von Projekten angeboten werden.
Der Client wird zahlreiche Features beinhalten, darunter einen Code-Editor mit Syntaxhighlighting, Autovervollständigung und Fehlerüberprüfung. Zudem wird eine serverseitige Infrastruktur zur Kommunikation und Datenverwaltung bereitgestellt werden.

## prerequisites:

- Node.js (>= 18.15.0)

- gcc, g++

- php, python

- mongodb: [Zum Downloaden](https://www.mongodb.com/try/download/community)

## MongoDB Konfiguration

MongoDB läuft default in mongodb://127.0.0.1:27017

Falls MongoDB konfiguriert wurde, dann diese [Zeile](https://github.com/Freeddy-Djiotsop/pair-programming/blob/master/server-code/src/helper/mongodb.js#L3) lokal in Quellecode ändern

## Server starten

Server soll erst gestartet werden

```shell
cd  server-code
npm  i
node  src/main.js
```

Neben der oben genannten MongoDB-Konfiguration müssen Sie keine weiteren Einstellungen vornehmen.

Beim Starten des Servers sucht dieser automatisch nach Ihrer MongoDB. Sollte er diese finden, werden automatisch die Datenbank und alle erforderlichen Tabellen in Ihrer MongoDB erstellt.
Andernfalls wird eine Fehlermeldung im Terminal ausgegeben.

## Client starten

Beim Starten des Clients kann er sich sofort mit dem Server verbinden

```shell
cd  client-code
npm  i
npm  run  start
```

### Anwendung genießen

Sobald die Benutzeroberfläche gestartet ist, können Sie die Webseite in http://localhost:3000 aufrufen.

Die Startseite enthält alle Informationen die Sie brauchen, um die Anwendung richtig zu nutzen.

Ich empfehlen Ihnen aber sich zu registrieren, dann können Sie die volle Funktionalität der Anwendung genießen.

### Teilen von Quellocode

Um den gemeinsamen Editor zu nutzen, müssen mindestens zwei Benutzer auf der Benutzeroberfläche registriert und angemeldet sein. Der Server erfasst ihre Daten und speichert sie in der Datenbank.

Anschließend müssen Sie zwei verschiedene Webbrowser verwenden, beispielsweise Mozilla Firefox und Microsoft Edge. Rufen Sie die Anwendung in beiden Webbrowsern auf und melden Sie sich mit unterschiedlichen Benutzernamen an. Öffnen Sie den Editor, indem Sie ein Projekt erstellen und darauf klicken.

Vergewissern Sie sich, dass der Benutzername auf der Konsole, auf der der Server gestartet ist, angezeigt wird. Anschließend können Sie das "Share"-Symbol in der linken Menüleiste des Editors verwenden, um eine Verbindungsanfrage an den anderen Benutzer zu senden, der sich im anderen Webbrowser angemeldet hat.

Falls der Benutzername auf der Konsole des Servers nicht angezeigt wird, laden Sie einfach die Benutzeroberfläche neu, auf der sich der Benutzer angemeldet hat, und versuchen Sie erneut eine Verbindung herzustellen.

Der einzige Grund, warum eine Verbindungsanfrage möglicherweise nicht ankommt, ist, dass der Benutzer nicht mit dem Server verbunden ist. Laden Sie einfach die Benutzeroberfläche neu und versuchen Sie es erneut.

Viel Spaß und Fork geht auch!!!
