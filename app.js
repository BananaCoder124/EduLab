// EduLab - Materiaalipankki opettajille
const SUBJECTS = [
  "Matematiikka",
  "Fysiikka",
  "Kemia",
  "Biologia",
  "Maantiede (maantieto)",
  "Ympäristöoppi (varhaiskasvatuksessa ja alakoulussa)",
  "Tietotekniikka ja teknologia"
];

const TYPES = [
  "Työohje",
  "Laboratoriotyö",
  "Projekti-idea",
  "Opetusvinkki",
  "Tehtäväpaketti"
];

const INITIAL_MATERIALS = [
  {
    id: 1,
    title: "Heilurin jaksonaika ja putoamiskiihtyvyys",
    subject: "Fysiikka",
    type: "Laboratoriotyö",
    author: "Anna Virtanen",
    date: "12.9.2026",
    description: "Testattu FY1-kurssilla. Oppilaat määrittävät g:n heilurin avulla.",
    content: "Välineet: naru, punnus, sekuntikello, mittanauha.\n\n1. Mittaa narun pituus L.\n2. Mittaa 10 heilahduksen aika ja laske T.\n3. Toista viidellä pituudella.\n4. Piirrä T² L:n funktiona, kulmakerroin = 4π²/g.\n\nVinkki: pidä heilahduskulma alle 10°."
  },
  {
    id: 2,
    title: "Ohmin laki – virtapiirityöpiste",
    subject: "Fysiikka",
    type: "Työohje",
    author: "Anonyymi",
    date: "3.10.2026",
    description: "Valmis 45 min työpiste, toimii myös etäopetuksessa simulaatiolla.",
    content: "Kytke vastus, virtamittari ja jännitelähde sarjaan. Mittaa U ja I viidellä jännitteellä. Määritä resistanssi kuvaajasta."
  },
  {
    id: 3,
    title: "Vapaan pudotuksen videoanalyysi",
    subject: "Fysiikka",
    type: "Projekti-idea",
    author: "Mikko Laine",
    date: "20.8.2026",
    description: "Oppilaat kuvaavat puhelimella ja analysoivat Trackerilla.",
    content: "Ryhmät kuvaavat pallon pudotuksen 240 fps. Analyysi Tracker-ohjelmalla, raportti 2 sivua."
  },
  {
    id: 4,
    title: "Titraus: etikan happopitoisuus",
    subject: "Kemia",
    type: "Laboratoriotyö",
    author: "Liisa Mäkinen",
    date: "1.9.2026",
    description: "KE2-kurssin klassikko turvallisesti kotitalousetikalla.",
    content: "Titraa 10 ml laimennettua etikkaa 0,1 M NaOH:lla fenoliftaleiini-indikaattorilla."
  },
  {
    id: 5,
    title: "Derivaatan tutkiva aloitus GeoGebralla",
    subject: "Matematiikka",
    type: "Opetusvinkki",
    author: "Anonyymi",
    date: "15.9.2026",
    description: "Sekanttien kautta tangenttiin – 20 min aloitustehtävä.",
    content: "Avaa GeoGebra, piirrä f(x)=x², liu'uta pistettä h→0 ja tarkastele sekantin kulmakerrointa."
  },
  {
    id: 6,
    title: "Solun osmoosi perunalla",
    subject: "Biologia",
    type: "Laboratoriotyö",
    author: "Jussi Korhonen",
    date: "28.9.2026",
    description: "Edullinen ja varma työ BI1-kurssille.",
    content: "Perunapalat eri suolaliuoksiin 30 min, punnitse ennen ja jälkeen, piirrä massamuutos pitoisuuden funktiona."
  },
  {
    id: 7,
    title: "Paikallisen pohjaveden kartoitus",
    subject: "Maantiede (maantieto)",
    type: "Projekti-idea",
    author: "Sari Heikkinen",
    date: "5.10.2026",
    description: "Paikkatietoprojekti Maanmittauslaitoksen aineistoilla.",
    content: "Oppilaat hakevat pohjavesialueet karttapalvelusta ja tekevät riskikartan omasta kunnasta."
  },
  {
    id: 8,
    title: "Vuodenajat pihalla – havaintopäiväkirja",
    subject: "Ympäristöoppi (varhaiskasvatuksessa ja alakoulussa)",
    type: "Tehtäväpaketti",
    author: "Anonyymi",
    date: "10.10.2026",
    description: "Kuvallinen havaintovihko 1.–2. luokalle.",
    content: "Kerran viikossa sama puu: piirrä, mittaa lämpötila, kirjaa linnut."
  },
  {
    id: 9,
    title: "Micro:bit-sääasema",
    subject: "Tietotekniikka ja teknologia",
    type: "Projekti-idea",
    author: "Pekka Nieminen",
    date: "18.9.2026",
    description: "Ohjelmoidaan lämpötila- ja valoanturi, data taulukkoon.",
    content: "MakeCode-koodi mittaa 10 min välein, data siirretään taulukkolaskentaan ja analysoidaan."
  }
];

