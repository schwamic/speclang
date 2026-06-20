@feature "Todo löschen"
@goal    "Produktivität steigern"
@status  approved
@depends todo-erstellen.spec

scenario "Nutzer löscht ein Todo" {
  given  mindestens ein Todo existiert
  when   Nutzer klickt auf Löschen beim Todo
  then   das Todo verschwindet aus der Liste
  and    die Aktion ist sofort wirksam ohne Bestätigungsdialog
}

scenario "Liste ist leer nach dem Löschen des letzten Todos" {
  given  genau ein Todo existiert
  when   Nutzer löscht es
  then   die leere Liste wird angezeigt
  and    der Hinweis auf die leere Liste erscheint wieder
}

constraint {
  # Gemäß constitution: einfachheit vor funktionsumfang — kein Undo
  kein Bestätigungsdialog vor dem Löschen
  kein Undo nach dem Löschen
}
