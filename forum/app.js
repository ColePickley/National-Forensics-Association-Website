const SUPABASE_URL = "https://bjytsccuaftifejjpeyb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_wFNApyLi4CcWKEaf2EbkIg_nJQX7_DW";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = (id) => document.getElementById(id);

const state = {
  user: null,
  profile: null,
  threads: [],
  current: null,
  signUp: false,
  loadedFor: null,
};

/*
User Authorization and Authentication
*/

function setAuthMode(signUp) {
  state.signUp = signUp;
  $("auth-title").textContent = signUp ? "Create account" : "Sign in";
  $("auth-submit").textContent = signUp ? "Sign up" : "Sign in";
  $("auth-toggle").textContent = signUp ? "Have an account? Sign in" : "Need an account? Sign up";
  $("name-field").hidden = !signUp;
  $("phone-field").hidden = !signUp;
  $("auth-name").required = signUp;
  $("auth-password").autocomplete = signUp ? "new-password" : "current-password";
  $("auth-msg").textContent = "";
}

$("auth-toggle").addEventListener("click", () => setAuthMode(!state.signUp));

$("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("auth-msg");
  msg.className = "msg";
  msg.textContent = "";
  const email = $("auth-email").value.trim();
  const password = $("auth-password").value;
  $("auth-submit").disabled = true;

  try {
    if (state.signUp) {
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: $("auth-name").value.trim(),
            phone: $("auth-phone").value.trim() || null,
          },
        },
      });
      if (error) throw error;
      if (!data.session) {
        // Email confirmation is on in Supabase; the profile row is created at first sign-in.
        msg.className = "msg ok";
        msg.textContent = "Check your email to confirm your account, then sign in.";
        setAuthMode(false);
        $("auth-msg").className = "msg ok";
        $("auth-msg").textContent = "Check your email to confirm your account, then sign in.";
      }
    } else {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  } catch (err) {
    msg.textContent = err.message;
  } finally {
    $("auth-submit").disabled = false;
  }
});

$("signout").addEventListener("click", () => db.auth.signOut());

// Ensure a row exists in public.user for this auth user.
async function ensureProfile(user) {
  const { data, error } = await db
    .from("user")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;

  const meta = user.user_metadata || {};
  const row = {
    user_id: user.id,
    email: user.email,
    name: meta.name || user.email.split("@")[0],
    phone_number: meta.phone || null,
  };
  const { data: created, error: insErr } = await db
    .from("user")
    .insert(row)
    .select()
    .single();
  if (insErr) throw insErr;
  return created;
}

async function handleSession(session) {
  if (!session) {
    state.user = null;
    state.profile = null;
    state.current = null;
    state.loadedFor = null;
    $("app").hidden = true;
    $("auth").hidden = false;
    return;
  }
  if (state.loadedFor === session.user.id) return; // token refresh, nothing to redo
  state.loadedFor = session.user.id;
  state.user = session.user;

  try {
    state.profile = await ensureProfile(session.user);
  } catch (err) {
    state.loadedFor = null;
    $("auth-msg").className = "msg";
    $("auth-msg").textContent = "Could not load your profile: " + err.message;
    $("app").hidden = true;
    $("auth").hidden = false;
    return;
  }

  $("auth").hidden = true;
  $("app").hidden = false;
  $("whoami").textContent = state.profile.name;
  await loadThreads();
}

db.auth.onAuthStateChange((_event, session) => {
  // Defer so we never await Supabase calls inside the auth callback.
  setTimeout(() => handleSession(session), 0);
});

/*
Forum Thread Management
*/

async function loadThreads() {
  const { data, error } = await db
    .from("thread")
    .select("name, description")
    .order("name", { ascending: true });
  if (error) {
    $("thread-list").textContent = "Could not load threads: " + error.message;
    return;
  }
  // Case-insensitive alphabetical order (the database sorts by collation).
  state.threads = data.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
  renderThreads();
}

function renderThreads() {
  const list = $("thread-list");
  list.replaceChildren();
  if (!state.threads.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No threads yet.";
    list.append(p);
    return;
  }
  for (const t of state.threads) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "thread-btn";
    b.textContent = t.name;
    b.title = t.name;
    b.setAttribute("aria-current", String(t.name === state.current));
    b.addEventListener("click", () => selectThread(t.name));
    list.append(b);
  }
}

async function selectThread(name) {
  state.current = name;
  const t = state.threads.find((x) => x.name === name);
  $("thread-title").textContent = name;
  $("thread-desc").textContent = t ? t.description : "";
  $("sidebar").classList.remove("open");
  for (const id of ["post-subject", "post-text", "post-submit"]) $(id).disabled = false;
  renderThreads();
  await loadPosts(true);
}