// Sovelluksen tila
let materials = [...INITIAL_MATERIALS];
let currentUser = null;
let currentSubject = "Kaikki";
let searchQuery = "";
let activeModalMaterial = null;
let isSignUpMode = false;
let pendingFileName = null;

// DOM-elementit
const authView = document.getElementById("authView");
const appView = document.getElementById("appView");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const nameField = document.getElementById("nameField");
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const inputPw = document.getElementById("inputPw");
const authError = document.getElementById("authError");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const toggleQuestion = document.getElementById("toggleQuestion");

const userGreeting = document.getElementById("userGreeting");
const logoutBtn = document.getElementById("logoutBtn");
const addMaterialBtn = document.getElementById("addMaterialBtn");
const searchInput = document.getElementById("searchInput");
const subjectChips = document.getElementById("subjectChips");
const cardGrid = document.getElementById("cardGrid");
const emptyState = document.getElementById("emptyState");

const detailModal = document.getElementById("detailModal");
const detailMeta = document.getElementById("detailMeta");
const detailTitle = document.getElementById("detailTitle");
const detailAuthor = document.getElementById("detailAuthor");
const detailDesc = document.getElementById("detailDesc");
const detailContent = document.getElementById("detailContent");
const detailAttachment = document.getElementById("detailAttachment");
const detailDownloadBtn = document.getElementById("detailDownloadBtn");
const detailShareBtn = document.getElementById("detailShareBtn");
const detailEditBtn = document.getElementById("detailEditBtn");
const detailCloseBtn = document.getElementById("detailCloseBtn");

const editorModal = document.getElementById("editorModal");
const editorForm = document.getElementById("editorForm");
const editorTitle = document.getElementById("editorTitle");
const editTitle = document.getElementById("editTitle");
const editSubject = document.getElementById("editSubject");
const editType = document.getElementById("editType");
const editDesc = document.getElementById("editDesc");
const editContent = document.getElementById("editContent");
const editFile = document.getElementById("editFile");
const fileNameLabel = document.getElementById("fileNameLabel");
const editAuthor = document.getElementById("editAuthor");
const editorCancelBtn = document.getElementById("editorCancelBtn");

const toast = document.getElementById("toast");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// KIRJAUTUMISEN TILA
toggleModeBtn.addEventListener("click", () => {
  isSignUpMode = !isSignUpMode;
  authError.classList.add("hidden");

  if (isSignUpMode) {
    authTitle.textContent = "Luo tili";
    authSubmitBtn.textContent = "Rekisteröidy";
    toggleQuestion.textContent = "Onko sinulla jo tili? ";
    toggleModeBtn.textContent = "Kirjaudu";
    nameField.classList.remove("hidden");
  } else {
    authTitle.textContent = "Kirjaudu sisään";
    authSubmitBtn.textContent = "Kirjaudu";
    toggleQuestion.textContent = "Eikö sinulla ole tiliä? ";
    toggleModeBtn.textContent = "Rekisteröidy";
    nameField.classList.add("hidden");
  }
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = inputEmail.value.trim();
  const pw = inputPw.value;
  const name = inputName.value.trim();

  if (!isValidEmail(email)) {
    authError.textContent = "Anna kelvollinen sähköpostiosoite.";
    authError.classList.remove("hidden");
    return;
  }

  if (pw.length < 6) {
    authError.textContent = "Salasanan on oltava vähintään 6 merkkiä.";
    authError.classList.remove("hidden");
    return;
  }

  if (isSignUpMode && !name) {
    authError.textContent = "Anna nimesi.";
    authError.classList.remove("hidden");
    return;
  }

  authError.classList.add("hidden");
  currentUser = isSignUpMode ? name : (email.split("@")[0] || email);
  loginSuccess();
});

function loginSuccess() {
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
  userGreeting.textContent = `Hei, ${currentUser}`;
  renderSubjectChips();
  populateDropdowns();
  renderCards();
}

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  authView.classList.remove("hidden");
  appView.classList.add("hidden");
  inputPw.value = "";
});

