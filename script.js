// ================================================
//  SkillTracker — script.js
//  Supabase backend + full frontend logic
// ================================================

/* ─── STATE ─────────────────────────────────── */
let ST = {
  user:     null,   // supabase user object
  profile:  null,   // row from public.profiles
  skills:   [],
  progress: [],
  curPage:  'landing'
};

let chartInst = null;  // Chart.js instance

/* ─── INIT ──────────────────────────────────── */
window.addEventListener('load', async () => {
  // Intro animation
  setTimeout(() => document.getElementById('intro').classList.add('intro-exit'), 2980);
  setTimeout(async () => {
    document.getElementById('intro').style.display = 'none';

    // Check existing Supabase session
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      ST.user = session.user;
      await loadAllData();
      goPage('dashboard');
    } else {
      goPage('landing');
    }
  }, 1500);

  // Listen for auth changes (e.g. logout in another tab)
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      ST = { user:null, profile:null, skills:[], progress:[], curPage:'landing' };
      goPage('landing');
    }
  });

  // Initialize scroll animations
  initScrollAnimations();
  initScrollProgress();
  initParallaxEffects();
});

/* ─── SCROLL PROGRESS INDICATOR ────────────── */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  }

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress(); // Initial call
}

/* ─── PARALLAX EFFECTS ─────────────────────── */
function initParallaxEffects() {
  const blobs = document.querySelectorAll('.hero-blob');

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    blobs.forEach((blob, index) => {
      const speed = (index + 1) * 0.1;
      blob.style.transform = `translateY(${rate * speed}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax);
}

/* ─── SCROLL ANIMATIONS ─────────────────────── */

/* ─── SCROLL ANIMATIONS ─────────────────────── */
function initScrollAnimations() {
  // Create Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all sections and elements that should animate on scroll
  const animateElements = document.querySelectorAll('.feat-sec, .how-sec, .cta-sec, .lnd-footer, .feat-card, .how-card, .sec-head');
  animateElements.forEach(el => {
    observer.observe(el);
  });

  // Special handling for feature cards with staggered animation
  const featureCards = document.querySelectorAll('.feat-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
  });

  // Special handling for how cards
  const howCards = document.querySelectorAll('.how-card');
  howCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.3}s`;
  });

  // Trigger animations for elements already in view on page load
  setTimeout(() => {
    const allElements = document.querySelectorAll('.feat-sec, .how-sec, .cta-sec, .lnd-footer, .feat-card, .how-card, .sec-head');
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('animate-in');
      }
    });
  }, 100);
}

/* ─── PAGE ROUTER ───────────────────────────── */

/* ─── PAGE ROUTER ───────────────────────────── */
const DASH_PAGES = ['dashboard','skills','add-skill','log','charts','community','profile'];
const PAGE_TITLES = {
  dashboard:'Dashboard', skills:'My Skills', 'add-skill':'Add Skill',
  log:'Log Session', charts:'Progress Charts', community:'Community', profile:'Profile'
};

function goPage(name) {
  if (DASH_PAGES.includes(name) && !ST.user) { _showTop('login'); return; }

  if (DASH_PAGES.includes(name)) {
    _showTop('dash');
    document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');

    const panelId = 'panel-' + (name === 'add-skill' ? 'add-skill' : name);
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'block';

    document.querySelectorAll('.sb-item').forEach(el =>
      el.classList.toggle('active', el.dataset.p === name));

    const t = document.getElementById('dh-title');
    if (t) t.textContent = PAGE_TITLES[name] || name;

    const setup = {
      dashboard: refreshDashboard,
      skills:    refreshSkillsTable,
      'add-skill': setupSkillForm,
      log:       setupLogForm,
      charts:    setupCharts,
      community: loadPosts,
      profile:   setupProfile
    };
    if (setup[name]) setup[name]();

    if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
  } else {
    _showTop(name);
  }

  ST.curPage = name;
  window.scrollTo(0, 0);
}

function _showTop(name) {
  ['landing','register','login','dash'].forEach(id =>
    document.getElementById('page-' + id).style.display = 'none');
  const el = document.getElementById('page-' + name);
  if (!el) return;
  el.style.display = (name === 'landing') ? 'block' : 'flex';
  if (!['landing','dash'].includes(name)) el.style.flexDirection = 'row';
}

