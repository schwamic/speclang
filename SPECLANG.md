# SpecLang Specification

> Version 0.0.1

SpecLang ist eine Programmiersprache.

Wie JavaScript, Python oder Java eine Abstraktion über Maschinencode ist, ist SpecLang eine Abstraktion über alle diese Sprachen — Prompt-Level. Ein Sprachmodell (z.B. Claude Code) ist der Compiler: es liest `.spec`-Dateien und kompiliert sie in lauffähigen Code, Tests und Infrastruktur.

Ein SpecLang-Projekt besteht ausschließlich aus `.spec`-Dateien. Es gibt keinen manuell geschriebenen Anwendungscode.

---

## Grundprinzipien

**SpecLang ist eine Programmiersprache.**
Keine Toolchain, kein Framework-Aufsatz, kein Workflow. SpecLang ist die Sprache, in der Software geschrieben wird. Alles andere ist Kompilat.

**BDD definiert das Was.**
Verhalten wird aus Nutzersicht beschrieben, unabhängig von Technologie oder Implementierung.

**TDD greift ins Wie ein.**
Tests entstehen nicht aus der Spec direkt, sondern als Konsequenz der Implementierungsentscheidungen des Compilers. Der TDD-Loop (Red → Green → Refactor) läuft innerhalb der Kompilierung — nicht im Spec selbst.

**Das LLM ist der Compiler.**
Es gibt keinen Parser, keine eigene Laufzeit. Claude Code (oder ein vergleichbares Modell) liest `.spec`-Dateien direkt und kompiliert sie in Code, Tests und Infrastruktur.

**Specs sind für Menschen geschrieben.**
Lesbarkeit hat Vorrang. Strukturierter Text, keine proprietäre Syntax die gelernt werden muss.

---

## Dateistruktur

Specs können flach oder in Unterordnern organisiert werden. Der Unterordner definiert den **Kontext** — das LLM behandelt alle Specs innerhalb eines Ordners als zusammengehörige Schicht oder Domain.

```
/
├── src/
│   │
│   │   # Flach (kleine Projekte)
│   ├── auth.spec
│   ├── payments.spec
│   │
│   │   # Oder nach Schichten (empfohlen ab mittlerer Größe)
│   ├── app-frontend/
│   │   ├── auth.spec
│   │   ├── dashboard.spec
│   │   └── components.spec
│   │
│   ├── app-backend/
│   │   ├── auth.spec
│   │   ├── payments.spec
│   │   └── notifications.spec
│   │
│   │   # Oder nach Domains (DDD-Stil)
│   ├── domain-user/
│   ├── domain-order/
│   │
│   ├── stack.spec      # Infrastruktur & Entwicklungsumgebung
│   └── meta.spec       # Projektmetadaten & Abhängigkeiten
│
├── build/
│   │
│   │   # Spiegelt die src/-Struktur
│   ├── app-frontend/
│   │   ├── src/        # Generierter Frontend-Code + Tests
│   │   └── dist/       # Bundle
│   │
│   ├── app-backend/
│   │   ├── src/        # Generierter Backend-Code + Tests
│   │   └── dist/       # Bundle
│   │
│   └── infra/          # IaC, Dockerfiles, CI/CD-Konfigurationen
│
└── CLAUDE.md           # Anweisungen für das LLM
```

**`/build` spiegelt `/src`** — die Ordnerstruktur der Specs bestimmt die Struktur des generierten Codes.

`/build` ist vollständig generiert und wird nicht manuell bearbeitet. Änderungen erfolgen immer in `/src`.

### Kontext durch Unterordner

Der Ordnername trägt Bedeutung. `app-frontend/auth.spec` und `app-backend/auth.spec` können beide existieren — das LLM erkennt aus dem Kontext, dass es sich um verschiedene Schichten desselben Features handelt und generiert entsprechend Frontend- und Backend-Implementierungen.

Konventionen für Präfixe (empfohlen, nicht erzwungen):

