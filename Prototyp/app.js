"use strict";

const { categories, types, areas, examples, interviewExample, hobbyExample, roles, star } = SKILLFOLIO;
const pages = { dashboard: "Übersicht", interview: "KI-Interview", profil: "Kompetenzprofil", berufe: "Berufe entdecken", werkstatt: "Bewerbungswerkstatt" };
const storeKey = "skillfolio-prototype-v1";
const temporarySkillRemovals = new Map();
const main = document.querySelector("main");
const detail = document.querySelector("#detail-dialog");
const toast = document.querySelector("#toast");
const interviewSteps = ["Erfahrung", "KI-Chat", "Ergebnis"];
const demoInterviews = { hobby: hobbyExample, study: interviewExample };
const interviewVersion = 2;
const blankDraft = { type: "", title: "", period: "", description: "", messages: [], chatInput: "", example: "" };

let saved = {};
try {
  saved = JSON.parse(localStorage.getItem(storeKey)) ?? {};
} catch {
  saved = {};
}
const experiences = [...examples, ...(Array.isArray(saved.entries) ? saved.entries : [])];
const currentDraft = saved.interviewVersion === interviewVersion;
let draft = currentDraft ? { ...blankDraft, ...saved.draft } : migrateInterviewDraft(saved.draft);
let step = currentDraft && Number.isInteger(saved.step) && saved.step >= 0 && saved.step < interviewSteps.length ? saved.step : 0;
let showExampleResult = false;
let experienceTypeFilter = "all";
let workshopExperience = experiences[0].id;
let workshopMode = "cv";
let activePage = "";
let toastTimer;

function persist() {
  try {
    localStorage.setItem(storeKey, JSON.stringify({ entries: experiences.slice(examples.length), interviewVersion, draft, step }));
  } catch {
    // Editing still works in memory when the browser blocks local storage.
  }
}

function describeExperience(item) {
  return star.filter(({ key }) => item[key]).map(({ key, name }) => `${name}: ${item[key]}`).join("\n\n");
}

