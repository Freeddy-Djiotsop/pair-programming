# pair-programming-app

In dieser Arbeit steht die Entwicklung einer Webanwendung für Pair-Programmierung im Fokus.
Es wird einen kollaborativen Code-Editor für die gemeinsame Bearbeitung von Projekten angeboten werden.
Der Client wird zahlreiche Features beinhalten, darunter einen Code-Editor mit Syntaxhighlighting, Autovervollständigung und Fehlerüberprüfung. Zudem wird eine serverseitige Infrastruktur zur Kommunikation und Datenverwaltung bereitgestellt werden.

## prerequisites:

- Node (>= v18.15.0)

- gcc, g++

- php, python

- mongodb: [Zum Downloaden](https://www.mongodb.com/try/download/community)

## MongoDB Konfiguration

MongoDB läuft default in mongodb://127.0.0.1:27017

Falls MongoDB konfiguriert wurde, dann diese [Zeile](https://github.com/Freeddy-Djiotsop/pair-programming/blob/42fb894c13b2f33f9e276118530461d55ffc9b93/server-code/src/helper/mongodb.js#L3) lokal in Quellecode ändern

## Server starten

Server soll erst gestartet werden

```shell
cd  server-code
npm  i
node  src/main.js
```

## Client starten

Beim Starten des Clients kann er sich sofort mit dem Server verbinden

```shell
cd  client-code
npm  i
npm  run  start
```

### Anwendung genießen

Wenn den Client richtig gestartet ist, dann sehen Sie die Homepage.
Die Homepage enthält alle Informationen die Sie brauchen, um die Anwendung richtig zu nutzen.
Ich empfehlen Ihnen aber sich zu registrieren, dann können Sie die volle Funktionalität der Anwendung genießen.

Viel Spaß und Fork geht auch!!!
