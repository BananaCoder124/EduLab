const SUBJECTS = [
  "Matematiikka",
  "Fysiikka",
  "Kemia",
  "Biologia",
  "Maantiede (maantieto)",
  "Ympäristöoppi (varhaiskasvatuksessa ja alakoulussa)",
  "Tietotekniikka ja teknologia",
];

const TYPES = ["Työohje", "Laboratoriotyö", "Projekti-idea", "Opetusvinkki", "Tehtäväpaketti"];

const SEED = [
  { id: 1, title: "Heilurin jaksonaika ja putoamiskiihtyvyys", subject: "Fysiikka", type: "Laboratoriotyö", author: "Anna Virtanen", date: "12.9.2026", description: "Testattu FY1-kurssilla. Oppilaat määrittävät g:n heilurin avulla.", content: "Välineet: naru, punnus, sekuntikello, mittanauha.\n1. Mittaa narun pituus L.\n2. Mittaa 10 heilahduksen aika ja laske T.\n3. Toista viidellä pituudella.\n4. Piirrä T² L:n funktiona, kulmakerroin = 4π²/g.\nVinkki: pidä heilahduskulma alle 10°." },
  { id: 2, title: "Ohmin laki – virtapiirityöpiste", subject: "Fysiikka", type: "Työohje", author: "Anonyymi", date: "3.10.2026", description: "Valmis 45 min työpiste, toimii myös etäopetuksessa simulaatiolla.", content: "Kytke vastus, virtamittari ja jännitelähde sarjaan. Mittaa U ja I viidellä jännitteellä. Määritä resistanssi kuvaajasta." },
  { id: 3, title: "Vapaan pudotuksen videoanalyysi", subject: "Fysiikka", type: "Projekti-idea", author: "Mikko Laine", date: "20.8.2026", description: "Oppilaat kuvaavat puhelimella ja analysoivat Trackerilla.", content: "Ryhmät kuvaavat pallon pudotuksen 240 fps. Analyysi Tracker-ohjelmalla, raportti 2 sivua." },
  { id: 4, title: "Titraus: etikan happopitoisuus", subject: "Kemia", type: "Laboratoriotyö", author: "Liisa Mäkinen", date: "1.9.2026", description: "KE2-kurssin klassikko turvallisesti kotitalousetikalla.", content: "Titraa 10 ml laimennettua etikkaa 0,1 M NaOH:lla fenoliftaleiini-indikaattorilla." },
  { id: 5, title: "Derivaatan tutkiva aloitus GeoGebralla", subject: "Matematiikka", type: "Opetusvinkki", author: "Anonyymi", date: "15.9.2026", description: "Sekanttien kautta tangenttiin – 20 min aloitustehtävä.", content: "Avaa GeoGebra, piirrä f(x)=x², liu'uta pistettä h→0 ja tarkastele sekantin kulmakerrointa." },
  { id: 6, title: "Solun osmoosi perunalla", subject: "Biologia", type: "Laboratoriotyö", author: "Jussi Korhonen", date: "28.9.2026", description: "Edullinen ja varma työ BI1-kurssille.", content: "Perunapalat eri suolaliuoksiin 30 min, punnitse ennen ja jälkeen, piirrä massamuutos pitoisuuden funktiona." },
  { id: 7, title: "Paikallisen pohjaveden kartoitus", subject: "Maantiede (maantieto)", type: "Projekti-idea", author: "Sari Heikkinen", date: "5.10.2026", description: "Paikkatietoprojekti Maanmittauslaitoksen aineistoilla.", content: "Oppilaat hakevat pohjavesialueet karttapalvelusta ja tekevät riskikartan omasta kunnasta." },
  { id: 8, title: "Vuodenajat pihalla – havaintopäiväkirja", subject: "Ympäristöoppi (varhaiskasvatuksessa ja alakoulussa)", type: "Tehtäväpaketti", author: "Anonyymi", date: "10.10.2026", description: "Kuvallinen havaintovihko 1.–2. luokalle.", content: "Kerran viikossa sama puu: piirrä, mittaa lämpötila, kirjaa linnut." },
  { id: 9, title: "Micro:bit-sääasema", subject: "Tietotekniikka ja teknologia", type: "Projekti-idea", author: "Pekka Nieminen", date: "18.9.2026", description: "Ohjelmoidaan lämpötila- ja valoanturi, data taulukkoon.", content: "MakeCode-koodi mittaa 10 min välein, data siirretään taulukkolaskentaan ja analysoidaan." },
];