function toggleMenu()  { document.getElementById('sidebar').classList.toggle('open'); }
function toggleMenu()     { document.getElementById('mob-nav').classList.toggle('open'); }

/* ─── SMOOTH SCROLL FOR NAVIGATION ─────────── */
function smoothScrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Trigger animations for the section
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('animate-in');
        // Also trigger animations for child elements
        const animateElements = section.querySelectorAll('.feat-card, .how-card, .sec-head');
        animateElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animate-in');
          }, index * 200);
        });
      }
    }, 300);
  }
}

/* ─── TRIGGER SECTION ANIMATIONS ───────────── */
function triggerSectionAnimations(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('animate-in');
    const animateElements = section.querySelectorAll('.feat-card, .how-card, .sec-head');
    animateElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-in');
      }, index * 150);
    });
  }
}

/* ─── PASSWORD VALIDATION ───────────────────── */

/* ─── PASSWORD VALIDATION ───────────────────── */
function validatePassword(pw) {
  return {
    len: pw.length >= 6,
    cap: /[A-Z]/.test(pw),
    num: /[0-9]/.test(pw),
    sym: /[@$#!%*?&^()_+=\-]/.test(pw)
  };
}

function checkPwStrength(pw, prefix = 'r') {
  const v = validatePassword(pw);
  const map = { len:'rr-len', cap:'rr-cap', num:'rr-num', sym:'rr-sym' };
  const texts = { len:'Min 6 characters', cap:'1 uppercase letter', num:'1 number', sym:'1 symbol (@,$,#,!…)' };

  // Support profile page prefix
  if (prefix === 'p-rules') {
    const ids = { len:'p-rr-len', cap:'p-rr-cap', num:'p-rr-num', sym:'p-rr-sym' };
    for (const key of Object.keys(v)) {
      const el = document.getElementById(ids[key]);
      if (!el) continue;
      el.textContent = (v[key] ? '✓ ' : '✗ ') + texts[key];
      el.classList.toggle('ok', v[key]);
    }
    return;
  }

  for (const key of Object.keys(v)) {
    const el = document.getElementById(map[key]);
    if (!el) continue;
    el.textContent = (v[key] ? '✓ ' : '✗ ') + texts[key];
    el.classList.toggle('ok', v[key]);
  }
}

function isPwValid(pw) {
  const v = validatePassword(pw);
  return v.len && v.cap && v.num && v.sym;
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else                          { inp.type = 'password'; btn.textContent = '👁'; }
}

/* ─── REGISTER ──────────────────────────────── */
async function handleRegister() {
  const name  = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim().toLowerCase();
  const pw    = document.getElementById('r-pass').value;
  const errEl = document.getElementById('r-err');
  const btn   = document.getElementById('r-btn');

  errEl.style.display = 'none';

  // Validations
  if (!name)                        return showErr(errEl, 'Please enter your full name.');
  if (!email)                       return showErr(errEl, 'Please enter your email.');
  if (!email.endsWith('@gmail.com')) return showErr(errEl, 'Only @gmail.com addresses are accepted.');
  if (!pw)                          return showErr(errEl, 'Please enter a password.');
  if (!isPwValid(pw))               return showErr(errEl, 'Password must have: min 6 chars, 1 uppercase, 1 number, 1 symbol.');

  btn.disabled = true; btn.textContent = 'Creating account…';
  showLoading(true);

  try {
    // Sign up with Supabase Auth (no email confirmation needed — disabled in dashboard)
    const { data, error } = await sb.auth.signUp({
      email,
      password: pw,
      options: { data: { full_name: name } }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed. Please try again.');

    ST.user = data.user;

    // Insert into profiles table
    await sb.from('profiles').upsert({
      id:         data.user.id,
      full_name:  name,
      email:      email,
      created_at: new Date().toISOString()
    });

    await loadAllData();
    showToast('Welcome, ' + name + '! 🎉', 'success');
    goPage('dashboard');
  } catch (err) {
    showErr(errEl, friendlyError(err.message));
  } finally {
    btn.disabled = false; btn.textContent = 'Create Account →';
    showLoading(false);
  }
}

/* ─── LOGIN ─────────────────────────────────── */
async function handleLogin() {
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pw    = document.getElementById('l-pass').value;
  const errEl = document.getElementById('l-err');
  const btn   = document.getElementById('l-btn');

  errEl.style.display = 'none';

  if (!email)                       return showErr(errEl, 'Please enter your email.');
  if (!email.endsWith('@gmail.com')) return showErr(errEl, 'Only @gmail.com addresses are accepted.');
  if (!pw)                          return showErr(errEl, 'Please enter your password.');

  btn.disabled = true; btn.textContent = 'Logging in…';
  showLoading(true);

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: pw });
    if (error) throw error;

    ST.user = data.user;
    await loadAllData();
    showToast('Welcome back! 👋', 'success');
    goPage('dashboard');
  } catch (err) {
    showErr(errEl, friendlyError(err.message));
  } finally {
    btn.disabled = false; btn.textContent = 'Login →';
    showLoading(false);
  }
}