| Präfix | Bedeutung |
|---|---|
| `app-*` | Anwendungsschichten (frontend, backend, mobile) |
| `domain-*` | Fachliche Domains (DDD) |
| `service-*` | Einzelne Microservices |
| `lib-*` | Geteilte Bibliotheken |

---

## Hierarchie

SpecLang-Projekte sind in drei Ebenen gegliedert. Jede Ebene ist eine eigene `.spec`-Datei.

```
goal.spec          ← Warum? Geschäftsziel, Vision
  feature.spec     ← Was? Funktionale Anforderung
    *.spec         ← Wie verhält es sich? Szenarien & Details
```

**`goal.spec`** beschreibt das Warum — Geschäftsziele, Nutzerprobleme, Projektvision — und die Constitution: verbindliche Prinzipien die für alle Specs und den gesamten Kompiliervorgang gelten. Keine technischen Details, keine Szenarien.

```
@goal        "Nutzer können ihre Aufgaben verwalten"
@vision      "Die einfachste Todo-App der Welt"
@status      approved

goal "Produktivität steigern" {
  damit Nutzer nichts vergessen
  und   ihren Fokus behalten
}

constitution {
  # Verbindliche Prinzipien — der Compiler darf nicht davon abweichen
  code_quality:   tests vor implementierung (TDD)
  ux:             einfachheit vor funktionsumfang
  security:       nutzerdaten verlassen nie das gerät
  accessibility:  WCAG 2.1 AA
}
```

**Constitution** ist der Rahmen für den Compiler — übergeordnete Prinzipien die in allen Specs und im gesamten Build gelten. Was nicht in der Constitution steht, entscheidet der Compiler selbst.

**Feature-Specs** referenzieren ein Ziel:

```
@feature "Todo erstellen"
@goal    "Produktivität steigern"   # Traceability zurück zum Ziel
```

**Traceability** ist damit vollständig: jede Spec verweist auf das Ziel, jedes Scenario auf die Spec. Der Compiler kennt das gesamte Warum → Was → Wie.

---

## Status-Lifecycle

Jede Spec hat einen Status. Der Compiler kompiliert nur Specs mit Status `approved` oder `released`.

```
@status draft      # in Arbeit, wird nicht kompiliert
@status review     # Compiler stellt Rückfragen, klärt Ambiguitäten — kein Code
@status approved   # freigegeben, wird kompiliert
@status released   # produktiv, gesperrt gegen Änderungen
```

**`@status review`** ist ein aktiver Zustand: der Compiler liest die Spec, identifiziert unklare oder widersprüchliche Stellen und stellt gezielte Rückfragen — bevor er eine einzige Zeile Code schreibt. Erst wenn alle Fragen beantwortet und der Status auf `approved` gesetzt ist, beginnt die Kompilierung.

```
# Beispiel: Compiler-Rückfragen bei @status review
# ─────────────────────────────────────────────────
# [review] todo.spec › scenario "Nutzer filtert Todos"
#   → Soll der Filter-Zustand nach Neuladen erhalten bleiben?
#   → Soll "Alle" der Standard-Filter beim Start sein?
#
# Bitte Spec ergänzen und @status auf approved setzen.
```

**Änderungen an freigegebenen Specs** erfordern einen Change-Request als neuen Spec-Block:

```
@status released

change "Titellänge erhöhen" {
  von   maximale Titellänge: 280 Zeichen
  nach  maximale Titellänge: 500 Zeichen
  grund Nutzer wünschen längere Beschreibungen
}
```

Der Compiler behandelt einen `change`-Block als offenen PR — er kompiliert die Änderung erst wenn der Block auf `@status approved` gesetzt wird.

---

## Syntax

Eine `.spec`-Datei besteht aus vier optionalen Blöcken: **Header**, **Entities**, **Scenarios** und **Constraints**.

### Header

```
@feature "Name des Features"
@version 1.0
@status  approved
@goal    "Zielname"                   # Traceability zur goal.spec
@stack   node, postgres               # optionale technische Einschränkungen
@depends auth.spec                    # Abhängigkeiten zu anderen Specs
@import  "speclang-ui@2.1"            # externe Spec-Library
@import  "github:org/lib/button.spec" # einzelne Spec aus einem Repo
```