let user = null;
let items = [...SEED];
let subject = "Kaikki";
let query = "";
let authMode = "in";
let openMaterial = null;
let editing = null;
let toastTimer = null;

const app = document.getElementById("app");
const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[c]);

function render() {
  app.innerHTML = user ? libraryTemplate() : authTemplate();
  bindEvents();
}

function authTemplate() {
  return `
    <main class="auth-layout">
      <section class="auth-hero">
        <span class="brand-title">Opepankki</span>
        <div>
          <h1>Valmiita, testattuja materiaaleja – opettajilta opettajille.</h1>
          <p>Työohjeet, laboratoriotyöt ja projekti-ideat LUMA-aineisiin. Lataa, jaa ja muokkaa omiin tarpeisiisi.</p>
        </div>
        <span style="font-size:0.875rem;color:var(--muted-foreground)">Demo – tietoja ei tallenneta.</span>
      </section>
      <section class="auth-panel">
        <form id="auth-form" class="auth-card">
          <h2>${authMode === "in" ? "Kirjaudu sisään" : "Luo tili"}</h2>
          ${authMode === "up" ? field("Nimi", "name", "text") : ""}
          ${field("Sähköposti", "email", "email")}
          ${field("Salasana", "password", "password")}
          <p id="auth-error" class="error-text" hidden></p>
          <button class="btn-primary" type="submit">${authMode === "in" ? "Kirjaudu" : "Rekisteröidy"}</button>
          <p class="toggle-text">
            ${authMode === "in" ? "Eikö sinulla ole tiliä?" : "Onko sinulla jo tili?"}
            <button id="auth-toggle" class="toggle-btn" type="button">${authMode === "in" ? "Rekisteröidy" : "Kirjaudu"}</button>
          </p>
        </form>
      </section>
    </main>`;
}

function field(label, id, type) {
  return `<label class="field"><span class="field-label">${label}</span><input class="input" id="${id}" type="${type}" required></label>`;
}

function filteredItems() {
  const search = query.trim().toLowerCase();
  return items.filter((m) =>
    (subject === "Kaikki" || m.subject === subject) &&
    (!search || [m.title, m.description, m.content, m.type, m.author, m.subject].join(" ").toLowerCase().includes(search))
  );
}

function libraryTemplate() {
  const results = filteredItems();
  return `
    <div>
      <header class="app-header">
        <div class="header-inner">
          <span class="brand-title">Opepankki</span>
          <div class="header-actions">
            <span class="header-user">Hei, ${esc(user)}</span>
            <button id="add-material" class="btn-accent">+ Lisää materiaali</button>
            <button id="logout" class="btn-outline">Kirjaudu ulos</button>
          </div>
        </div>
      </header>
      <main class="library-main">
        <h1>Materiaalipankki</h1>
        <p style="margin-top:0.5rem;color:var(--muted-foreground)">Hae opettajien jakamia materiaaleja aineen tai avainsanan mukaan.</p>
        <input id="search" value="${esc(query)}" class="search-input" placeholder="Hae avainsanalla, esim. heiluri, titraus, GeoGebra…">
        <div class="subject-chips">
          ${["Kaikki", ...SUBJECTS].map((s) => `<button class="chip-btn ${subject === s ? "active" : ""}" data-subject="${esc(s)}">${esc(s)}</button>`).join("")}
        </div>
        ${results.length === 0 ? emptyTemplate() : `<div class="cards-grid">${results.map(cardTemplate).join("")}</div>`}
      </main>
      ${openMaterial ? detailModalTemplate(openMaterial) : ""}
      ${editing ? editorModalTemplate(editing) : ""}
    </div>`;
}