/* ─── LOGOUT ────────────────────────────────── */
async function handleLogout() {
  if (!confirm('Log out of SkillTracker?')) return;
  await sb.auth.signOut();
  ST = { user:null, profile:null, skills:[], progress:[], curPage:'landing' };
  goPage('landing');
  showToast('Logged out.', 'success');
}

/* ─── CHANGE PASSWORD ───────────────────────── */
async function handleChangePassword() {
  const cur  = document.getElementById('p-cur').value;
  const npw  = document.getElementById('p-new').value;
  const conf = document.getElementById('p-conf').value;
  const errEl = document.getElementById('p-err');
  errEl.style.display = 'none';

  if (!cur)              return showErr(errEl, 'Enter your current password.');
  if (!npw)              return showErr(errEl, 'Enter a new password.');
  if (!isPwValid(npw))   return showErr(errEl, 'Password must have: min 6 chars, 1 uppercase, 1 number, 1 symbol.');
  if (npw !== conf)      return showErr(errEl, 'New passwords do not match.');

  showLoading(true);
  try {
    // Re-authenticate by signing in first
    const { error: reErr } = await sb.auth.signInWithPassword({
      email: ST.user.email, password: cur
    });
    if (reErr) throw new Error('Current password is incorrect.');

    const { error } = await sb.auth.updateUser({ password: npw });
    if (error) throw error;

    showToast('Password updated!', 'success');
    document.getElementById('p-cur').value = '';
    document.getElementById('p-new').value = '';
    document.getElementById('p-conf').value = '';
    errEl.style.display = 'none';
  } catch (err) {
    showErr(errEl, err.message);
  } finally { showLoading(false); }
}