### Imports

SpecLang-Libraries sind Sammlungen von `.spec`-Dateien — keine kompilierten Artefakte, keine Binaries. Der Compiler sieht beim Build alle Specs (eigene + importierte) zusammen und kompiliert sie in einem Zug.

```
@import "speclang-ui@2.1"              # Library per Name + Version
@import "github:org/speclang-ui@2.1"  # Library per Repo
@import "github:org/speclang-ui/button.spec"  # einzelne Spec
@import "./shared/button.spec"         # lokale Spec
```

Importierte Specs können in Scenarios referenziert werden:

```
@feature "Checkout"
@import "speclang-ui@2.1"

scenario "Nutzer schließt Kauf ab" {
  given  Warenkorb enthält mindestens ein Produkt
  when   Nutzer klickt Button("Jetzt kaufen")
  then   Checkout-Modal öffnet sich
  and    Zahlungsformular ist sichtbar
}
```

**Libraries sind target-agnostisch.** `speclang-ui/button.spec` beschreibt Verhalten und Aussehen — nicht das Framework. Der Compiler entscheidet anhand von `stack.spec` ob daraus React, SwiftUI oder Flutter wird. Dieselbe Library-Spec läuft auf jedem Target.

### Kommentare

```
# Das ist ein Kommentar
entity Todo {
  id:    uuid    # inline Kommentar
  title: string
}
```

Kommentare beginnen mit `#` und gelten bis zum Zeilenende. Sie sind für Menschen — der Compiler ignoriert sie.

### Entities

Entities beschreiben Datenstrukturen ohne Implementierungsdetails.

```
entity User {
  id:       uuid
  email:    email, unique
  password: hashed
  role:     enum(admin, user, guest)
  created:  timestamp, auto
}
```

**Typen:** `uuid`, `string`, `text`, `int`, `float`, `bool`, `email`, `url`, `timestamp`, `date`, `json`, `hashed`

**Modifikatoren:** `unique`, `required`, `optional`, `auto`, `readonly`, `enum(...)`

### Scenarios

Scenarios folgen dem BDD-Muster `given / when / then`. Sie sind die primäre Aussage der Spec.

```
scenario "Nutzer meldet sich erfolgreich an" {
  given  User existiert mit email="test@example.com"
  when   POST /auth/login { email, password }
  then   response.status == 200
  and    response.body enthält jwt_token
}

scenario "Login schlägt fehl bei falschem Passwort" {
  given  User existiert mit email="test@example.com"
  when   POST /auth/login { email, falsches_passwort }
  then   response.status == 401
  and    nach 5 Versuchen: rate_limit aktiv
}
```

**Schlüsselwörter:** `given`, `when`, `then`, `and`, `but`

`when` beschreibt die Aktion (HTTP-Methode, Nutzereingabe, Systemereignis).
`then` beschreibt das erwartete Ergebnis — beobachtbar von außen.

### Constraints

Constraints sind technische oder fachliche Regeln, die quer durch das Feature gelten.

```
constraint {
  passwords müssen bcrypt(rounds=12) verwenden
  sessions laufen nach 24h ab
  jwt verwendet RS256
  alle Endpunkte erfordern HTTPS
}
```

Constraints sind bewusstes Eingreifen ins **Wie** — sie werden sparsam eingesetzt, wenn eine Anforderung nicht aus dem Szenario ableitbar ist.

---

## meta.spec

```
@project "Projektname"
@version 0.1.0
@license MIT

team {
  language: deutsch
  timezone: Europe/Berlin
}

ci {
  # Corporate Identity — der Compiler berücksichtigt diese beim Generieren von UI
  primary_color:   "#0057FF"
  secondary_color: "#F5F5F5"
  font:            "Inter"
  logo:            "./assets/logo.svg"
}
```

`ci` ist optional. Wenn vorhanden, wendet der Compiler die Corporate Identity auf alle generierten UI-Komponenten an — Farben, Typografie, Abstände, Logo. Was nicht definiert ist, entscheidet der Compiler selbst.