function emptyTemplate() {
  return `<div class="empty-state"><h3>Ei tuloksia vielä.</h3><p>Ole ensimmäinen ja jaa oma materiaalisi muille.</p></div>`;
}

function cardTemplate(m) {
  return `
    <article class="material-card">
      <div class="card-badges">
        <span class="badge-subject">${esc(m.subject.split(" (")[0])}</span>
        <span class="badge-type">${esc(m.type)}</span>
      </div>
      <h3>${esc(m.title)}</h3>
      <p class="card-desc">${esc(m.description)}</p>
      <p class="card-meta">${esc(m.author)} · ${esc(m.date)}</p>
      <div class="card-actions">
        <button class="btn-primary" data-open="${m.id}">Avaa</button>
        <button class="btn-outline" data-download="${m.id}">Lataa</button>
        <button class="btn-outline" data-share="${m.id}">Jaa</button>
      </div>
    </article>`;
}

function detailModalTemplate(m) {
  return `
    <div class="modal-overlay" data-close-modal>
      <section class="modal-content">
        <button class="modal-close" data-close-modal aria-label="Sulje">✕</button>
        <span style="font-size:0.875rem;color:var(--muted-foreground)">${esc(m.subject)} · ${esc(m.type)}</span>
        <h2 style="margin-top:0.25rem;font-size:1.875rem;padding-right:2rem">${esc(m.title)}</h2>
        <p style="margin-top:0.25rem;font-size:0.875rem;color:var(--muted-foreground)">${esc(m.author)} · ${esc(m.date)}</p>
        <p style="margin-top:1rem">${esc(m.description)}</p>
        <pre class="modal-pre">${esc(m.content)}</pre>
        ${m.fileName ? `<p style="margin-top:0.75rem;font-size:0.875rem">📎 Liite: ${esc(m.fileName)}</p>` : ""}
        <div class="modal-actions">
          <button class="btn-primary" style="width:auto;padding:0.5rem 1rem" data-download="${m.id}">Lataa</button>
          <button class="btn-outline" data-share="${m.id}">Jaa</button>
          <button class="btn-accent" data-edit="${m.id}">Muokkaa omaksi versioksi</button>
        </div>
      </section>
    </div>`;
}