// AINEVALINTANAPIT
function renderSubjectChips() {
  subjectChips.innerHTML = "";
  const allSubjects = ["Kaikki", ...SUBJECTS];

  allSubjects.forEach((sub) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip ${sub === currentSubject ? "active" : ""}`;
    btn.textContent = sub;
    btn.addEventListener("click", () => {
      currentSubject = sub;
      renderSubjectChips();
      renderCards();
    });
    subjectChips.appendChild(btn);
  });
}

function populateDropdowns() {
  editSubject.innerHTML = SUBJECTS.map((s) => `<option value="${s}">${s}</option>`).join("");
  editType.innerHTML = TYPES.map((t) => `<option value="${t}">${t}</option>`).join("");
}

// HAKU & KORTTIEN NÄYTTÖ
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderCards();
});

function renderCards() {
  const filtered = materials.filter((m) => {
    const matchesSubject = currentSubject === "Kaikki" || m.subject === currentSubject;
    const hay = [m.title, m.description, m.content, m.type, m.author, m.subject].join(" ").toLowerCase();
    const matchesQuery = !searchQuery || hay.includes(searchQuery);
    return matchesSubject && matchesQuery;
  });

  cardGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";
    const shortSubject = m.subject.split(" (")[0];

    card.innerHTML = `
      <div class="card-tags">
        <span class="tag-subject">${escapeHtml(shortSubject)}</span>
        <span class="tag-type">${escapeHtml(m.type)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(m.title)}</h3>
      <p class="card-desc">${escapeHtml(m.description)}</p>
      <p class="card-meta">${escapeHtml(m.author)} · ${escapeHtml(m.date)}</p>
      <div class="card-actions">
        <button class="btn btn-primary open-btn">Avaa</button>
        <button class="btn btn-outline download-btn">Lataa</button>
        <button class="btn btn-outline share-btn">Jaa</button>
      </div>
    `;

    card.querySelector(".open-btn").addEventListener("click", () => openDetailModal(m));
    card.querySelector(".download-btn").addEventListener("click", () => downloadMaterial(m));
    card.querySelector(".share-btn").addEventListener("click", () => shareMaterial(m));

    cardGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// LATAA TIEDOSTONA
function downloadMaterial(m) {
  const text = `${m.title}\n${m.subject} · ${m.type}\nTekijä: ${m.author} · ${m.date}\n\nKuvaus:\n${m.description}\n\nSisältö:\n${m.content}\n`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${m.title.replace(/[^\wäöåÄÖÅ -]/g, "") || "materiaali"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// JAA
async function shareMaterial(m) {
  const text = `${m.title} (${m.subject}) – EduLab`;
  try {
    await navigator.clipboard.writeText(`${text}\n${window.location.href}#${m.id}`);
    showToast("Linkki kopioitu leikepöydälle");
  } catch (err) {
    showToast("Jakaminen ei onnistunut");
  }
}

// TIETOIKKUNA
function openDetailModal(m) {
  activeModalMaterial = m;
  detailMeta.textContent = `${m.subject} · ${m.type}`;
  detailTitle.textContent = m.title;
  detailAuthor.textContent = `${m.author} · ${m.date}`;
  detailDesc.textContent = m.description;
  detailContent.textContent = m.content;

  if (m.fileName) {
    detailAttachment.textContent = `📎 Liite: ${m.fileName}`;
    detailAttachment.classList.remove("hidden");
  } else {
    detailAttachment.classList.add("hidden");
  }

  detailModal.classList.remove("hidden");
}

detailCloseBtn.addEventListener("click", () => detailModal.classList.add("hidden"));
detailDownloadBtn.addEventListener("click", () => activeModalMaterial && downloadMaterial(activeModalMaterial));
detailShareBtn.addEventListener("click", () => activeModalMaterial && shareMaterial(activeModalMaterial));

detailEditBtn.addEventListener("click", () => {
  if (!activeModalMaterial) return;
  const copy = { ...activeModalMaterial };
  detailModal.classList.add("hidden");
  openEditor({
    title: `${copy.title} (muokattu)`,
    subject: copy.subject,
    type: copy.type,
    description: copy.description,
    content: copy.content,
    author: currentUser
  });
});

// LISÄÄ / MUOKKAA -IKKUNA
addMaterialBtn.addEventListener("click", () => {
  openEditor({
    title: "",
    subject: SUBJECTS[1],
    type: TYPES[0],
    description: "",
    content: "",
    author: currentUser
  });
});

function openEditor(data) {
  editorTitle.textContent = data.title ? "Muokkaa materiaalia" : "Lisää uusi materiaali";
  editTitle.value = data.title || "";
  editSubject.value = data.subject || SUBJECTS[0];
  editType.value = data.type || TYPES[0];
  editDesc.value = data.description || "";
  editContent.value = data.content || "";
  editAuthor.value = data.author || currentUser || "Anonyymi";
  editFile.value = "";
  pendingFileName = null;
  fileNameLabel.textContent = "Klikkaa ja valitse tiedosto";
  editorModal.classList.remove("hidden");
}

editFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    pendingFileName = file.name;
    fileNameLabel.textContent = `Valittu: ${file.name}`;
  } else {
    pendingFileName = null;
    fileNameLabel.textContent = "Klikkaa ja valitse tiedosto";
  }
});

editorCancelBtn.addEventListener("click", () => editorModal.classList.add("hidden"));

editorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new Date();
  const dateStr = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

  const newMat = {
    id: Date.now(),
    title: editTitle.value.trim(),
    subject: editSubject.value,
    type: editType.value,
    description: editDesc.value.trim(),
    content: editContent.value.trim(),
    author: editAuthor.value.trim() || "Anonyymi",
    date: dateStr,
    fileName: pendingFileName || undefined
  };

  materials.unshift(newMat);
  editorModal.classList.add("hidden");
  renderCards();
  showToast("Materiaali julkaistu (demo)");
});
