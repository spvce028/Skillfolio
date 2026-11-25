const SKILLFOLIO = {
  categories: {
    org: { name: "Organisation", icon: "▤", color: "violet", skill: "Arbeitsorganisation" },
    comm: { name: "Kommunikation", icon: "◌", color: "mint", skill: "Situationsgerechte Kommunikation" },
    tech: { name: "Digital & Analyse", icon: "⌘", color: "blue", skill: "Analytisches Denken" },
    team: { name: "Zusammenarbeit", icon: "◇", color: "rose", skill: "Teamkoordination" },
    creative: { name: "Gestaltung", icon: "✦", color: "peach", skill: "Visuelle Gestaltung" },
    problem: { name: "Problemlösen", icon: "⚙", color: "teal", skill: "Systematisches Problemlösen" }
  },
  types: {
    job: { name: "Nebenjob", icon: "▤", area: "work" },
    work: { name: "Berufserfahrung oder Praktikum", icon: "▤", area: "work" },
    hobby: { name: "Hobby oder privates Projekt", icon: "✦", area: "private" },
    project: { name: "Hochschulprojekt", icon: "⌘", area: "study" },
    volunteer: { name: "Ehrenamt", icon: "◇", area: "study" }
  },
  areas: {
    work: { name: "Beruf & Nebenjob", color: "violet", icon: "▤" },
    private: { name: "Hobbys & Interessen", color: "peach", icon: "✦" },
    study: { name: "Studium & Ehrenamt", color: "mint", icon: "◇" }
  },
  examples: [
    {
      id: "campus", type: "job", title: "Schichtkoordination im Campus-Café", period: "Mai 2026", category: "org", secondary: "comm",
      situation: "Beim Campusfest fiel kurz vor dem Mittagsandrang eine Servicekraft aus. Rund 120 Gäste wurden erwartet.",
      task: "Ich sollte den Service mit drei Kolleginnen und Kollegen organisieren und die Studierenden an der Theke über Wartezeiten informieren.",
      action: "Ich teilte Kasse, Ausgabe und Nachschub neu ein, vereinbarte kurze Rückmeldungen im Team und nannte Gästen die voraussichtliche Wartezeit.",
      result: "Wir bedienten rund 120 Gäste. Laut Kassenprotokoll blieb die durchschnittliche Wartezeit unter acht Minuten.",
      proof: "Kassenprotokoll und Schichtplan des Campusfests",
      cv: "Schichtkoordination für ein vierköpfiges Serviceteam beim Campusfest übernommen und rund 120 Gäste bei einer durchschnittlichen Wartezeit unter acht Minuten bedient."
    },
    {
      id: "ux", type: "project", title: "UX-Projekt zur Mensa-App", period: "Juli 2026", category: "tech", secondary: "team",
      situation: "In einem Hochschulprojekt sollte die Speiseauswahl in einer Mensa-App verständlicher werden.",
      task: "Ich war für die Auswertung der Nutzertests und die Priorisierung der größten Bedienprobleme zuständig.",
      action: "Ich führte sechs Nutzertests durch, gruppierte wiederkehrende Befunde und stimmte drei Änderungen mit dem Projektteam ab.",
      result: "Im Folgetest fanden fünf von sechs Testpersonen die Allergiehinweise ohne Rückfrage. Im ersten Test waren es zwei von sechs.",
      proof: "Anonymisiertes Testprotokoll und Abschlusspräsentation",
      cv: "Sechs Nutzertests ausgewertet und drei Verbesserungen für eine Mensa-App priorisiert. Im Folgetest fanden fünf von sechs Personen die Allergiehinweise selbstständig."
    },
    {
      id: "lern", type: "volunteer", title: "Lernpatenschaft im Stadtteiltreff", period: "Oktober 2026", category: "comm", secondary: "team",
      situation: "Eine Lerngruppe mit vier Jugendlichen bereitete sich auf unterschiedliche Mathematikarbeiten vor.",
      task: "Ich betreute die Gruppe einmal pro Woche und bereitete Übungen für verschiedene Lernstände vor.",
      action: "Ich fragte zu Beginn nach den schwierigsten Themen, erstellte kurze Aufgaben in zwei Schwierigkeitsstufen und ließ die Jugendlichen ihre Lösungswege gegenseitig erklären.",
      result: "Nach vier Wochen konnten alle vier Jugendlichen die jeweils vereinbarten Aufgabentypen selbstständig lösen.",
      proof: "Wochenpläne und anonymisierte Übungsübersicht",
      cv: "Wöchentliche Lernpatenschaft für vier Jugendliche gestaltet und differenzierte Mathematikübungen für verschiedene Lernstände entwickelt."
    },
    {
      id: "photo", type: "hobby", title: "Fotoserie für eine Laufrunde", period: "November 2026", category: "creative", secondary: "org",
      situation: "Ich fotografiere seit zwei Jahren in meiner Freizeit. Meine Laufrunde wollte einen Stadtlauf mit einer eigenen Fotoserie dokumentieren.",
      task: "Ich übernahm das Fotokonzept, die Aufnahmen am Streckenrand und die Bildauswahl für die Gruppe.",
      action: "Ich skizzierte eine Motivliste, plante drei Aufnahmeorte und bearbeitete die Fotos in einem einheitlichen Stil. Die Bildauswahl stimmte ich mit der Gruppe ab.",
      result: "Am Tag nach dem Lauf stellte ich zwölf bearbeitete Bilder bereit. Die Gruppe nutzte acht davon für ihren Veranstaltungsrückblick.",
      proof: "Fotoserie im privaten Portfolio und Veranstaltungsrückblick",
      cv: "Private Lauf-Fotoserie konzipiert und zwölf Bilder in einheitlichem Stil bearbeitet. Acht Aufnahmen wurden für den Veranstaltungsrückblick verwendet."
    }
  ],
  interviewExample: {
    type: "project", title: "Datenauswertung fürs Hochschulradio", period: "November 2026", category: "tech",
    situation: "Das Hochschulradio wollte wissen, welche Sendezeiten Studierende bevorzugen. In einer Umfrage lagen 86 Antworten vor.",
    task: "Ich sollte die Antworten bereinigen, auswerten und dem Redaktionsteam eine Empfehlung geben.",
    action: "Ich entfernte doppelte Einträge, verglich die bevorzugten Zeitfenster in einer Pivot-Tabelle und stellte dem Team die zwei häufigsten Optionen vor.",
    result: "Das Redaktionsteam wählte auf Basis der Auswertung einen neuen Sendetermin für das Pilotformat.",
    proof: "Anonymisierte Auswertung und Sitzungsprotokoll"
  },
  hobbyExample: {
    type: "hobby", title: "Fahrräder im Freundeskreis repariert", period: "Herbst 2026", category: "problem", secondary: "comm",
    situation: "Seit zwei Jahren repariere ich in meiner Freizeit Fahrräder. Bei drei Rädern im Freundeskreis hakten die Schaltungen oder die Bremsen schleiften.",
    task: "Ich wollte die Fehler systematisch eingrenzen und den anderen zeigen, wie sie einfache Kontrollen selbst durchführen können.",
    action: "Ich prüfte jedes Rad anhand einer Fehlersuche von den Zügen bis zu den Anschlägen, testete die Einstellungen einzeln und erklärte, wie man eine sichere Funktionskontrolle durchführt.",
    result: "Alle drei Räder liefen nach der Probefahrt einwandfrei. Zwei Personen nutzten meine Checkliste später selbst zur Kontrolle.",
    proof: "Eigene Wartungscheckliste und Fotos der Reparaturschritte"
  },
  roles: [
    {
      title: "Junior UX-Designer:in", field: "Digital & Gestaltung", icon: "✦", color: "violet",
      description: "Digitale Oberflächen entwerfen, mit Nutzerinnen und Nutzern testen und im Team verbessern.",
      skills: { creative: "Oberflächen und Prototypen visuell gestalten.", tech: "Nutzertests auswerten und Befunde vergleichen.", team: "Lösungsentwürfe mit Entwicklung und Produkt abstimmen." },
      explore: "Überarbeite eine Ansicht einer App und beobachte bei zwei kurzen Tests, wie andere sie nutzen."
    },
    {
      title: "Projektassistenz", field: "Organisation & Projekte", icon: "▤", color: "mint",
      description: "Termine und Aufgaben im Blick behalten und die Zusammenarbeit im Projektteam unterstützen.",
      skills: { org: "Termine, Aufgaben und Abhängigkeiten strukturieren.", comm: "Informationen für Beteiligte verständlich aufbereiten.", team: "Absprachen nachhalten und nächste Schritte koordinieren." },
      explore: "Übernimm bei einem kleinen Projekt die Terminübersicht und moderiere eine kurze Abstimmung."
    },
    {
      title: "Mitarbeiter:in im IT-Support", field: "IT & Service", icon: "⌘", color: "blue",
      description: "Technische Störungen eingrenzen und Menschen durch die nächsten Schritte führen.",
      skills: { problem: "Fehlerquellen prüfen und Lösungen Schritt für Schritt testen.", tech: "Technische Hinweise und Testergebnisse auswerten.", comm: "Lösungswege für unterschiedliche Vorkenntnisse erklären." },
      explore: "Dokumentiere einen alltäglichen technischen Fehler so, dass jemand anderes deine Lösung nachvollziehen kann."
    },
    {
      title: "Junior Content-Redakteur:in", field: "Medien & Kommunikation", icon: "◌", color: "peach",
      description: "Themen für eine Zielgruppe aufbereiten und Beiträge mit Text und Bild veröffentlichen.",
      skills: { creative: "Bildmaterial auswählen und stimmig aufbereiten.", comm: "Inhalte entsprechend der Zielgruppe verständlich vermitteln.", org: "Beiträge planen und Veröffentlichungen vorbereiten." },
      explore: "Erstelle einen kurzen Beitrag mit Text und Bild für eine Zielgruppe deiner Wahl."
    }
  ],
  star: [
    { key: "situation", letter: "S", name: "Situation" },
    { key: "task", letter: "T", name: "Aufgabe" },
    { key: "action", letter: "A", name: "Aktion" },
    { key: "result", letter: "R", name: "Ergebnis" }
  ]
};