function migrateInterviewDraft(previous) {
  if (!previous) return { ...blankDraft };
  const { type = "", title = "", period = "" } = previous;
  const description = describeExperience(previous);
  const proof = previous.proof ? `Beleg: ${previous.proof}` : "";
  return { ...blankDraft, type, title, period, description: [description, proof].filter(Boolean).join("\n\n") };
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function pageHead(title, subtitle, label = "") {
  return `<div class="page-head">${label ? `<p class="eyebrow">${label}</p>` : ""}
    <h1>${title}</h1><p>${subtitle}</p></div>`;
}

function tile(icon, color = "") {
  return `<span class="icon-tile ${color}" aria-hidden="true">${icon}</span>`;
}

function skillRemovalKey(item, key) {
  return `${storeKey}:removed-skill:${key}:${item.id}`;
}

function isSkillRemoved(item, key) {
  const storageKey = skillRemovalKey(item, key);
  if (temporarySkillRemovals.has(storageKey)) return temporarySkillRemovals.get(storageKey);
  try {
    return localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function hasSkill(item, key) {
  return (item.category === key || item.secondary === key) && !isSkillRemoved(item, key);
}

function areaCounts() {
  return Object.fromEntries(Object.keys(areas).map(key => [
    key, experiences.filter(item => types[item.type].area === key).length
  ]));
}

function experienceAreas() {
  const counts = areaCounts();
  return `<section class="card flow-side area-summary"><h3>Erfahrungen im Profil</h3>
    <ul>${Object.entries(areas).map(([key, area]) => `<li>${tile(area.icon, area.color)}<span>${area.name}</span><strong>${counts[key]}</strong></li>`).join("")}</ul>
    <p>Erfasse mehrere Beispiele aus unterschiedlichen Lebensbereichen, um dein Profil zu ergänzen.</p></section>`;
}

function experienceRow(item) {
  return `<div class="experience-row">
    <button type="button" class="row-button" data-detail="${esc(item.id)}">
      ${tile(types[item.type].icon, categories[item.category].color)}
      <span class="row-text"><strong>${esc(item.title)}</strong><small>${types[item.type].name}</small></span>
      <span class="row-date">${esc(item.period)}</span>
    </button>
  </div>`;
}

function renderDashboard() {
  const skillCount = Object.keys(categories).filter(key => experiences.some(item => hasSkill(item, key))).length;
  const stats = [
    [experiences.length, "Erfahrungen", "▤", ""],
    [skillCount, "Kompetenzen", "◇", "mint"],
    [experiences.filter(item => item.proof).length, "Belege", "✓", "blue"]
  ];
  main.innerHTML = `${pageHead("Hallo, Lea!", "Entdecke, welche Kompetenzen in deinen Erfahrungen stecken.", "Dein Karriere-Workspace")}
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <p class="hero-label"><span aria-hidden="true">✦</span> Geführtes KI-Interview</p>
        <h2 id="hero-title">Deine Erfahrungen.<br>Deine Kompetenzen.</h2>
        <p>Ob Nebenjob, Studium oder Hobby: Beschreibe, was du getan hast, und lerne den Ablauf des KI-Interviews kennen.</p>
        <a class="button button-light" href="#interview">${step > 0 || draft.title ? "Interview fortsetzen" : "Interview starten"}</a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="orbit"></div>
        <span class="art-star one">✦</span><span class="art-star two">✧</span><span class="art-star three">✦</span>
        <div class="art-card art-card-back"></div>
        <div class="art-card art-card-front"><em>✦</em><span class="art-line"></span><span class="art-line short"></span></div>
        <span class="art-check">✓</span>
      </div>
    </section>
    <section class="stats" aria-label="Dein Stand">
      ${stats.map(([count, label, icon, color]) => `<div class="card stat">${tile(icon, color)}<div><strong>${count}</strong><p>${label}</p></div></div>`).join("")}
    </section>
    <div class="split">
      <section><div class="section-heading"><h2>Letzte Erfahrungen</h2></div>
        <div class="card experience-list">${experiences.slice(-3).reverse().map(experienceRow).join("")}</div>
      </section>
      <section><div class="section-heading"><h2>Direkt weiterarbeiten</h2></div>
        <article class="card next-card career-next">${tile("◈")}<div><h3>Berufe entdecken</h3><p>Sieh, in welchen Rollen deine Kompetenzen gefragt sind und welche Erfahrungen dafür sprechen.</p><a class="text-link" href="#berufe">Zu deinen Berufsvorschlägen</a></div></article>
        <article class="card next-card">${tile("◇", "mint")}<div><h3>Kompetenzprofil ansehen</h3><p>Finde zu jeder Kompetenz eine konkrete Erfahrung und den dazugehörigen Beleg, falls vorhanden.</p><a class="text-link" href="#profil">Zum Kompetenzprofil</a></div></article>
        <article class="card next-card">${tile("▤", "blue")}<div><h3>Für die Bewerbung nutzen</h3><p>Formuliere einen Lebenslaufpunkt oder übe eine Antwort fürs Gespräch.</p><a class="text-link" href="#werkstatt">Zur Bewerbungswerkstatt</a></div></article>
      </section>
    </div>`;
}

function options(items, selected) {
  return Object.entries(items).map(([key, item]) =>
    `<option value="${esc(key)}" ${key === selected ? "selected" : ""}>${esc(item.name)}</option>`
  ).join("");
}

function experienceFields() {
  return `<h2 tabindex="-1">Welche Erfahrung möchtest du besprechen?</h2>
    <p class="prompt">Wähle eine Tätigkeit aus Beruf, Studium, Ehrenamt oder Freizeit.</p>
    <form id="interview-form">
      <div class="form-grid">
        <label class="field">Art der Erfahrung
          <select name="type" required><option value="">Bitte wählen</option>${options(types, draft.type)}</select>
        </label>
        <label class="field">Zeitraum (optional)
          <input name="period" value="${esc(draft.period)}" placeholder="z. B. November 2026" maxlength="85">
        </label>
      </div>
      <label class="field">Titel der Erfahrung
        <input name="title" value="${esc(draft.title)}" placeholder="z. B. Fotoserie für meine Laufrunde" maxlength="85" required>
      </label>
      <label class="field">Tätigkeit beschreiben
        <small>Beschreibe die Tätigkeit so detailliert wie möglich. Was war deine Aufgabe, was hast du konkret getan und was kam dabei heraus?</small>
        <textarea name="description" maxlength="4000" placeholder="Erzähl in deinen eigenen Worten von deiner Erfahrung." required>${esc(draft.description)}</textarea>
      </label>
      <p id="form-error" class="form-error" role="alert" hidden>Bitte fülle dieses Feld aus.</p>
      <div class="form-actions">
        ${draft.messages.length || draft.chatInput ? "" : `<div class="example-actions"><button class="text-link" type="button" data-example="hobby">Hobby-Beispiel laden</button><button class="text-link" type="button" data-example="study">Studienbeispiel laden</button></div>`}
        <button class="button button-primary" type="submit">Zum KI-Chat</button>
      </div>
    </form>`;
}

function userMessage(message) {
  return `<div class="chat-message chat-user"><div><strong>Du</strong><p>${esc(message)}</p></div><span class="chat-avatar" aria-hidden="true">LM</span></div>`;
}

function chatInterface() {
  return `<h2 tabindex="-1">Interview im Chat</h2>
    <p class="chat-context">Deine Erfahrung: <strong>${esc(draft.title)}</strong></p>
    <p class="interview-note">Chat-Vorschau. Deine Antworten erscheinen im Verlauf. Die lokale KI wird später verbunden.</p>
    <div class="chat-log" role="log" aria-label="Interviewverlauf" tabindex="0">
      <div class="chat-message chat-assistant">${tile("✦")}<div><strong>Skillfolio · Beispielfrage</strong>
        <p>Was war dein eigener Beitrag? Erzähl mir von einer konkreten Aufgabe und davon, wie du sie angegangen bist.</p></div></div>
      ${draft.messages.map(userMessage).join("")}
    </div>
    <form id="chat-form" class="chat-form">
      <label class="field">Deine Antwort
        <textarea name="chatInput" placeholder="Schreib deine Antwort …" rows="2" maxlength="2000" required>${esc(draft.chatInput)}</textarea>
      </label>
      <button class="button button-outline" type="submit" ${draft.chatInput.trim() ? "" : "disabled"}>Nachricht senden</button>
    </form>
    <div class="form-actions">
      <button class="button button-outline" type="button" data-back>Zurück zur Erfahrung</button>
      <button class="button button-primary" type="button" data-result>Zum Ergebnis</button>
    </div>`;
}

function resultInterface() {
  const demo = demoInterviews[draft.example] ?? hobbyExample;
  const skills = [demo.category, demo.secondary].filter(Boolean).map(key => categories[key].skill);
  return `<h2 tabindex="-1">Dein Interviewergebnis</h2>
    <p class="prompt">Hier erscheinen später die von der lokalen KI ermittelten Kompetenzen und Beispiele aus dem Gespräch.</p>
    <div class="result-placeholder">
      ${tile("◇")}<div><h3>Auswertung steht aus</h3><p>Du kannst zum Chat zurückgehen und unklare oder fehlende Angaben ergänzen.</p></div>
    </div>
    <button class="text-link example-toggle" type="button" data-result-example aria-expanded="${showExampleResult}" aria-controls="interview-example-result">${showExampleResult ? "Beispiel-Ergebnis ausblenden" : "Beispiel-Ergebnis anzeigen"}</button>
    <section class="result-example" id="interview-example-result" ${showExampleResult ? "" : "hidden"}>
      <p class="eyebrow">Vorgefertigtes Beispiel-Ergebnis</p>
      <h3>${demo.title}</h3>
      <ul class="result-skills" aria-label="Kompetenzen">${skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
      ${starList(demo)}${proofBox(demo)}
    </section>
    <div class="form-actions">
      <button class="button button-outline" type="button" data-back>Zurück zum KI-Chat</button>
    </div>`;
}

function renderInterview(focus = false) {
  main.innerHTML = `${pageHead("KI-Interview", "Beschreibe eine Erfahrung, ergänze sie im Gespräch und sieh dir an, wie die Auswertung aufgebaut ist.")}<div class="flow">
    <section class="card interview-card">
      <div class="progress-meta"><strong>${interviewSteps[step]}</strong><span>Schritt ${step + 1} von ${interviewSteps.length}</span></div>
      <div class="meter" aria-hidden="true">${interviewSteps.map((_, index) => `<span class="${index <= step ? "done" : ""}"></span>`).join("")}</div>
      ${[experienceFields, chatInterface, resultInterface][step]()}
    </section>
    <aside class="stack"><section class="card flow-side"><h3>Dein Interviewverlauf</h3>
      <ol class="steps">${interviewSteps.map((name, index) => `<li ${index === step ? 'aria-current="step"' : ""}><span aria-hidden="true">${index < step ? "✓" : index + 1}</span>${name}</li>`).join("")}</ol>
    </section>${experienceAreas()}</aside>
  </div>`;
  const log = main.querySelector(".chat-log");
  if (log) log.scrollTop = log.scrollHeight;
  if (focus) {
    window.scrollTo(0, 0);
    main.querySelector("h2").focus({ preventScroll: true });
  }
}


function profileEntry(item) {
  const skills = [...new Set([item.category, item.secondary].filter(key => Object.hasOwn(categories, key)))];
  const active = skills.filter(key => hasSkill(item, key));
  const removed = skills.filter(key => !active.includes(key));
  return `<div class="profile-entry" data-experience="${esc(item.id)}">
    <button type="button" class="row-button" data-detail="${esc(item.id)}">
      <span class="row-text"><strong>${esc(item.title)}</strong>
        <small>${esc(item.proof || "Erfahrung ohne hinterlegten Beleg")}</small>
      </span>
    </button>
    ${active.length ? `<ul class="profile-skills" aria-label="Kompetenzen">${active.map(key => `<li class="skill-chip">
      <span>${categories[key].skill}</span>
      <button type="button" data-remove-skill="${key}" aria-label="${categories[key].skill} entfernen" title="Kompetenz entfernen">×</button>
    </li>`).join("")}</ul>` : '<p class="profile-no-skills">Keine Kompetenzen zugeordnet.</p>'}
    ${removed.length ? `<details class="profile-removed">
      <summary>Entfernte Kompetenzen (${removed.length})</summary>
      <ul>${removed.map(key => `<li><span>${categories[key].skill}</span>
        <button type="button" class="text-link" data-restore-skill="${key}" aria-label="${categories[key].skill} wiederherstellen">Wiederherstellen</button>
      </li>`).join("")}</ul>
    </details>` : ""}
  </div>`;
}

function changeProfileSkill(button, key, remove) {
  const entry = button.closest(".profile-entry");
  const item = experiences.find(experience => experience.id === entry.dataset.experience);
  if (!item || ![item.category, item.secondary].includes(key)) return;
  const storageKey = skillRemovalKey(item, key);
  let stored = true;
  try {
    if (remove) localStorage.setItem(storageKey, "1");
    else localStorage.removeItem(storageKey);
    temporarySkillRemovals.delete(storageKey);
  } catch {
    temporarySkillRemovals.set(storageKey, remove);
    stored = false;
  }
  const template = document.createElement("template");
  template.innerHTML = profileEntry(item);
  const updatedEntry = template.content.firstElementChild;
  entry.replaceWith(updatedEntry);
  updatedEntry.querySelector("[data-detail]").focus();
  const action = remove ? "entfernt" : "wiederhergestellt";
  notify(`${categories[key].skill} ${action}.${stored ? "" : " Die Änderung gilt bis zum Neuladen."}`);
}

function profileCards() {
  return Object.entries(types).filter(([key]) => experienceTypeFilter === "all" || experienceTypeFilter === key).map(([key, type]) => {
    const items = experiences.filter(item => item.type === key);
    return `<article class="card profile-card">
      <div class="profile-card-head">${tile(type.icon, areas[type.area].color)}<div>
        <h2>${type.name}</h2><p>${items.length} ${items.length === 1 ? "Erfahrung" : "Erfahrungen"}</p>
      </div></div>
      ${items.map(profileEntry).join("") || '<p class="profile-empty">Für diese Art der Erfahrung gibt es noch keinen Eintrag.</p>'}
    </article>`;
  }).join("");
}

function renderProfile() {
  const filters = { all: { name: "Alle Erfahrungen" }, ...types };
  main.innerHTML = `${pageHead("Kompetenzprofil", "Finde zu jeder Erfahrung die dazugehörigen Kompetenzen und Belege.")}
    <div class="profile-actions"><div class="toolbar" role="group" aria-label="Art der Erfahrung">
      ${Object.entries(filters).map(([key, item]) =>
        `<button class="filter" type="button" data-filter="${key}" aria-pressed="${key === experienceTypeFilter}">${item.name}</button>`).join("")}
      </div>
      <a class="button button-outline" href="#berufe">Passende Berufe entdecken</a></div>
    <div class="skills-grid" id="skill-results" aria-live="polite">${profileCards()}</div>`;
}

function roleCard(role) {
  const total = role.matches.length;
  return `<article class="card role-card">
    <div class="role-heading">${tile(role.icon, role.color)}<div><p>${role.field}</p><h2>${role.title}</h2></div></div>
    <p class="role-description">${role.description}</p>
    <div class="role-fit">
      <strong>${role.count} von ${total}</strong> Kompetenzen im Profil
      <div class="role-meter" aria-hidden="true">${Array.from({ length: total }, (_, index) => `<i class="${index < role.count ? "filled" : ""}"></i>`).join("")}</div>
    </div>
    <details class="role-details">
      <summary>Aufgaben und passende Erfahrungen</summary>
      <ul class="role-skills">${role.matches.map(({ key, task, item }) => `<li>
        <h3>${categories[key].skill}</h3><p>${task}</p>
        ${item
          ? `<button class="text-link role-evidence" type="button" data-detail="${esc(item.id)}">${esc(item.title)}</button><p class="role-source">${types[item.type].name}${item.proof ? " · Beleg hinterlegt" : ""}</p>`
          : '<span class="role-gap">Dazu gibt es noch kein Beispiel im Profil.</span>'}
      </li>`).join("")}</ul>
      <div class="role-try"><h3>Probier es aus</h3><p>${role.explore}</p></div>
    </details>
  </article>`;
}

function renderCareers() {
  const rankedRoles = roles.map(role => {
    const matches = Object.entries(role.skills).map(([key, task]) => {
      const candidates = experiences.filter(item => hasSkill(item, key));
      const item = candidates.findLast(candidate => candidate.proof) ?? candidates.at(-1);
      return { key, task, item };
    });
    return { ...role, matches, count: matches.filter(match => match.item).length };
  }).sort((first, second) => second.count - first.count);
  main.innerHTML = `${pageHead("Berufe entdecken", "Finde Rollen, in denen du deine Kompetenzen einsetzen kannst, und prüfe, welche Aufgaben dich interessieren.", "Berufsorientierung")}
    <section class="career-intro" aria-labelledby="career-match-title">
      ${tile("◈")}<div><h2 id="career-match-title">Darauf basieren deine Vorschläge</h2>
      <p>Skillfolio vergleicht die Kompetenzen in deinem Profil mit drei typischen Aufgaben pro Beruf. Öffne eine Rolle, um deine passenden Erfahrungen und eine Idee zum Ausprobieren zu sehen.</p></div>
    </section>
    <div class="roles-grid">${rankedRoles.map(roleCard).join("")}</div>
    <section class="card career-footer"><div><h2>Welche Erfahrung fehlt noch?</h2><p>Auch aus einem Hobby oder privaten Projekt kannst du eine weitere Kompetenz ableiten.</p></div>
      <a href="#interview" class="button button-outline">Erfahrung hinzufügen</a></section>`;
}

function starList(item) {
  return `<div class="star-list">${star.map(entry => `<div class="star-item">
      ${tile(entry.letter)}<div><h3>${entry.name}</h3><p>${esc(item[entry.key])}</p></div>
    </div>`).join("")}</div>`;
}

function proofBox(item) {
  return item.proof
    ? `<p class="proof-box"><strong>Möglicher Beleg</strong><br>${esc(item.proof)}</p>`
    : '<p class="proof-box missing">Für diese Erfahrung ist kein Beleg hinterlegt.</p>';
}

function showDetail(id) {
  const item = experiences.find(entry => entry.id === id);
  if (!item) return;
  detail.innerHTML = `<div class="dialog-heading"><div><p class="eyebrow">${types[item.type].name}${item.period ? ` · ${esc(item.period)}` : ""}</p>
    <h2 id="detail-title">${esc(item.title)}</h2></div>
    <form method="dialog"><button class="dialog-close" aria-label="Schließen" autofocus>×</button></form></div>
    ${starList(item)}${proofBox(item)}
    <div class="form-actions"><a class="button button-primary" href="#werkstatt" data-workshop-id="${esc(item.id)}">In der Werkstatt verwenden</a></div>`;
  detail.showModal();
}

function cvText(item) {
  if (item.cv) return item.cv;
  const action = item.action.replace(/^ich\s+/i, "").replace(/[.!?]+$/, "");
  const sentence = action.charAt(0).toLocaleUpperCase("de-DE") + action.slice(1);
  return `${sentence}. Ergebnis: ${item.result}`;
}

function renderWorkshop() {
  main.innerHTML = `${pageHead("Bewerbungswerkstatt", "Bereite einen Lebenslaufpunkt oder eine Antwort fürs Bewerbungsgespräch aus einer erfassten Erfahrung vor.")}
    <div class="workshop-grid">
      <section class="card workshop-main">
        <div class="toolbar" role="group" aria-label="Ausgabeformat">
          <button class="filter" type="button" data-mode="cv" aria-pressed="${workshopMode === "cv"}">Lebenslauf</button>
          <button class="filter" type="button" data-mode="star" aria-pressed="${workshopMode === "star"}">Bewerbungsgespräch</button>
        </div>
        <label class="field">Erfahrung auswählen
        <select id="workshop-experience">${experiences.map(item =>
          `<option value="${esc(item.id)}" ${item.id === workshopExperience ? "selected" : ""}>${esc(item.title)}</option>`).join("")}
        </select></label>
        <div id="workshop-output" class="output" aria-live="polite"></div>
      </section>
      <aside id="workshop-help" class="card workshop-side"></aside>
    </div>`;
  renderWorkshopOutput();
}

function renderWorkshopOutput() {
  const item = experiences.find(entry => entry.id === workshopExperience) ?? experiences[0];
  const isCv = workshopMode === "cv";
  document.querySelector("#workshop-output").innerHTML = `<h2>${isCv ? "Entwurf für deinen Lebenslauf" : "Antwort nach der STAR-Methode"}</h2>
    ${isCv ? `${item.type === "hobby" ? '<p class="tip-note">Den Punkt kannst du unter „Interessen & Projekte“ aufnehmen, wenn er zur Stelle passt.</p>' : ""}<p class="output-quote">${esc(cvText(item))}</p>` :
      `<p class="tip-note">Mögliche Frage im Gespräch: „Erzählen Sie von einer Situation, in der Sie eine Herausforderung gelöst haben.“</p>${starList(item)}`}
    <button class="button button-primary" type="button" data-copy>${isCv ? "Lebenslaufpunkt kopieren" : "STAR-Antwort kopieren"}</button>
    ${proofBox(item)}`;
  document.querySelector("#workshop-help").innerHTML = isCv
    ? "<h3>Formulierung für den Lebenslauf</h3><p>Beschreibe deinen Beitrag und die Wirkung so konkret wie möglich.</p><ol><li>Beginne mit deiner Handlung.</li><li>Übernimm Zahlen aus deinem Beispiel, wenn du sie belegen kannst.</li><li>Prüfe, ob die Formulierung zur Stelle passt.</li></ol>"
    : "<h3>Im Gespräch erzählen</h3><p>Nutze die vier Abschnitte als Gedächtnisstütze und erzähle das Beispiel in eigenen Worten.</p><ol><li>Halte die Ausgangslage kurz.</li><li>Erkläre deinen konkreten Beitrag.</li><li>Schließe mit dem Ergebnis ab.</li></ol>";
}

function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
    toast.textContent = "";
  }, 4000);
}