## stack.spec

`stack.spec` definiert Infrastruktur, Entwicklungsumgebung und technische Output-Entscheidungen.

```
@stack "Projektname"

runtime {
  language:  typescript@5.x
  runtime:   node@20-lts
}

output {
  code_style:  prettier
  test_runner: vitest
  api_style:   rest
}

services {
  database: postgres@16 {
    size:    10gb
    backups: daily
  }
  cache:  redis@7
  queue:  rabbitmq
}

devenv {
  containerized: docker-compose
  hot_reload:    true
  seed_data:     ./fixtures/*.json
}

ci {
  provider: github-actions
  on:       [push, pull_request]
  steps:    [lint, test, build, deploy]
}
```

---

## Der Build-Prozess

```
src/*.spec
    │
    ▼
Claude Code liest alle Specs
    │
    ├── interpretiert Entities → Datenmodelle
    ├── interpretiert Scenarios → Implementierung + Tests (TDD intern)
    ├── interpretiert Constraints → technische Regeln
    └── interpretiert stack.spec → Infrastruktur
    │
    ▼
/build/src    → Anwendungscode + Tests
/build/dist   → Bundle
/build/infra  → Docker, CI, IaC
```

Das LLM validiert seinen eigenen Output gegen die Specs — es liest nach der Generierung alle Szenarien erneut und prüft, ob der Code sie erfüllt.

---

## Compiler-Verhalten

Der Compiler (das LLM) folgt diesen Regeln beim Kompilieren:

**Reihenfolge:**
1. `meta.spec` lesen — Projektkontext
2. `stack.spec` lesen — Zielplattform und Services
3. Alle Feature-Specs lesen — vollständiges Bild vor erstem Output
4. Entities kompilieren → Datenmodelle, Migrationen
5. Scenarios kompilieren → Tests (erst), dann Implementierung
6. Constraints anwenden → querschnittliche Regeln durchsetzen
7. Validieren → alle Scenarios gegen generierten Code prüfen

**Ambiguität:**
Wenn ein Scenario mehrdeutig ist, wählt der Compiler die einfachste sinnvolle Interpretation. Er kommentiert seine Entscheidung im generierten Code.

**Fehler:**
Wenn ein Scenario nicht kompilierbar ist (z.B. widersprüchliche Constraints), bricht der Compiler ab und benennt die betroffene Spec und das Scenario.

**Vollständigkeit:**
Der Compiler generiert immer vollständigen, lauffähigen Code. Kein Pseudocode, keine Platzhalter, keine TODOs im Output.

**Validierung:**
Nach der Kompilierung prüft der Compiler jeden Scenario-Block gegen den generierten Code. Erst wenn alle Scenarios erfüllt sind, ist der Build abgeschlossen.

---

## Konventionen

**Eine Spec pro Feature.** `auth.spec`, `payments.spec`, `notifications.spec`. Keine Monolith-Spec.

**Scenarios beschreiben Außenperspektive.** Kein Datenbankschema, kein Funktionsname, kein Framework im Scenario-Block.

**Constraints sind die Ausnahme.** Wenn ein Constraint nötig ist, kurz kommentieren warum.

**`/build` wird nicht committet** (optional). Es ist ein Artefakt, kein Quellcode.

**Specs können in jeder Sprache geschrieben werden.** Deutsch, Englisch, Japanisch — der Compiler versteht natürliche Sprache. Die Sprache in `meta.spec` ist ein Hinweis, keine Pflicht.

**Specs sind versioniert.** Änderungen an Specs führen zu einem neuen Build. Der Diff zwischen Specs ist der Diff der Anforderungen.

---

## Was SpecLang nicht ist

- Kein Framework-Aufsatz auf bestehende Sprachen
- Kein Workflow-Tool oder Codegenerator
- Keine Garantie auf spezifische Implementierungen — der Compiler entscheidet das Wie
- Kein Testing-Framework — Tests entstehen als Konsequenz der Kompilierung, nicht als direkter Spec-Output