/* ─── DELETE ACCOUNT ────────────────────────── */
async function handleDeleteAccount() {
  if (!confirm('This will permanently delete your account and all data. This cannot be undone.')) return;
  showLoading(true);
  try {
    // Delete user data (skills, progress cascade via FK in Supabase)
    await sb.from('profiles').delete().eq('id', ST.user.id);
    // Sign out (Supabase doesn't let client-side delete auth user — we just sign out)
    await sb.auth.signOut();
    ST = { user:null, profile:null, skills:[], progress:[], curPage:'landing' };
    goPage('landing');
    showToast('Account deleted.', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally { showLoading(false); }
}

/* ─── LOAD ALL DATA ─────────────────────────── */
async function loadAllData() {
  if (!ST.user) return;
  showLoading(true);
  try {
    const [skRes, prRes, prfRes] = await Promise.all([
      sb.from('skills').select('*').eq('user_id', ST.user.id).order('created_at', { ascending:false }),
      sb.from('progress').select('*, skills(name)').eq('user_id', ST.user.id).order('session_date', { ascending:false }),
      sb.from('profiles').select('*').eq('id', ST.user.id).single()
    ]);
    ST.skills   = skRes.data  || [];
    ST.progress = prRes.data  || [];
    ST.profile  = prfRes.data || null;
  } catch (err) { console.error('loadAllData error:', err); }
  finally { showLoading(false); }
}

/* ─── DASHBOARD ─────────────────────────────── */
function refreshDashboard() {
  if (!ST.user) return;

  // Sidebar / header info
  const name = ST.profile?.full_name || ST.user.user_metadata?.full_name || 'User';
  document.getElementById('sb-av').textContent    = name.charAt(0).toUpperCase();
  document.getElementById('sb-uname').textContent = name;
  document.getElementById('sb-email').textContent = ST.user.email;
  document.getElementById('dh-uname').textContent = name;

  // Stats
  const total    = ST.skills.length;
  const active   = ST.skills.filter(s => !_isInactive(s.id)).length;
  const sessions = ST.progress.length;
  const goal     = ST.skills.reduce((s, sk) => s + (sk.goal || 0), 0);
  const pct      = goal > 0 ? Math.min(100, Math.round((sessions / goal) * 100)) : 0;

  document.getElementById('s-total').textContent    = total;
  document.getElementById('s-active').textContent   = active;
  document.getElementById('s-sessions').textContent = sessions;
  document.getElementById('s-pct').textContent      = pct + '%';

  _renderInactive();
  _renderSkillsGrid();
  _renderRecent();
}

function _renderSkillsGrid() {
  const c = document.getElementById('skills-grid');
  if (!ST.skills.length) {
    c.innerHTML = '<div class="empty">No skills yet. <a href="#" onclick="openAddSkill();return false;">Add your first →</a></div>';
    return;
  }
  c.innerHTML = ST.skills.map(sk => {
    const done = ST.progress.filter(p => p.skill_id === sk.id).length;
    const goal = sk.goal || 1;
    const pct  = Math.min(100, Math.round((done / goal) * 100));
    const inac = _isInactive(sk.id);
    return `
    <div class="skill-card">
      <div class="skc-name">${_esc(sk.name)}</div>
      <div class="skc-desc">${_esc(sk.description || 'No description.')}</div>
      <div class="skc-prog-wrap">
        <div class="skc-prog-lbl"><span>${done}/${goal} sessions</span><span>${pct}%</span></div>
        <div class="prog-bar"><div class="prog-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <span class="skc-status ${inac ? 'inactive':'active'}">${inac ? 'Inactive':'Active'}</span>
      <div class="skc-acts">
        <button class="btn-sm-out" onclick="editSkill(${sk.id})">Edit</button>
        <button class="btn-sm-out" style="color:var(--danger);border-color:rgba(220,38,38,.3)" onclick="deleteSkill(${sk.id})">Delete</button>
        <button class="btn-sm-out" style="color:var(--red)" onclick="quickLog(${sk.id})">Log</button>
      </div>
    </div>`;
  }).join('');
}

function _renderInactive() {
  const sec  = document.getElementById('inactive-card');
  const list = document.getElementById('inactive-list');
  const bad  = ST.skills.filter(s => _isInactive(s.id));
  if (!bad.length) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  list.innerHTML = bad.map(sk => {
    const lp   = _lastProg(sk.id);
    const ref  = lp ? new Date(lp.session_date) : new Date(sk.created_at);
    const days = Math.floor((Date.now() - ref.getTime()) / 86400000);
    return `<div class="inactive-item"><div><div class="ii-name">${_esc(sk.name)}</div><div class="ii-days">No practice in ${days} days</div></div><button class="btn-sm-out" onclick="quickLog(${sk.id})">Log Now</button></div>`;
  }).join('');
}

function _renderRecent() {
  const c      = document.getElementById('recent-list');
  const sorted = [...ST.progress].slice(0, 5);
  if (!sorted.length) { c.innerHTML = '<div class="empty">No sessions yet.</div>'; return; }
  c.innerHTML = sorted.map(p => {
    const skName = p.skills?.name || ST.skills.find(s => s.id === p.skill_id)?.name || 'Unknown';
    const d = new Date(p.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
    return `<div class="sess-item"><div class="sess-dot"></div><div class="sess-info"><div class="sess-title">${_esc(p.session_title)}</div><div class="sess-skill">${_esc(skName)}</div></div><div class="sess-date">${d}</div></div>`;
  }).join('');
}

/* ─── SKILLS TABLE ──────────────────────────── */
function refreshSkillsTable() {
  const tbody = document.getElementById('skills-tbl-body');
  if (!ST.skills.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty">No skills yet.</td></tr>'; return; }
  tbody.innerHTML = ST.skills.map(sk => {
    const done = ST.progress.filter(p => p.skill_id === sk.id).length;
    const goal = sk.goal || 0;
    const pct  = goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : 0;
    const inac = _isInactive(sk.id);
    const lp   = _lastProg(sk.id);
    const last = lp ? new Date(lp.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Never';
    return `<tr>
      <td><strong>${_esc(sk.name)}</strong></td>
      <td>${done} / ${goal}</td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="prog-bar" style="flex:1;min-width:80px"><div class="prog-bar-fill" style="width:${pct}%"></div></div><span style="font-size:.82rem;font-weight:700;color:var(--red);min-width:36px">${pct}%</span></div></td>
      <td><span class="badge ${inac?'inactive':'active'}">${inac?'Inactive':'Active'}</span></td>
      <td>${last}</td>
      <td><div class="tbl-acts">
        <button class="btn-sm-out" onclick="editSkill(${sk.id})">Edit</button>
        <button class="btn-sm-out" style="color:var(--danger);border-color:rgba(220,38,38,.3)" onclick="deleteSkill(${sk.id})">Delete</button>
      </div></td>
    </tr>`;
  }).join('');
}

/* ─── ADD / EDIT SKILL ──────────────────────── */
function openAddSkill() {
  document.getElementById('edit-skill-id').value = '';
  goPage('add-skill');
}

function editSkill(id) {
  const sk = ST.skills.find(s => s.id === id);
  if (!sk) return;
  document.getElementById('edit-skill-id').value = sk.id;
  document.getElementById('sk-name').value  = sk.name;
  document.getElementById('sk-desc').value  = sk.description || '';
  document.getElementById('sk-goal').value  = sk.goal || 5;
  goPage('add-skill');
}

function setupSkillForm() {
  const editId = document.getElementById('edit-skill-id').value;
  const title  = document.getElementById('skill-form-title');
  const btn    = document.getElementById('sk-submit');
  const err    = document.getElementById('sk-err');
  err.style.display = 'none';

  if (!editId) {
    document.getElementById('sk-name').value = '';
    document.getElementById('sk-desc').value = '';
    document.getElementById('sk-goal').value = 5;
    title.textContent = 'Add New Skill';
    btn.textContent   = 'Add Skill';
    _renderTopics(5, []);
  } else {
    const sk = ST.skills.find(s => s.id === parseInt(editId));
    title.textContent = 'Edit Skill';
    btn.textContent   = 'Save Changes';
    const names = sk ? (Array.isArray(sk.session_names) ? sk.session_names : []) : [];
    _renderTopics(parseInt(document.getElementById('sk-goal').value) || 5, names);
  }
}

function changeGoal(delta) {
  const inp = document.getElementById('sk-goal');
  inp.value = Math.max(1, (parseInt(inp.value) || 0) + delta);
  onGoalChange();
}
function onGoalChange() {
  const inp = document.getElementById('sk-goal');
  let v = parseInt(inp.value) || 1; if (v < 1) v = 1; inp.value = v;
  const ex = Array.from(document.querySelectorAll('.topic-input')).map(i => i.value.trim());
  _renderTopics(v, ex);
}
function _renderTopics(n, existing = []) {
  const c = document.getElementById('session-topics'); c.innerHTML = '';
  for (let i = 1; i <= n; i++) {
    const wrap = document.createElement('div'); wrap.className = 'form-group';
    const lbl = document.createElement('label'); lbl.textContent = 'Session ' + i;
    lbl.style.cssText = 'font-size:.82rem;font-weight:500;color:var(--muted)';
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'topic-input';
    inp.placeholder = 'Topic for session ' + i + '…'; inp.value = existing[i-1] || '';
    wrap.appendChild(lbl); wrap.appendChild(inp); c.appendChild(wrap);
  }
}

async function handleSaveSkill() {
  const editId = document.getElementById('edit-skill-id').value;
  const name   = document.getElementById('sk-name').value.trim();
  const desc   = document.getElementById('sk-desc').value.trim();
  const goal   = parseInt(document.getElementById('sk-goal').value);
  const topics = Array.from(document.querySelectorAll('.topic-input')).map(i => i.value.trim());
  const errEl  = document.getElementById('sk-err');
  const btn    = document.getElementById('sk-submit');
  errEl.style.display = 'none';

  if (!name)             return showErr(errEl, 'Skill name is required.');
  if (!goal || goal < 1) return showErr(errEl, 'Set at least 1 session for the goal.');

  btn.disabled = true; btn.textContent = 'Saving…';
  showLoading(true);

  try {
    if (editId) {
      const { data, error } = await sb.from('skills').update({
        name, description: desc || null, goal, session_names: topics, updated_at: new Date().toISOString()
      }).eq('id', editId).eq('user_id', ST.user.id).select().single();
      if (error) throw error;
      const idx = ST.skills.findIndex(s => s.id === data.id);
      if (idx > -1) ST.skills[idx] = data;
      showToast('Skill updated!', 'success');
    } else {
      // Duplicate check
      if (ST.skills.find(s => s.name.toLowerCase() === name.toLowerCase()))
        throw new Error('A skill with this name already exists.');
      const { data, error } = await sb.from('skills').insert({
        user_id: ST.user.id, name, description: desc || null, goal, session_names: topics
      }).select().single();
      if (error) throw error;
      ST.skills.unshift(data);
      showToast('Skill added! 🎉', 'success');
    }
    document.getElementById('edit-skill-id').value = '';
    goPage('dashboard');
  } catch (err) {
    showErr(errEl, err.message);
  } finally {
    btn.disabled = false; btn.textContent = editId ? 'Save Changes' : 'Add Skill';
    showLoading(false);
  }
}

async function deleteSkill(id) {
  if (!confirm('Delete this skill and all its progress data?')) return;
  showLoading(true);
  try {
    const { error } = await sb.from('skills').delete().eq('id', id).eq('user_id', ST.user.id);
    if (error) throw error;
    ST.skills    = ST.skills.filter(s => s.id !== id);
    ST.progress  = ST.progress.filter(p => p.skill_id !== id);
    showToast('Skill deleted.', 'success');
    if (ST.curPage === 'skills') refreshSkillsTable(); else refreshDashboard();
  } catch (err) { showToast(err.message, 'error'); }
  finally { showLoading(false); }
}

/* ─── LOG SESSION ───────────────────────────── */
function setupLogForm() {
  _fillDropdown('log-skill', ST.skills);
  document.getElementById('log-title').value  = '';
  document.getElementById('log-notes').value  = '';
  document.getElementById('log-date').value   = _today();
  document.getElementById('log-err').style.display = 'none';
}

function quickLog(skillId) {
  goPage('log');
  setTimeout(() => { const d = document.getElementById('log-skill'); if (d) d.value = skillId; }, 150);
}

async function handleLogSession() {
  const skillId = parseInt(document.getElementById('log-skill').value);
  const title   = document.getElementById('log-title').value.trim();
  const date    = document.getElementById('log-date').value;
  const notes   = document.getElementById('log-notes').value.trim();
  const errEl   = document.getElementById('log-err');
  const btn     = document.getElementById('log-btn');
  errEl.style.display = 'none';

  if (!skillId) return showErr(errEl, 'Please select a skill.');
  if (!title)   return showErr(errEl, 'Enter a session title / topic.');
  if (!date)    return showErr(errEl, 'Select a date.');

  btn.disabled = true; btn.textContent = 'Saving…';
  showLoading(true);

  try {
    const { data, error } = await sb.from('progress').insert({
      user_id: ST.user.id, skill_id: skillId,
      session_title: title, session_date: date, notes: notes || null
    }).select('*, skills(name)').single();
    if (error) throw error;
    ST.progress.unshift(data);
    showToast('Session saved! ✅', 'success');
    goPage('dashboard');
  } catch (err) { showErr(errEl, err.message); }
  finally { btn.disabled = false; btn.textContent = 'Save Session'; showLoading(false); }
}

/* ─── CHARTS ────────────────────────────────── */
function setupCharts() {
  _fillDropdown('chart-skill-sel', ST.skills);
  document.getElementById('chart-summary').style.display = 'none';
  document.getElementById('chart-box').style.display     = 'none';
  document.getElementById('chart-empty').style.display   = 'block';
  document.getElementById('chart-empty').textContent     = 'Select a skill above to view its progress chart.';
  _renderAllSummary();
}

function renderChart() {
  const skillId = parseInt(document.getElementById('chart-skill-sel').value);
  if (!skillId) {
    document.getElementById('chart-summary').style.display = 'none';
    document.getElementById('chart-box').style.display     = 'none';
    document.getElementById('chart-empty').style.display   = 'block';
    return;
  }

  const data = ST.progress.filter(p => p.skill_id === skillId)
    .sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
  const sk   = ST.skills.find(s => s.id === skillId);
  const goal = sk ? (sk.goal || 0) : 0;
  const done = data.length;
  const pct  = goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : 0;

  document.getElementById('cs-goal').textContent = goal;
  document.getElementById('cs-done').textContent = done;
  document.getElementById('cs-pct').textContent  = pct + '%';
  document.getElementById('cs-left').textContent = Math.max(0, goal - done);
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('chart-summary').style.display = 'block';

  if (!data.length) {
    document.getElementById('chart-box').style.display   = 'none';
    document.getElementById('chart-empty').style.display = 'block';
    document.getElementById('chart-empty').textContent   = 'No sessions logged for this skill yet.';
    return;
  }

  document.getElementById('chart-box').style.display   = 'block';
  document.getElementById('chart-empty').style.display = 'none';
  if (chartInst) chartInst.destroy();

  const labels   = data.map(p => new Date(p.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'}));
  const cumul    = data.map((_,i) => i + 1);
  const goalLine = data.map(() => goal);

  chartInst = new Chart(document.getElementById('skillChart').getContext('2d'), {
    type: 'line',
    data: { labels, datasets: [
      { label:'Completed Sessions', data:cumul, borderColor:'#e94560', backgroundColor:'rgba(233,69,96,.08)', borderWidth:2.5, tension:.4, pointRadius:5, pointBackgroundColor:'#e94560', pointBorderColor:'#fff', pointBorderWidth:2, fill:true },
      { label:'Goal', data:goalLine, borderColor:'rgba(83,52,131,.4)', borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false, tension:0 }
    ]},
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: {
        legend:{ display:true, labels:{ font:{family:'DM Sans',size:12}, color:'#6b7280' }},
        tooltip:{ callbacks:{ afterBody(items){ const i=items[0]?.dataIndex; if(i!=null&&data[i]) return ['Topic: '+data[i].session_title]; }}}
      },
      scales: {
        y:{ beginAtZero:true, max:Math.max(goal,done)+1, ticks:{stepSize:1,color:'#6b7280',font:{size:11}}, grid:{color:'rgba(0,0,0,.04)'}, title:{display:true,text:'Sessions',color:'#6b7280',font:{size:11}} },
        x:{ ticks:{color:'#6b7280',font:{size:11}}, grid:{color:'rgba(0,0,0,.03)'}, title:{display:true,text:'Date',color:'#6b7280',font:{size:11}} }
      }
    }
  });
}

function _renderAllSummary() {
  const c = document.getElementById('all-summary');
  if (!ST.skills.length) { c.innerHTML = '<div class="empty">Add skills to see a summary.</div>'; return; }
  c.innerHTML = ST.skills.map(sk => {
    const done = ST.progress.filter(p => p.skill_id === sk.id).length;
    const goal = sk.goal || 1;
    const pct  = Math.min(100, Math.round((done / goal) * 100));
    return `<div class="sum-row"><div class="sum-name">${_esc(sk.name)}</div><div class="sum-bar"><div class="sum-fill" style="width:${pct}%"></div></div><div class="sum-pct">${pct}%</div></div>`;
  }).join('');
}

/* ─── COMMUNITY ─────────────────────────────── */
async function loadPosts() {
  const c = document.getElementById('posts-feed');
  c.innerHTML = '<div class="empty">Loading…</div>';
  try {
    const { data, error } = await sb.from('community_posts').select('*').order('created_at', { ascending:false }).limit(100);
    if (error) throw error;
    if (!data.length) { c.innerHTML = '<div class="empty">No posts yet. Be the first!</div>'; return; }
    
    // Group posts by parent
    const posts = data.filter(p => !p.parent_post_id);
    const replies = data.filter(p => p.parent_post_id);
    const repliesByParent = {};
    replies.forEach(r => {
      if (!repliesByParent[r.parent_post_id]) repliesByParent[r.parent_post_id] = [];
      repliesByParent[r.parent_post_id].push(r);
    });
    
    c.innerHTML = posts.map(p => {
      const d = new Date(p.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
      const postHtml = `<div class="post-card"><div class="post-hd"><div class="post-author">👤 Anonymous Learner <span class="post-cat">${_esc(p.category_label)}</span></div><div class="post-date">${d}</div></div><div class="post-text">${_esc(p.content)}</div><div class="post-actions"><button class="btn btn-ghost btn-sm" onclick="showReplyForm(${p.id})">Reply</button></div><div id="reply-form-${p.id}" class="reply-form" style="display:none"><textarea id="reply-body-${p.id}" rows="2" placeholder="Write a reply…"></textarea><button class="btn btn-red btn-sm" onclick="submitReply(${p.id})">Reply</button><button class="btn btn-ghost btn-sm" onclick="hideReplyForm(${p.id})">Cancel</button></div>`;
      
      const postReplies = repliesByParent[p.id] || [];
      const repliesHtml = postReplies.map(r => {
        const rd = new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
        return `<div class="reply-card"><div class="post-hd"><div class="post-author">👤 Anonymous Learner <span class="post-cat">${_esc(r.category_label)}</span></div><div class="post-date">${rd}</div></div><div class="post-text">${_esc(r.content)}</div></div>`;
      }).join('');
      
      return postHtml + repliesHtml + '</div>';
    }).join('');
  } catch { c.innerHTML = '<div class="empty">Failed to load posts.</div>'; }
}

async function submitPost() {
  const content  = document.getElementById('post-body').value.trim();
  const category = document.getElementById('post-cat').value;
  if (!content || content.length < 10) { showToast('Post must be at least 10 characters.', 'error'); return; }

  const labels = { tip:'💡 Learning Tip', question:'❓ Question', motivation:'🔥 Motivation', resource:'📚 Resource' };
  showLoading(true);
  try {
    const { error } = await sb.from('community_posts').insert({
      category, category_label: labels[category], content
    });
    if (error) throw error;
    document.getElementById('post-body').value = '';
    showToast('Posted anonymously! 🎉', 'success');
    loadPosts();
  } catch (err) { showToast(err.message, 'error'); }
  finally { showLoading(false); }
}

function showReplyForm(postId) {
  document.getElementById(`reply-form-${postId}`).style.display = 'block';
}

function hideReplyForm(postId) {
  document.getElementById(`reply-form-${postId}`).style.display = 'none';
  document.getElementById(`reply-body-${postId}`).value = '';
}

async function submitReply(parentId) {
  const content = document.getElementById(`reply-body-${parentId}`).value.trim();
  if (!content || content.length < 5) { showToast('Reply must be at least 5 characters.', 'error'); return; }

  showLoading(true);
  try {
    const { error } = await sb.from('community_posts').insert({
      content, category: 'reply', category_label: '💬 Reply', parent_post_id: parentId
    });
    if (error) throw error;
    hideReplyForm(parentId);
    showToast('Replied anonymously! 🎉', 'success');
    loadPosts();
  } catch (err) { showToast(err.message, 'error'); }
  finally { showLoading(false); }
}

/* ─── PROFILE ───────────────────────────────── */
function setupProfile() {
  const name = ST.profile?.full_name || ST.user?.user_metadata?.full_name || 'User';
  const since = ST.profile?.created_at || ST.user?.created_at;
  document.getElementById('p-name').value  = name;
  document.getElementById('p-email').value = ST.user?.email || '';
  document.getElementById('p-since').value = since ? new Date(since).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : 'N/A';
  document.getElementById('p-err').style.display = 'none';
}

/* ─── HELPERS ───────────────────────────────── */
function _fillDropdown(id, skills) {
  const dd = document.getElementById(id);
  dd.innerHTML = '<option value="">Choose a skill…</option>';
  skills.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; dd.appendChild(o); });
}

function _today() { return new Date().toISOString().split('T')[0]; }

function _lastProg(skillId) {
  const arr = ST.progress.filter(p => p.skill_id === skillId);
  return arr.length ? arr.reduce((l, p) => new Date(p.session_date) > new Date(l.session_date) ? p : l) : null;
}

function _isInactive(skillId) {
  const sk = ST.skills.find(s => s.id === skillId); if (!sk) return false;
  const lp = _lastProg(skillId);
  const ref = lp ? new Date(lp.session_date) : (sk.created_at ? new Date(sk.created_at) : null);
  if (!ref) return false;
  return (Date.now() - ref.getTime()) / 86400000 > 30;
}

function _esc(str) {
  const d = document.createElement('div'); d.appendChild(document.createTextNode(str || '')); return d.innerHTML;
}

function friendlyError(msg) {
  if (!msg) return 'Something went wrong. Please try again.';
  if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.';
  if (msg.includes('User already registered'))   return 'An account with this email already exists.';
  if (msg.includes('Email not confirmed'))        return 'Account not confirmed. Please contact support.';
  if (msg.includes('Password should be'))         return 'Password does not meet requirements.';
  return msg;
}

function showErr(el, msg) { el.textContent = msg; el.style.display = 'block'; }

/* ─── TOAST ─────────────────────────────────── */
let _tt = null;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type; t.style.display = 'block';
  clearTimeout(_tt); _tt = setTimeout(() => t.style.display = 'none', 3800);
}

/* ─── LOADING ───────────────────────────────── */
function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
}
