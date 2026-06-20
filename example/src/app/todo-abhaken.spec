@feature "Todo abhaken"
@goal    "Produktivität steigern"
@status  approved
@depends todo-erstellen.spec

scenario "Nutzer markiert ein Todo als erledigt" {
  given  mindestens ein offenes Todo existiert
  when   Nutzer klickt auf das Todo
  then   das Todo wird als erledigt markiert
  and    es ist visuell unterscheidbar von offenen Todos
}

scenario "Nutzer macht ein erledigtes Todo wieder offen" {
  given  mindestens ein erledigtes Todo existiert
  when   Nutzer klickt erneut auf das Todo
  then   das Todo ist wieder offen
}

scenario "Zustand bleibt nach Neuladen erhalten" {
  given  ein Todo wurde als erledigt markiert
  when   Nutzer lädt die App neu
  then   das Todo ist weiterhin als erledigt markiert
}
