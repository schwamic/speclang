@feature "Todo erstellen"
@goal    "Produktivität steigern"
@status  approved

entity Todo {
  id:      uuid, auto
  title:   string, required
  done:    bool, default(false)
  created: timestamp, auto
}

scenario "Nutzer sieht die leere Liste beim ersten Start" {
  given  die App wird zum ersten Mal geöffnet
  then   eine leere Liste wird angezeigt
  and    ein Hinweis erscheint dass noch keine Todos vorhanden sind
}

scenario "Nutzer erstellt ein neues Todo" {
  given  die App ist geöffnet
  when   Nutzer gibt einen Titel ein und bestätigt
  then   das neue Todo erscheint oben in der Liste
  and    das Eingabefeld ist danach leer
  and    der Fokus liegt wieder auf dem Eingabefeld
}

scenario "Nutzer versucht ein leeres Todo zu erstellen" {
  given  das Eingabefeld ist leer oder enthält nur Leerzeichen
  when   Nutzer versucht zu bestätigen
  then   das Todo wird nicht erstellt
  and    das Eingabefeld zeigt einen Hinweis
}

constraint {
  # Leere oder reine Leerzeichen-Titel sind ungültig
  Titel darf nicht leer sein
  maximale Titellänge: 280 Zeichen
}