function editorModalTemplate(initial) {
  const isCopy = Boolean(initial.content);
  return `
    <div class="modal-overlay" data-close-editor>
      <section class="modal-content">
        <button class="modal-close" data-close-editor aria-label="Sulje">✕</button>
        <form id="editor-form" style="display:flex;flex-direction:column;gap:1rem">
          <h2 style="font-size:1.875rem">${isCopy ? "Muokkaa omaksi versioksi" : "Lisää materiaali"}</h2>
          <label class="field"><span class="field-label">Otsikko</span><input class="input" id="material-title" value="${esc(initial.title || "")}" required></label>
          <div style="display:grid;gap:1rem" class="editor-selects">
            <label class="field"><span class="field-label">Aine</span><select class="select" id="material-subject">${SUBJECTS.map((s) => `<option ${initial.subject === s ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></label>
            <label class="field"><span class="field-label">Tyyppi</span><select class="select" id="material-type">${TYPES.map((t) => `<option ${initial.type === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
          </div>
          <label class="field"><span class="field-label">Lyhyt kuvaus</span><input class="input" id="material-description" value="${esc(initial.description || "")}"></label>
          <label class="field"><span class="field-label">Sisältö / työohje</span><textarea class="textarea" id="material-content" rows="7" required>${esc(initial.content || "")}</textarea></label>
          <label class="field"><span class="field-label">Liite (valinnainen)</span><input id="material-file" type="file" style="font-size:0.875rem"></label>
          <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem"><input id="material-anon" type="checkbox"> Julkaise anonyymina</label>
          <div style="display:flex;justify-content:flex-end;gap:0.5rem">
            <button type="button" class="btn-outline" data-close-editor>Peruuta</button>
            <button class="btn-primary" style="width:auto;padding:0.5rem 1.25rem" type="submit">Julkaise</button>
          </div>
        </form>
      </section>
    </div>`;
}

function bindEvents() {
  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", submitAuth);
    document.getElementById("auth-toggle").addEventListener("click", () => {
      authMode = authMode === "in" ? "up" : "in";
      render();
    });
    return;
  }

  document.getElementById("logout")?.addEventListener("click", () => {
    user = null;
    items = [...SEED];
    subject = "Kaikki";
    query = "";
    render();
  });
  document.getElementById("add-material")?.addEventListener("click", () => {
    editing = { subject: SUBJECTS[1], type: TYPES[0] };
    render();
  });
  document.getElementById("search")?.addEventListener("input", (e) => {
    query = e.target.value;
    render();
    document.getElementById("search")?.focus();
  });

  document.querySelectorAll("[data-subject]").forEach((b) => b.addEventListener("click", () => {
    subject = b.dataset.subject;
    render();
  }));
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => {
    openMaterial = getMaterial(b.dataset.open);
    render();
  }));
  document.querySelectorAll("[data-download]").forEach((b) => b.addEventListener("click", () => download(getMaterial(b.dataset.download))));
  document.querySelectorAll("[data-share]").forEach((b) => b.addEventListener("click", () => share(getMaterial(b.dataset.share))));
  document.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => {
    const m = getMaterial(b.dataset.edit);
    editing = { ...m, id: 0, title: `${m.title} (muokattu)`, author: user };
    openMaterial = null;
    render();
  }));
  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", (e) => {
    if (e.target === b || b.matches("button")) {
      openMaterial = null;
      render();
    }
  }));
  document.querySelectorAll("[data-close-editor]").forEach((b) => b.addEventListener("click", (e) => {
    if (e.target === b || b.matches("button")) {
      editing = null;
      render();
    }
  }));
  document.getElementById("editor-form")?.addEventListener("submit", submitEditor);
}

function submitAuth(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name")?.value || "";
  const err = document.getElementById("auth-error");
  if (!emailOk(email)) return showAuthError(err, "Anna kelvollinen sähköpostiosoite.");
  if (password.length < 6) return showAuthError(err, "Salasanan on oltava vähintään 6 merkkiä.");
  if (authMode === "up" && !name.trim()) return showAuthError(err, "Anna nimesi.");
  user = authMode === "up" ? name.trim() : (email.split("@")[0] || email);
  render();
}

function showAuthError(el, text) {
  el.textContent = text;
  el.hidden = false;
}

function submitEditor(e) {
  e.preventDefault();
  const title = document.getElementById("material-title").value.trim();
  const content = document.getElementById("material-content").value.trim();
  if (!title || !content) return;
  const file = document.getElementById("material-file").files[0];
  items.unshift({
    id: Date.now(),
    title,
    subject: document.getElementById("material-subject").value,
    type: document.getElementById("material-type").value,
    description: document.getElementById("material-description").value,
    content,
    fileName: file?.name,
    author: document.getElementById("material-anon").checked ? "Anonyymi" : user,
    date: new Date().toLocaleDateString("fi-FI"),
  });
  editing = null;
  render();
  flash("Materiaali julkaistu (demo)");
}

function getMaterial(id) {
  return items.find((m) => m.id === Number(id));
}

function download(m) {
  if (!m) return;
  const text = `${m.title}\n${m.subject} · ${m.type}\nTekijä: ${m.author} · ${m.date}\n\n${m.description}\n\n${m.content}\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${m.title.replace(/[^\wäöåÄÖÅ -]/g, "")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function share(m) {
  if (!m) return;
  const text = `${m.title} (${m.subject}) – Opepankki`;
  try {
    await navigator.clipboard.writeText(`${text}\n${location.href}#${m.id}`);
    flash("Linkki kopioitu leikepöydälle");
  } catch {
    flash("Jakaminen ei onnistunut");
  }
}

function flash(text) {
  document.querySelector(".toast-msg")?.remove();
  clearTimeout(toastTimer);
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = text;
  document.body.appendChild(toast);
  toastTimer = setTimeout(() => toast.remove(), 2500);
}

render();
