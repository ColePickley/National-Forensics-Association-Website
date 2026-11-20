// ---------------------------------------------------------------------------
// SUPABASE STORAGE
// All archive files live in the public bucket "Archive Files", split into three
// folders by file type:  txt/   pdf/   docx/
// ---------------------------------------------------------------------------
const SUPABASE_URL = "https://bjytsccuaftifejjpeyb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_wFNApyLi4CcWKEaf2EbkIg_nJQX7_DW";
const ARCHIVE_BUCKET = "Archive Files";
const ARCHIVE_FOLDERS = ["txt", "pdf", "docx"];

// Which folder a file belongs in, based on its extension
function folderFor(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return ARCHIVE_FOLDERS.includes(ext) ? ext : 'txt';
}

// Public link to a file, e.g. .../object/public/Archive%20Files/pdf/2017%20NFA%20COMPLETE%20RESULTS.pdf
function storageUrl(fileName, folder = folderFor(fileName)) {
    return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(ARCHIVE_BUCKET)}/${folder}/${encodeURIComponent(fileName)}`;
}

// Same link, but the browser saves it instead of opening it
// (the plain "download" attribute is ignored for files on another website)
function storageDownloadUrl(fileName, folder = folderFor(fileName)) {
    return `${storageUrl(fileName, folder)}?download=${encodeURIComponent(fileName)}`;
}

const archives = [
    {
    title: "NFA Constitution (Official Governing Document)",
    type: "Governance",
    year: "2023",
    desc: "Official Constitution of the National Forensic Association governing membership, officers, and council procedures.",
    fileName: "nfa-constitution.txt",
    url: storageUrl("nfa-constitution.txt")
    },
    {
    title: "NFA Bylaws & Tournament Procedures",
    type: "Governance",
    year: "2023",
    desc: "Complete rules on student eligibility, qualification criteria, section sizing, judge placement, and 1–30 rating scales.",
    fileName: "nfa-bylaws.txt",
    url: storageUrl("nfa-bylaws.txt")
    },
    {
    title: "12. Lincoln-Douglas Debate Event Description",
    type: "Rules",
    year: "2022",
    desc: "Official stock issues paradigm (Harms, Inherency, Solvency, Topicality), evidence verification rules, and delivery standards.",
    fileName: "ld-description.txt",
    url: storageUrl("ld-description.txt")
    },
    {
    title: "NFA Hall of Fame Inductees Archive (1971–Present)",
    type: "History",
    year: "1971–2026",
    desc: "Historical roster of Hall of Fame members and annual January 15 nomination guidelines.",
    fileName: "hall-of-fame.txt",
    url: storageUrl("hall-of-fame.txt")
    },
    {
    title: "Cultivating Success: Exploring Mentorship in Collegiate Speech & Debate",
    type: "Journal",
    year: "2026",
    desc: "By Vanessa Fowler — Published in National Forensic Journal, Volume 39 (2026).",
    fileName: "cultivating-success-fowler.txt",
    url: storageUrl("cultivating-success-fowler.txt")
    },
    {
    title: "Aligning Vision: Issues Facing Disability Accommodation in the Forensics Space",
    type: "Journal",
    year: "2026",
    desc: "By Ryan Corcoran — Special Forum on Accessibility in Collegiate Forensics, NFJ Volume 39.",
    fileName: "aligning-vision-corcoran.txt",
    url: storageUrl("aligning-vision-corcoran.txt")
    }
];

// National Tournament results, one .txt per year in the bucket's txt/ folder (e.g. txt/1971.txt)
// To add a year: upload the file to txt/ and add a row here (or just upload it and
// let the automatic list below make a plain card for it).
// [year, host school, team sweepstakes champion, pentathlon champion, optional note]
// Use null for anything a year's file doesn't have.
const NATIONALS = [
    ["1971", "Ohio Northern University", "Ohio University", "Robert Reider (Ohio University)"],
    ["1972", "Ohio Northern University", "Ball State University", "James Molnar (Ohio University)"],
    ["1973", "Eastern Michigan University", "Eastern Michigan University", "David Beal (Ohio University)"],
    ["1974", "Plattsburgh State University", "Ohio University", "Bobbi Rowe (Stetson University)"],
    ["1975", "Niagra University", "Ohio University", "Bobbi Rowe (Stetson University)"],
    ["1976", "California State University - Los Angeles", "Eastern Michigan University", "Irene Ziegler (Stetson University)"],
    ["1977", "George Mason University", "Eastern Michigan University", "Michael Garcia (Eastern Michigan University)"],
    ["1978", "Monmouth College", "Eastern Michigan University", "William Young (University of Southern California)"],
    ["1979", "UW Whitewater", "Eastern Michigan University", "George Denger (Eastern Michigan University)"],
    ["1980", "University of Montevallo", "Eastern Michigan University", "Jon Capecci (Eastern Michigan University)"],
    ["1981", "Western Kentucky University", "Eastern Michigan University", "Jon Capecci (Eastern Michigan University)"],
    ["1982", "Ohio State University", "Bradley University", "Theresa McElwee (Eastern Michigan University)"],
    ["1983", "Illinois State", "Bradley University", "Mike Jones (Eastern Michigan University)"],
    ["1984", "Georgia Southern University", "Bradley University (Open division)", "Brad Johansen (Bradley University)"],
    ["1985", "Marshall University", "Bradley University (Open division)", "John Broer (Miami University-OH)"],
    ["1986", "Bloomsburg University", "Eastern Michigan University (Open division)", "Greg Dolph (Bradley University)"],
    ["1987", "Mankato State", "Eastern Michigan University (Open division)", "Laura Duncan (Eastern Michigan University)"],
    ["1988", "Arizona State", "Bradley University (Open division)", "Brenda Dempsey (Eastern Michigan University)"],
    ["1989", "Upsala College (East Orange, NJ)", "Bradley University (Open division)", "Cam Jones (Cornell University)"],
    ["1990", "Mankato State University", "Bradley University (Open division)", "Stephanie Kaplan (University of Wisconsin-Madison)"],
    ["1991", "Marshall University", "Bradley University (Open division)", "Karon Bowers (Bradley University)"],
    ["1992", "Mankato State University", "Bradley University (Open division)", "Ronnie Stewart (Bradley University)"],
    ["1993", "Bloomsburg State University", "Bradley University (Open division)", "Jason Berke (Illinois State University)"],
    ["1994", "Western Kentucky University", "Bradley University (Open division)", "Andy Wood (Berry College)"],
    ["1995", "Eastern Michigan University", "Illinois State University (Open division)", "Jason Berke (Illinois State University)"],
    ["1996", "Western Illinois University", "Bradley University (Open division)", "August Benassi (Bradley)"],
    ["1997", "Ball State University", "Bradley University (Open division)", "Chris Grove (Illinois State University)"],
    ["1998", "Western Illinois University", "Bradley University (Open division)", "Grant Ward (Illinois State University)"],
    ["1999", "Eastern Michigan University", "Illinois State University (Open division)", "Brian Davis (Arizona State University)"],
    ["2000", "Ohio University", "Illinois State University (Open division)", "Dan Hungerman (Miami University)"],
    ["2001", "Western Kentucky University", "Bradley University (Open division)", "Steve Zammit (Cornell University)"],
    ["2002", "Berry College", "Bradley University (Open division)", null],
    ["2003", "Ball State University", "Western Kentucky University (Open division)", "Meredith Schnug (Miami University)"],
    ["2004", "Western Illinois University", "Western Kentucky University (Open division)", "John Coleman (Berry College)"],
    ["2005", "University of Akron", "Bradley University (Open division)", "Antonio Jean Moorehead (Arizona State University)"],
    ["2006", "University of Wisconsin-Eau Claire", "Western Kentucky University (Open division)", "Paul Davis (Arizona State University)"],
    ["2007", "Berry College", "Western Kentucky University (Open division)", "Kashif Powell (Morehouse College)"],
    ["2008", "Tennessee State University", "Western Kentucky University (Open division)", "Jessy Ohl (Kansas State University)"],
    ["2009", "Drury University / Missouri State University", "Western Kentucky University (Open division)", "Joele Denis (Western Kentucky University)"],
    ["2010", "Ohio University", "Western Kentucky University (Open division)", "Dan Glaser (Ohio University)"],
    ["2011", "Illinois State University", "Western Kentucky University (Open division)", "Jacoby Cochran (Bradley University)"],
    ["2012", "Ohio University", "Bradley University (Open division)", "Jacoby Cochran (Bradley University)"],
    ["2013", "Marshall University", "Bradley University (Open division)", "Kaybee Brown (Bradley University)"],
    ["2018", "University of Wisconsin Oshkosh", null, null, "Lincoln-Douglas champion: Colten White (University of Nebraska-Lincoln)"]
];

NATIONALS.forEach(([year, host, team, penta, note]) => {
    const parts = [`Hosted by ${host}.`];
    if (team) parts.push(`Team sweepstakes: ${team}.`);
    if (penta) parts.push(`Pentathlon: ${penta}.`);
    if (note) parts.push(`${note}.`);
    archives.push({
    title: `${year} National Tournament Results`,
    type: "History",
    year: year,
    desc: parts.join(' '),
    fileName: `${year}.txt`,
    url: storageUrl(`${year}.txt`)
    });
});

// PDF and Word documents (bucket folders pdf/ and docx/). Clicking opens or downloads the original.
// The search box matches their title, description and year (not the text inside the file).
const FILE_DOCS = [
    { title: "2017 Complete Tournament Results", year: "2017", kind: "pdf", file: "2017 NFA COMPLETE RESULTS.pdf",
    desc: "Full tabulation for every event: preliminary scores, elimination rounds and final placings (113 pages)." },
    { title: "2016 Complete Tournament Results", year: "2016", kind: "pdf", file: "2016 NFA COMPLETE RESULTS.pdf",
    desc: "Full tabulation for every event: preliminary scores, elimination rounds and final placings (117 pages)." },
    { title: "2015 Complete Tournament Results", year: "2015", kind: "pdf", file: "2015 NFA COMPLETE RESULTS.pdf",
    desc: "Full tabulation for every event: preliminary scores, elimination rounds and final placings (128 pages)." },
    { title: "2014 Complete Tournament Results", year: "2014", kind: "pdf", file: "2014 NFA COMPLETE RESULTS.pdf",
    desc: "Full tabulation for every event: preliminary scores, elimination rounds and final placings (214 pages)." },
    { title: "Interpretation Champions (1971–2013)", year: "1971–2013", kind: "docx", file: "NFA Interp Champions.docx",
    desc: "Year-by-year national champions in Prose, Poetry, Duo and the other interpretation events." },
    { title: "Public Address Champions (1971–2013)", year: "1971–2013", kind: "docx", file: "NFA PA champions.docx",
    desc: "Year-by-year national champions in Informative, Persuasive, After Dinner Speaking and Rhetorical Criticism." },
    { title: "Limited Prep & Lincoln-Douglas Champions (1971–2013)", year: "1971–2013", kind: "docx", file: "NFA LP Champions.docx",
    desc: "Year-by-year national champions in Extemporaneous Speaking, Impromptu and Lincoln-Douglas Debate." }
];

FILE_DOCS.forEach(d => {
    archives.push({
    title: d.title,
    type: "History",
    year: d.year,
    desc: d.desc,
    kind: d.kind,
    fileName: d.file,
    url: d.kind === 'docx' ? storageDownloadUrl(d.file) : storageUrl(d.file)
    });
});
// ---------------------------------------------------------------------------
// AUTOMATIC FILE LIST
// On page load we ask Supabase which files are in txt/, pdf/ and docx/, and show
// a card for every one of them:
//   - files described above (NATIONALS, FILE_DOCS, etc.) keep their descriptions
//   - new files get an automatic card made from their file name
//   - entries above whose file isn't in the bucket are hidden
// If the list can't be loaded, the page keeps the hand-written list above.
//
// NOTE: listing files needs a read (SELECT) policy on storage.objects for this bucket,
// even though the bucket is public. See the setup SQL in the notes that came with this file.
// ---------------------------------------------------------------------------

// Every file name in one folder of the bucket (handles buckets with more than 1000 files)
async function listBucketFolder(folder) {
    const names = [];
    const pageSize = 1000;
    for (let offset = 0; ; offset += pageSize) {
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(ARCHIVE_BUCKET)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                prefix: folder,
                limit: pageSize,
                offset,
                sortBy: { column: 'name', order: 'asc' }
            })
        });
        if (!res.ok) throw new Error(`Listing ${folder}/ failed (HTTP ${res.status})`);
        const rows = await res.json();
        rows.forEach(r => {
            // Subfolders come back with no id; "." files are Supabase placeholders
            if (r.id && r.name && !r.name.startsWith('.')) names.push(r.name);
        });
        if (rows.length < pageSize) break;
    }
    return names;
}

function autoArchiveEntry(fileName, folder) {
    const base = fileName.replace(/\.[^.]+$/, '');
    const isYearFile = /^\d{4}$/.test(base);             // e.g. 2019.txt
    const yearMatch = base.match(/(19|20)\d{2}/);        // first 4-digit year in the name
    const kind = folder === 'txt' ? undefined : folder;  // 'pdf' | 'docx'

    return {
        title: isYearFile ? `${base} National Tournament Results` : base.replace(/[-_]+/g, ' '),
        type: isYearFile ? 'History' : 'Text Archive',
        year: yearMatch ? yearMatch[0] : 'Archive',
        desc: kind ? `${kind.toUpperCase()} document from the NFA archives.` : 'Text document from the NFA archives.',
        kind,
        fileName,
        url: kind === 'docx' ? storageDownloadUrl(fileName, folder) : storageUrl(fileName, folder)
    };
}

async function loadArchiveFileList() {
    try {
        const [txt, pdf, docx] = await Promise.all(ARCHIVE_FOLDERS.map(listBucketFolder));
        if (txt.length + pdf.length + docx.length === 0) return;   // nothing came back: keep the hand-written list

        const inBucket = new Set([
            ...txt.map(f => `txt/${f.toLowerCase()}`),
            ...pdf.map(f => `pdf/${f.toLowerCase()}`),
            ...docx.map(f => `docx/${f.toLowerCase()}`)
        ]);

        // Described files that exist, in their original order...
        const described = archives.filter(a =>
            a.fileName && inBucket.has(`${folderFor(a.fileName)}/${a.fileName.toLowerCase()}`)
        );
        const describedKeys = new Set(described.map(a => `${folderFor(a.fileName)}/${a.fileName.toLowerCase()}`));

        // ...then any new files, newest year first
        const added = [
            ...txt.map(f => ['txt', f]),
            ...pdf.map(f => ['pdf', f]),
            ...docx.map(f => ['docx', f])
        ]
            .filter(([folder, f]) => !describedKeys.has(`${folder}/${f.toLowerCase()}`))
            .map(([folder, f]) => autoArchiveEntry(f, folder))
            .sort((a, b) => b.year.localeCompare(a.year) || a.title.localeCompare(b.title));

        archives.length = 0;
        archives.push(...described, ...added);
    } catch (e) {
        /* couldn't list the bucket: keep the hand-written list */
        console.warn('Archive list not loaded from Supabase; using the built-in list.', e);
    }
}
// Makes text safe to put inside the page (a .txt file could contain HTML)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Reads a file as text. The archive .txt files use the old Windows-1252
// encoding, which browsers would otherwise show as � symbols.
function decodeText(buffer) {
    try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch (e) {
    return new TextDecoder('windows-1252').decode(buffer);
    }
}

// Lowercases and treats curly apostrophes (’) like straight ones (')
function norm(str) {
    return str.toLowerCase().replace(/[\u2018\u2019]/g, "'");
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Escapes text, then wraps every match of the search in <mark>
function highlight(text, q) {
    if (!q) return escapeHTML(text);
    const pattern = escapeRegExp(norm(q)).replace(/'/g, "['\u2018\u2019]");
    return text.split(new RegExp(`(${pattern})`, 'gi'))
    .map((part, i) => i % 2 ? `<mark>${escapeHTML(part)}</mark>` : escapeHTML(part))
    .join('');
}

// A short piece of the document's text around the first match
function matchSnippet(text, q) {
    const i = norm(text).indexOf(q);
    if (i === -1) return '';
    const start = Math.max(0, text.lastIndexOf('\n', i) + 1);
    let end = text.indexOf('\n', i);
    if (end === -1) end = text.length;
    let line = text.slice(start, end).trim();
    if (line.length > 160) {
    const at = norm(line).indexOf(q);
    const from = Math.max(0, at - 60);
    line = (from > 0 ? '…' : '') + line.slice(from, from + 160) + (from + 160 < line.length ? '…' : '');
    }
    const more = (norm(text).split(q).length - 2);
    return highlight(line, q) + (more > 0 ? ` <em>(+${more} more)</em>` : '');
}

async function viewTextDoc(index) {
    const item = currentFiltered[index];
    const modal = document.getElementById('doc-modal');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');

    titleEl.textContent = item.title;
    bodyEl.textContent = "Loading text document...";
    modal.classList.add('active');

        // Shows the text with the current search highlighted, scrolled to the first match
    const showText = text => {
    const q = document.getElementById('archive-search').value.trim();
    bodyEl.innerHTML = highlight(text, q);
    bodyEl.scrollTop = 0;
    const first = bodyEl.querySelector('mark');
    if (first) first.scrollIntoView({ block: 'center' });
    };

    if (item.rawText !== undefined) {
    showText(item.rawText);
    return;
    }

    try {
    const response = await fetch(item.url);
    if (!response.ok) throw new Error(`HTTP ${response.status} - File not found at ${item.url}`);
    const text = decodeText(await response.arrayBuffer());
    item.rawText = text;
    showText(text);
    } catch (err) {
    bodyEl.textContent = `Could not auto-fetch "${item.url}".\n\nTip: Make sure the file exists in the "txt" folder of the "${ARCHIVE_BUCKET}" Supabase bucket.\n\nDetails: ${err.message}`;
    }
}

function closeModal() {
    document.getElementById('doc-modal').classList.remove('active');
}

let currentFiltered = [];

    function renderArchives() {
    const q = norm(document.getElementById('archive-search').value.trim());
    const type = document.getElementById('archive-type').value;
    const container = document.getElementById('archive-container');

    currentFiltered = archives.filter(a =>
    (type === 'all' || a.type === type) &&
    (
        norm(a.title).includes(q) ||
        norm(a.desc).includes(q) ||
        norm(a.year).includes(q) ||
        (a.rawText && norm(a.rawText).includes(q))
    )
    );

    document.getElementById('result-count').textContent =
    `Showing ${currentFiltered.length} of ${archives.length} records`;

    if (currentFiltered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; color: var(--slate);">No matching archive documents found for "<strong>${escapeHTML(q)}</strong>".</p>`;
    return;
    }

    container.innerHTML = currentFiltered.map((a, idx) => {
    // If the search word is only inside the file, show the line where it was found
    const inCard = !q || norm(a.title).includes(q) || norm(a.desc).includes(q) || norm(a.year).includes(q);
    const snippet = (!inCard && a.rawText) ? matchSnippet(a.rawText, q) : '';
    const btn = 'padding: 0.55rem 1rem; font-size: 0.85rem;';
    const url = escapeHTML(a.url);

    // PDFs open in a new tab, Word files download, .txt files open in the viewer
    let actions;
    if (a.kind === 'pdf') {
        actions = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-gold" style="${btn}">Open PDF →</a>`;
    } else if (a.kind === 'docx') {
        actions = `<a href="${url}" download class="btn-gold" style="${btn}">Download Word Doc ↓</a>`;
    } else {
        actions = `
        <button type="button" onclick="viewTextDoc(${idx})" class="btn-gold" style="${btn}">Read Text Doc</button>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-outline-light" style="${btn}">Open Raw .txt →</a>`;
    }
    const fileTag = a.kind ? ` • ${a.kind.toUpperCase()}` : '';

    return `
    <article class="card">
        <div>
        <span class="badge">${escapeHTML(a.type)} • ${escapeHTML(a.year)}${fileTag}</span>
        <h3>${highlight(a.title, q)}</h3>
        <p>${highlight(a.desc, q)}</p>
        ${snippet ? `<div class="match-snippet">Found in ${a.kind ? 'file' : 'text'}: ${snippet}</div>` : ''}
        </div>
        <div class="card-actions">${actions}
        </div>
    </article>`;
    }).join('');
}

    // Close the text viewer with the Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// Show the cards right away, then load every file in the background
// so searching covers the full text of each document
window.addEventListener('DOMContentLoaded', async () => {
    await loadArchiveFileList();   // use the automatic file list if there is one
    renderArchives();
    await Promise.all(archives.map(async a => {
    if (a.rawText !== undefined) return;
    if (a.kind) return;           // PDF/Word files: searched by title/description only
    const source = a.url;
    try {
        const res = await fetch(source);
        if (res.ok) a.rawText = decodeText(await res.arrayBuffer());
    } catch (e) { /* missing file or opened from file:// */ }
    }));
    renderArchives();
});