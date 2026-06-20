@feature "Todo filtern"
@goal    "Produktivität steigern"
@status  approved
@depends todo-erstellen.spec
@depends todo-abhaken.spec

scenario "Nutzer filtert nach offenen Todos" {
  given  offene und erledigte Todos existieren
  when   Nutzer wählt Filter "Offen"
  then   nur offene Todos werden angezeigt
}

scenario "Nutzer filtert nach erledigten Todos" {
  given  offene und erledigte Todos existieren
  when   Nutzer wählt Filter "Erledigt"
  then   nur erledigte Todos werden angezeigt
}

scenario "Nutzer sieht alle Todos" {
  given  ein Filter ist aktiv
  when   Nutzer wählt Filter "Alle"
  then   alle Todos werden angezeigt
}

scenario "Aktiver Filter bleibt nach Neuladen erhalten" {
  given  Nutzer hat Filter "Offen" gewählt
  when   Nutzer lädt die App neu
  then   der Filter "Offen" ist weiterhin aktiv
}

constraint {
  # Standard-Filter beim Start: "Alle"
  Standard-Filter ist "Alle"
}