/*
Forum Post Management
*/

async function loadPosts(scrollToEnd = false) {
  const name = state.current;
  const { data, error } = await db
    .from("post")
    .select("post_id, created_at, subject, text, thread_name, user_id, is_edited, edit_time, user(name)")
    .eq("thread_name", name)
    .order("created_at", { ascending: true });
  if (name !== state.current) return; // user switched threads mid-request

  const box = $("posts");
  box.replaceChildren();
  if (error) {
    box.append(emptyMsg("Could not load posts: " + error.message));
    return;
  }
  if (!data.length) {
    box.append(emptyMsg("No posts in this thread yet. Start the conversation below."));
    return;
  }
  for (const p of data) box.append(renderPost(p));
  if (scrollToEnd) box.scrollTop = box.scrollHeight;
}

function emptyMsg(text) {
  const p = document.createElement("p");
  p.className = "empty";
  p.textContent = text;
  return p;
}

function fmt(ts) {
  return new Date(ts).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function renderPost(p) {
  const el = document.createElement("article");
  el.className = "post";

  const h = document.createElement("h3");
  h.textContent = p.subject;

  const meta = document.createElement("div");
  meta.className = "post-meta";
  const author = p.user?.name || "Unknown user";
  meta.textContent = `${author} on ${fmt(p.created_at)}`;
  if (p.is_edited && p.edit_time) meta.textContent += ` (edited ${fmt(p.edit_time)})`;

  const body = document.createElement("p");
  body.className = "post-text";
  body.textContent = p.text;

  el.append(h, meta, body);

  const mine = p.user_id === state.user.id;
  if (mine || state.profile.is_admin) {
    const actions = document.createElement("div");
    actions.className = "post-actions";
    if (mine) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "link";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => startEdit(p, el, body, actions));
      actions.append(edit);
    }
    const del = document.createElement("button");
    del.type = "button";
    del.className = "link danger";
    del.textContent = "Delete";
    del.addEventListener("click", () => deletePost(p));
    actions.append(del);
    el.append(actions);
  }
  return el;
}

function startEdit(p, el, body, actions) {
  const box = document.createElement("div");
  box.className = "edit-box";
  const ta = document.createElement("textarea");
  ta.rows = 4;
  ta.value = p.text;
  const row = document.createElement("div");
  row.className = "row";
  const save = document.createElement("button");
  save.type = "button";
  save.className = "primary";
  save.textContent = "Save changes";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "link";
  cancel.textContent = "Cancel";
  const err = document.createElement("span");
  err.className = "msg";
  row.append(save, cancel, err);
  box.append(ta, row);

  body.replaceWith(box);
  actions.hidden = true;
  ta.focus();

  cancel.addEventListener("click", () => {
    box.replaceWith(body);
    actions.hidden = false;
  });
  save.addEventListener("click", async () => {
    const text = ta.value.trim();
    if (!text) return;
    save.disabled = true;
    const { error } = await db
      .from("post")
      .update({ text, is_edited: true, edit_time: new Date().toISOString() })
      .eq("post_id", p.post_id);
    if (error) {
      err.textContent = error.message;
      save.disabled = false;
      return;
    }
    loadPosts();
  });
}

async function deletePost(p) {
  if (!confirm("Delete this post? This can't be undone.")) return;
  const { error } = await db.from("post").delete().eq("post_id", p.post_id);
  if (error) {
    alert("Could not delete the post: " + error.message);
    return;
  }
  loadPosts();
}

/* ---------------- Composer ---------------- */

$("composer").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!state.current) return;
  const subject = $("post-subject").value.trim();
  const text = $("post-text").value.trim();
  const msg = $("composer-msg");
  msg.textContent = "";
  if (!subject || !text) return;

  $("post-submit").disabled = true;
  const { error } = await db.from("post").insert({
    subject,
    text,
    thread_name: state.current,
    user_id: state.user.id,
  });
  $("post-submit").disabled = false;

  if (error) {
    msg.textContent = "Could not post: " + error.message;
    return;
  }
  $("post-subject").value = "";
  $("post-text").value = "";
  await loadPosts(true);
});

// Ctrl/Cmd + Enter sends from the text box
$("post-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) $("composer").requestSubmit();
});

/* ---------------- Mobile sidebar ---------------- */

$("menu-btn").addEventListener("click", () => $("sidebar").classList.toggle("open"));
