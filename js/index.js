// Sanitize user-entered strings before rendering into DOM
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Structured details for the 3 Featured Homepage Cards
const featureDetails = {
    ballot: {
    badge: "Governance & E-Ballot Procedures",
    title: "NFA May Ballot & Tournament E-Ballot Guide",
    url: "ballot.html",
    html: `
        <p>Each member institution's designated voting delegate casts the official electronic ballot covering NFA leadership, committee representation, and Lincoln-Douglas policy debate topic selection:</p>
        <ul>
        <li><strong>National Council Elections:</strong> Vice President for Tournament Administration, At-Large Council Representatives, and Graduate Student Representative.</li>
        <li><strong>Lincoln-Douglas Debate Committee:</strong> Selection of committee representatives and annual LD resolution balloting.</li>
        <li><strong>Tournament E-Ballots (SpeechWire):</strong> Judges must register a valid email at <em>live.speechwire.com</em>, bring a charged device to rounds, click "Start" upon entering the room, and submit ranks immediately after each round.</li>
        </ul>
    `
    },
    nca: {
    badge: "Nov 19–22, 2026 • New Orleans, LA",
    title: "NFA at NCA 2026 in New Orleans",
    url: "https://nationalforensicassociation.org/",
    html: `
        <p>The National Forensic Association convenes annually alongside the National Communication Association (NCA) 112th Annual Convention, hosted in New Orleans from <strong>November 19–22, 2026</strong> (Theme: <em>Move/ments in Communication</em>).</p>
        <ul>
        <li><strong>NFA General Business Meeting:</strong> Review mid-year tournament logistics, committee reports, and constitutional or bylaw proposals.</li>
        <li><strong>Sponsored Academic Panels:</strong> Competitive paper sessions and roundtables exploring forensic pedagogy, argumentation, and tournament wellness.</li>
        <li><strong>Graduate &amp; Director Networking:</strong> Connect with forensic educators, graduate assistants, and <em>National Forensic Journal</em> editorial leadership.</li>
        </ul>
    `
    },
    survey: {
    badge: "NFA Equity, Diversity & Inclusion Committee",
    title: "Equity and Inclusion Audit Survey",
    url: "https://nationalforensicassociation.org/2025-equity-and-inclusion-audit-survey/",
    html: `
        <p>On behalf of the NFA Equity, Diversity, and Inclusion (EDI) Committee, all undergraduate competitors, graduate assistants, coaches, and judges are encouraged to share their experiences in the <strong>Equity and Inclusion Audit Survey</strong>.</p>
        <ul>
        <li><strong>Estimated Time:</strong> Approximately 10 minutes to complete.</li>
        <li><strong>Four Core Sections:</strong> (1) Demographics, (2) Perceptions in Brief, (3) Agreement Scales, and (4) Open-Ended Recommendations.</li>
        <li><strong>Purpose:</strong> Aggregate findings guide NFA Council policy, tournament accessibility resources, judge training, and competitor wellness initiatives.</li>
        </ul>
    `
    }
};

function openInfoModal(key) {
    const item = featureDetails[key];
    if (!item) return;
    document.getElementById('info-modal-badge').textContent = item.badge;
    document.getElementById('info-modal-title').textContent = item.title;
    document.getElementById('info-modal-body').innerHTML = item.html;
    document.getElementById('info-modal-link').href = item.url;
    document.getElementById('info-modal').classList.add('open');
}

function closeInfoModal() {
    document.getElementById('info-modal').classList.remove('open');
}



// Initial data for Searchable Archives based on actual NFA documents & NFJ Vol. 39
const archives = [
    { title: "NFA Constitution (Official Governing Document)", type: "Governance", year: "2023", desc: "Official Constitution of the National Forensic Association governing membership, officers, and council procedures.", url: "https://nationalforensicassociation.org/about-nfa/" },
    { title: "NFA Bylaws & Competition Rules", type: "Rules", year: "2023", desc: "Complete Individual Events and Lincoln-Douglas Debate rules, qualification criteria, and tabulation standards.", url: "https://nationalforensicassociation.org/about-nfa/" },
    { title: "Election Procedures for NFA Council Positions", type: "Governance", year: "2021", desc: "Official online balloting, delegate voting, and run-off election guidelines for National Council officers.", url: "https://nationalforensicassociation.org/wp-content/uploads/2021/12/election-procedures-for-nfa-council-positions.pdf" }
];

function switchTab(tabName) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetSection = document.getElementById(`tab-${tabName}`) || document.getElementById('tab-home');
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`) || document.querySelector('.tab-btn[data-tab="home"]');

    targetSection.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');

    // Keep URL parameter synced with index.html convention
    const url = new URL(window.location);
    url.searchParams.set('tab', tabName);
    window.history.replaceState({}, '', url);
}

function renderThreads() {
    const q = document.getElementById('board-search').value.toLowerCase();
    const cat = document.getElementById('board-category').value;
    const container = document.getElementById('thread-container');

    const filtered = threads.filter(t =>
    (cat === 'all' || t.category === cat) &&
    (t.title.toLowerCase().includes(q) || t.author.toLowerCase().includes(q))
    );

    container.innerHTML = filtered.map(t => `
    <div class="thread-item">
        <div>
        <span class="badge" style="margin-bottom: 0.35rem;">${escapeHTML(t.category)}</span>
        <h3 style="font-size: 1.1rem;">${escapeHTML(t.title)}</h3>
        <div class="thread-meta">Posted by <strong>${escapeHTML(t.author)}</strong> • ${escapeHTML(t.date)}</div>
        </div>
        <div style="text-align: right;">
        <span class="btn-outline-light" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;">${Number(t.replies)} Replies →</span>
        </div>
    </div>
    `).join('');
}

function toggleModal(show) {
    document.getElementById('post-modal').classList.toggle('open', show);
}

function addThread() {
    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-cat').value;
    const author = document.getElementById('post-author').value.trim() || "NFA Member";
    if (!title) return;

    threads.unshift({ title, category, author, date: "Just now", replies: 0 });
    document.getElementById('post-title').value = '';
    toggleModal(false);
    renderThreads();
}

function renderArchives() {
    const q = document.getElementById('archive-search').value.toLowerCase();
    const type = document.getElementById('archive-type').value;
    const container = document.getElementById('archive-container');

    const filtered = archives.filter(a =>
    (type === 'all' || a.type === type) &&
    (a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.year.toLowerCase().includes(q))
    );

    container.innerHTML = filtered.map(a => `
    <article class="card">
        <div>
        <span class="badge">${escapeHTML(a.type)} • ${escapeHTML(a.year)}</span>
        <h3>${escapeHTML(a.title)}</h3>
        <p>${escapeHTML(a.desc)}</p>
        </div>
        <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="btn-outline-light">Open Document / Record →</a>
    </article>
    `).join('');
}

// Read ?tab= parameter from index.html on load
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || 'home';
    switchTab(initialTab);
    renderThreads();
    renderArchives();
});