async function copyOutput() {
  const item = experiences.find(entry => entry.id === workshopExperience) ?? experiences[0];
  const value = workshopMode === "cv" ? cvText(item) : star.map(entry => `${entry.name}: ${item[entry.key]}`).join("\n\n");
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    const trigger = document.activeElement;
    field.value = value;
    field.readOnly = true;
    field.className = "clipboard-fallback";
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    field.remove();
    trigger?.focus();
    if (!copied) {
      const output = document.querySelector("#workshop-output");
      if (!output) return;
      const fallback = document.createElement("textarea");
      fallback.className = "manual-copy";
      fallback.setAttribute("aria-label", "Text zum manuellen Kopieren");
      fallback.readOnly = true;
      fallback.value = value;
      output.querySelector(".manual-copy")?.remove();
      output.append(fallback);
      fallback.select();
      notify("Text markiert. Mit Strg+C kopieren.");
      return;
    }
  }
  notify("In die Zwischenablage kopiert.");
}

function renderRoute(focus = false) {
  const hash = location.hash.slice(1);
  if (hash === "main") {
    if (!activePage) renderPage("dashboard");
    main.focus();
    return;
  }
  const page = Object.hasOwn(pages, hash) ? hash : "dashboard";
  renderPage(page);
  if (focus) {
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
}

function renderPage(page) {
  activePage = page;
  document.title = `${pages[page]} | Skillfolio`;
  document.querySelector("#breadcrumb").textContent = pages[page];
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  ({ dashboard: renderDashboard, interview: renderInterview, profil: renderProfile, berufe: renderCareers, werkstatt: renderWorkshop })[page]();
}

function updateDraft(event) {
  const field = event.target;
  if (!field.name) return;
  if (field.form?.id === "chat-form") {
    draft.chatInput = field.value;
    field.form.querySelector("button").disabled = !field.value.trim();
  } else if (field.form?.id === "interview-form") {
    draft[field.name] = field.value;
    field.form.querySelector("#form-error").hidden = true;
  } else {
    return;
  }
  persist();
}

main.addEventListener("input", updateDraft);
main.addEventListener("change", event => {
  updateDraft(event);
  if (event.target.id === "workshop-experience") {
    workshopExperience = event.target.value;
    renderWorkshopOutput();
  }
});

main.addEventListener("submit", event => {
  if (event.target.id === "chat-form") {
    event.preventDefault();
    const field = event.target.elements.chatInput;
    const message = field.value.trim();
    if (!message) return;
    draft.messages = [...draft.messages, message];
    draft.chatInput = "";
    field.value = "";
    event.target.querySelector("button").disabled = true;
    const log = main.querySelector(".chat-log");
    log.insertAdjacentHTML("beforeend", userMessage(message));
    log.scrollTop = log.scrollHeight;
    field.focus();
    persist();
    return;
  }
  if (event.target.id !== "interview-form") return;
  event.preventDefault();
  const fields = Object.fromEntries(Array.from(new FormData(event.target), ([key, value]) => [key, value.trim()]));
  const requiredFields = event.target.querySelectorAll("[required]");
  const emptyField = Array.from(requiredFields).find(field => !fields[field.name]);
  if (emptyField) {
    document.querySelector("#form-error").hidden = false;
    emptyField.focus();
    return;
  }
  draft = { ...draft, ...fields };
  step = 1;
  persist();
  renderInterview(true);
});

main.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const { dataset } = button;
  if (dataset.removeSkill) changeProfileSkill(button, dataset.removeSkill, true);
  if (dataset.restoreSkill) changeProfileSkill(button, dataset.restoreSkill, false);
  if (dataset.detail) showDetail(dataset.detail);
  if (dataset.filter) {
    experienceTypeFilter = dataset.filter;
    main.querySelectorAll("[data-filter]").forEach(filter => filter.setAttribute("aria-pressed", filter === button));
    document.querySelector("#skill-results").innerHTML = profileCards();
  }
  if (dataset.mode) {
    workshopMode = dataset.mode;
    main.querySelectorAll("[data-mode]").forEach(mode => mode.setAttribute("aria-pressed", mode === button));
    renderWorkshopOutput();
  }
  if ("example" in dataset) {
    draft = { ...migrateInterviewDraft(demoInterviews[dataset.example]), example: dataset.example };
    showExampleResult = false;
    persist();
    renderInterview(true);
    notify("Beispiel geladen. Du kannst alle Angaben bearbeiten.");
  }
  if ("back" in dataset) {
    step -= 1;
    persist();
    renderInterview(true);
  }
  if ("result" in dataset) {
    step = 2;
    showExampleResult = false;
    persist();
    renderInterview(true);
  }
  if ("resultExample" in dataset) {
    showExampleResult = !showExampleResult;
    button.setAttribute("aria-expanded", showExampleResult);
    button.textContent = showExampleResult ? "Beispiel-Ergebnis ausblenden" : "Beispiel-Ergebnis anzeigen";
    document.querySelector("#interview-example-result").hidden = !showExampleResult;
  }
  if ("copy" in dataset) copyOutput();
});

detail.addEventListener("click", event => {
  const link = event.target.closest("[data-workshop-id]");
  if (!link) return;
  workshopExperience = link.dataset.workshopId;
  detail.close();
});

window.addEventListener("hashchange", () => renderRoute(true));
renderRoute();
