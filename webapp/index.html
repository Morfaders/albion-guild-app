<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Albion Guild — Comp Manager</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root {
  --bg:#0e1117; --bg2:#161b27; --bg3:#1e2536; --bg4:#252d3d;
  --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.14);
  --text:#e8eaf0; --text2:#8b92a8; --text3:#555e75;
  --accent:#5865F2; --accent2:#4752c4;
  --r:8px; --r2:12px;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;font-size:14px;min-height:100vh;}
.app{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:240px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;}
.sidebar-header{padding:16px;border-bottom:1px solid var(--border);}
.guild-name{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;display:flex;align-items:center;gap:8px;}
.guild-icon{width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;}
.sidebar-label{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);padding:10px 16px 4px;}
.nav-item{display:flex;align-items:center;gap:8px;padding:7px 16px;cursor:pointer;border-radius:4px;margin:0 6px;color:var(--text2);font-size:14px;transition:all .12s;}
.nav-item:hover{background:var(--bg3);color:var(--text);}
.nav-item.active{background:var(--bg4);color:var(--text);}
.nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.sidebar-bottom{margin-top:auto;padding:12px 16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:8px;}
.user-avatar{width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;}
.main{flex:1;overflow-y:auto;display:flex;flex-direction:column;}
.channel-header{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--border);background:var(--bg2);flex-shrink:0;}
.channel-name{font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:600;letter-spacing:.04em;}
.content{padding:20px;flex:1;max-width:980px;width:100%;}
.view{display:none;}
.view.active{display:block;}
.btn{padding:7px 14px;border:1px solid var(--border2);border-radius:var(--r);cursor:pointer;font-size:13px;font-weight:500;font-family:'Inter',sans-serif;background:var(--bg3);color:var(--text);transition:all .12s;}
.btn:hover{background:var(--bg4);}
.btn.active{background:#fff;color:#000;border-color:#fff;}
.btn-primary{background:var(--accent);border-color:var(--accent);color:white;}
.btn-primary:hover{background:var(--accent2);border-color:var(--accent2);}
.btn-success{background:rgba(61,220,132,.15);border-color:rgba(61,220,132,.35);color:#3ddc84;}
.btn-success:hover{background:rgba(61,220,132,.25);}
.btn-warning{background:rgba(240,192,64,.15);border-color:rgba(240,192,64,.35);color:#f0c040;}
.btn-warning:hover{background:rgba(240,192,64,.25);}
.btn-danger{background:rgba(240,71,71,.15);border-color:rgba(240,71,71,.35);color:#f04747;}
.btn-danger:hover{background:rgba(240,71,71,.25);}
.btn-sm{padding:4px 10px;font-size:11px;}
.btn-icon{padding:4px 8px;font-size:12px;line-height:1;}
.player-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:16px;}
.player-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r2);padding:14px;transition:border-color .15s;}
.player-card:hover{border-color:var(--border2);}
.role-pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;}
.presence-bar{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r2);padding:16px;margin-bottom:14px;}
.presence-bar-title{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;letter-spacing:.05em;color:var(--text2);text-transform:uppercase;margin-bottom:10px;}
.presence-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:20px;border:1px solid var(--border);background:var(--bg3);font-size:12px;color:var(--text2);}
.chip-flag{cursor:pointer;font-size:10px;opacity:.4;margin-left:2px;transition:opacity .1s;}
.chip-flag:hover{opacity:1;}
.chip-flag.on{opacity:1;color:#f0c040;}
.comp-zone{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;}
.role-block{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r2);padding:14px;}
.role-block-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border);}
.role-block-label{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
.player-slot{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;margin-bottom:3px;font-size:13px;}
.player-slot:hover{background:var(--bg3);}
.slot-weapon{font-family:'IBM Plex Mono',monospace;font-size:11px;}
.empty-slot{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:6px;border:1px dashed var(--border2);font-size:12px;color:var(--text3);cursor:pointer;margin-bottom:3px;transition:all .12s;}
.empty-slot:hover{border-color:var(--accent);color:var(--accent);background:rgba(88,101,242,.05);}
.temp-section{margin-top:20px;padding-top:16px;border-top:1px dashed var(--border2);}
.temp-section-title{font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--text3);text-transform:uppercase;margin-bottom:10px;}
.temp-role-block{background:var(--bg2);border:1px dashed var(--border2);border-radius:var(--r2);padding:12px;margin-bottom:8px;}
.temp-role-header{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.temp-name-input{flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:5px 10px;color:var(--text);font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;letter-spacing:.04em;outline:none;}
.temp-name-input:focus{border-color:var(--accent);}
.comp-class-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r2);padding:12px;margin-bottom:10px;}
.comp-class-title{font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:13px;margin-bottom:8px;}
.comp-roles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;}
.comp-role-card{display:flex;flex-direction:column;gap:8px;padding:10px;background:var(--bg3);border-radius:var(--r);width:100%;}
.comp-role-label{font-size:13px;font-weight:600;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.comp-role-unique{font-size:9px;color:var(--text3);flex-shrink:0;align-self:flex-end;}
.qty-pill{display:inline-flex;align-items:center;border-radius:20px;border:1px solid var(--border2);overflow:hidden;background:var(--bg4);flex-shrink:0;}
.qty-pill button{width:22px;height:22px;border:none;background:transparent;color:var(--text2);cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;transition:background .1s;}
.qty-pill button:hover{background:var(--bg3);color:var(--text);}
.qty-pill button.dec:hover{color:#f04747;}
.qty-pill button.inc:hover{color:#3ddc84;}
.qty-pill .qty-val{min-width:22px;text-align:center;font-size:12px;font-weight:700;color:var(--text);padding:0 2px;}
.max-toggle{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--text3);cursor:pointer;flex-shrink:0;}
.max-toggle input{cursor:pointer;accent-color:var(--accent);}
.max-toggle.on{color:#f04747;}
.cls-row{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg3);border-radius:var(--r);margin-bottom:6px;cursor:grab;user-select:none;transition:opacity .15s,box-shadow .15s;}
.role-row-editor{display:flex;align-items:center;gap:10px;padding:7px 12px;background:var(--bg3);border-radius:var(--r);margin-bottom:5px;cursor:grab;user-select:none;transition:opacity .15s,box-shadow .15s;}
.cls-row.dragging,.role-row-editor.dragging{opacity:.4;cursor:grabbing;}
.cls-row.drag-over,.role-row-editor.drag-over{box-shadow:0 -2px 0 var(--accent);}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:1000;}
.modal.open{display:flex;}
.modal-box{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r2);padding:20px;width:400px;max-width:95vw;max-height:85vh;overflow-y:auto;}
.modal-title{font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;letter-spacing:.05em;margin-bottom:12px;}
.modal-player-opt{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--r);cursor:pointer;border:1px solid transparent;transition:all .1s;margin-bottom:4px;}
.modal-player-opt:hover{background:var(--bg3);border-color:var(--border);}
.modal-player-opt.selected{background:rgba(88,101,242,.1);border-color:var(--accent);}
.modal-player-opt.dimmed{opacity:.4;pointer-events:none;}
.weapon-input{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:8px 12px;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:13px;outline:none;}
.weapon-input:focus{border-color:var(--accent);}
.dup-warn{background:rgba(240,71,71,.1);border:1px solid rgba(240,71,71,.3);border-radius:var(--r);padding:8px 12px;font-size:12px;color:#f04747;margin-top:8px;}
.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.section-title{font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;letter-spacing:.05em;}
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
#modal-assign{position:fixed;display:none;background:var(--bg2);z-index:1000;border-radius:var(--r2);padding:16px;width:360px;box-shadow:0 10px 40px rgba(0,0,0,.7);border:1px solid var(--border2);}
input[type=color]{width:38px;height:28px;border:1px solid var(--border2);border-radius:4px;padding:0;cursor:pointer;background:none;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:4px;}
/* Loading overlay */
.loading{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;letter-spacing:.05em;color:var(--text2);}
.loading.hidden{display:none;}
body.render-mode .sidebar,
body.render-mode .channel-header,
body.render-mode #comp-select,
body.render-mode [onclick="addTempRole()"],
body.render-mode .btn-danger,
body.render-mode .empty-slot,
body.render-mode .chip-flag,
body.render-mode #event-banner .btn {
  display: none !important;
}
body.render-mode .app { height: auto; }
body.render-mode .main { overflow: visible; }
body.render-mode .content { max-width: 100%; }
</style>
</head>
<body>
<div class="loading" id="loading">⚔️ Chargement...</div>
<div class="app" style="display:none" id="app">
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="guild-name"><div class="guild-icon">AG</div>Albion Guild</div>
    </div>
    <div class="sidebar-label">📋 Gestion</div>
    <div class="nav-item active" onclick="showView('profiles')" id="nav-profiles"><div class="nav-dot" style="background:#5865F2"></div>Profils joueurs</div>
    <div class="nav-item" onclick="showView('event')" id="nav-event"><div class="nav-dot" style="background:#3ddc84"></div>Événement actif</div>
    <div class="nav-item" onclick="showView('comps')" id="nav-comps"><div class="nav-dot" style="background:#f0c040"></div>Éditeur comp</div>
    <div class="nav-item" onclick="showView('classes')" id="nav-classes"><div class="nav-dot" style="background:#b478f0"></div>Classes & Rôles</div>
    <div class="sidebar-bottom">
      <div class="user-avatar">AG</div>
      <div><div style="font-size:13px;font-weight:500">Albion Guild</div><div style="font-size:11px;color:var(--text3)">🟢 En ligne</div></div>
    </div>
  </div>
  <div class="main">
    <div class="channel-header">
      <span id="ch-icon">👤</span>
      <span class="channel-name" id="ch-name">profils-joueurs</span>
    </div>
    <div class="content">
      <!-- VIEW: PROFILES -->
      <div class="view active" id="view-profiles">
        <div class="section-head">
          <div class="section-title">Profils joueurs</div>
          <button class="btn btn-primary btn-sm" onclick="openAddPlayer()">+ Ajouter</button>
        </div>
        <div class="filter-row" id="filter-row"></div>
        <div class="player-grid" id="player-grid"></div>
      </div>
      <!-- VIEW: EVENT -->
      <div class="view" id="view-event">
        <div id="event-banner" style="background:linear-gradient(135deg,#1a1f30,#1e2738);border:1px solid var(--border2);border-radius:var(--r2);padding:20px;margin-bottom:16px;">
          <div style="font-family:'Rajdhani',sans-serif;font-size:24px;font-weight:700;" id="event-title">⚔️ Événement</div>
          <div style="font-size:13px;color:var(--text2);margin-top:4px;" id="event-subtitle"><span id="present-count">0 présents</span></div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-success btn-sm" onclick="setMyPresence('present')">✓ Je suis là</button>
            <button class="btn btn-warning btn-sm" onclick="setMyPresence('maybe')">? Peut-être</button>
            <button class="btn btn-danger btn-sm" onclick="setMyPresence('absent')">✕ Absent</button>
          </div>
        </div>
        <div class="presence-bar">
          <div class="presence-bar-title">Présences <span style="font-size:10px;color:var(--text3);font-weight:400;text-transform:none;letter-spacing:0;">— cliquez ⚑ pour marquer un doute</span></div>
          <div id="presence-list" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
        </div>
        <div class="section-head" style="margin-top:4px;">
          <div class="section-title">Composition</div>
          <div style="display:flex;gap:8px;align-items:center;">
            <select id="comp-select" class="btn btn-sm" onchange="loadTemplate(this.value)" style="background:var(--bg3);color:var(--text);"></select>
            <button class="btn btn-sm" onclick="addTempRole()">+ Rôle temp.</button>
          </div>
        </div>
        <div id="comp-zone" class="comp-zone"></div>
        <div id="temp-zone"></div>
      </div>
      <!-- VIEW: COMP EDITOR -->
      <div class="view" id="view-comps">
        <div class="section-head">
          <div class="section-title">Éditeur de composition</div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-primary btn-sm" onclick="saveComp()">💾 Sauvegarder</button>
            <button class="btn btn-sm" onclick="newComp()">+ Nouvelle</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCurrentComp()">🗑</button>
          </div>
        </div>
        <div id="comp-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>
        <input id="comp-name-input" class="weapon-input" placeholder="Nom de la composition" style="max-width:300px;margin-bottom:14px;">
        <div id="comp-editor"></div>
      </div>
      <!-- VIEW: CLASSES & ROLES -->
      <div class="view" id="view-classes">
        <div class="section-head">
          <div class="section-title">Classes & Rôles</div>
          <button class="btn btn-primary btn-sm" onclick="saveClassesRoles()">💾 Sauvegarder</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <div style="font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.05em;color:var(--text2);font-size:13px;text-transform:uppercase;margin-bottom:8px;">Classes</div>
            <div id="classes-list"></div>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
              <input id="new-class-name" class="weapon-input" placeholder="Nouvelle classe" style="flex:1;min-width:120px;">
              <input type="color" id="new-class-color" value="#aaaaaa">
              <button class="btn btn-sm btn-primary" onclick="addClass()">+ Ajouter</button>
            </div>
          </div>
          <div>
            <div style="font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.05em;color:var(--text2);font-size:13px;text-transform:uppercase;margin-bottom:8px;">Rôles</div>
            <div id="roles-list"></div>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
              <input id="new-role-name" class="weapon-input" placeholder="Nom du rôle" style="flex:1;min-width:120px;">
              <select id="new-role-class" style="background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:6px 8px;color:var(--text);font-family:'Inter',sans-serif;font-size:13px;outline:none;"></select>
              <button class="btn btn-sm btn-primary" onclick="addRole()">+ Ajouter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- FLOATING ASSIGN MODAL -->
<div id="modal-assign"></div>
<!-- MODAL: ADD PLAYER -->
<div id="modal-player" class="modal">
  <div class="modal-box">
    <div class="modal-title">Nouveau joueur</div>
    <input id="new-name" class="weapon-input" placeholder="Pseudo ingame" style="margin-bottom:8px;">
    <input id="new-discord-id" class="weapon-input" placeholder="Discord ID (ex: 123456789)" style="margin-bottom:12px;">
    <div style="font-size:12px;color:var(--text2);margin-bottom:8px;">Rôles disponibles :</div>
    <div id="new-roles" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn btn-sm" onclick="closeAddModal()">Annuler</button>
      <button class="btn btn-primary btn-sm" onclick="confirmAddPlayer()">Ajouter</button>
    </div>
  </div>
</div>
<!-- MODAL: EDIT PLAYER -->
<div id="modal-edit-player" class="modal">
  <div class="modal-box">
    <div class="modal-title">Modifier — <span id="edit-player-name"></span></div>
    <div id="edit-roles-list" style="display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 16px;"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn btn-sm" onclick="closeEditModal()">Annuler</button>
      <button class="btn btn-primary btn-sm" onclick="savePlayerRoles()">Enregistrer</button>
    </div>
  </div>
</div>

<script>
// ============================================================
// SUPABASE INIT
// ============================================================
const SUPABASE_URL = 'https://pykfayupgehzxpeqzdin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JHGXYJx7Obu6-oW3Z9CGjQ_wx2FeTTW';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// STATE
// ============================================================
let CLASSES_DEF = [];
let ROLES_DEF = [];
let players = [];
let presence = {};
let flagged = new Set();
let assignments = {};
let tempRoles = [];
let tempAssignments = {};
let comps = [];
let currentComp = null;
let editingComp = null;
let editCompIdx = 0;
let editingPlayerId = null;
let newSelected = [];
let currentFilter = 'alpha';
let pendingRoleId = null;
let pendingPlayerId = null;
let pendingIsTemp = false;
let pendingTempId = null;
let currentEventId = null;
const CURRENT_USER_ID = null; // pas d'auth pour l'instant

// ============================================================
// INIT — charge tout depuis Supabase
// ============================================================
async function init(){
  // Lire event_id dans l'URL si présent
  const params = new URLSearchParams(window.location.search);
  currentEventId = params.get('event_id') ? parseInt(params.get('event_id')) : null;
    // Mode render pour screenshot
  if(params.get('render') === 'true'){
    document.body.classList.add('render-mode');
  }
  await Promise.all([
    loadClasses(),
    loadRoles(),
    loadPlayers(),
    loadComps(),
  ]);

  if(currentEventId){
    await loadEventData(currentEventId);
  }

  document.getElementById('loading').classList.add('hidden');
  document.getElementById('app').style.display = 'flex';

  renderProfiles();
  updateCompSelect();

  // Si on arrive avec un event_id, ouvrir directement l'événement
  if(currentEventId) showView('event');
  // Realtime — écoute les changements si on a un event actif
  if(currentEventId){
    sb.channel('event-'+currentEventId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'presences',
        filter: `event_id=eq.${currentEventId}`
      }, () => {
        loadEventData(currentEventId).then(()=>renderPresence());
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assignments',
        filter: `event_id=eq.${currentEventId}`
      }, () => {
        loadEventData(currentEventId).then(()=>{ renderComp(); renderPresence(); });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'flagged',
        filter: `event_id=eq.${currentEventId}`
      }, () => {
        loadEventData(currentEventId).then(()=>renderPresence());
      })
      .subscribe();
  }
}

async function loadClasses(){
  const { data } = await sb.from('classes_def').select('*').order('sort_order');
  CLASSES_DEF = data || [];
}
async function loadRoles(){
  const { data } = await sb.from('roles_def').select('*').order('sort_order');
  ROLES_DEF = data || [];
}
async function loadPlayers(){
  const { data } = await sb.from('players').select('*').order('name');
  players = (data || []).map(p => ({...p, roles: p.roles || []}));
}
async function loadComps(){
  const { data } = await sb.from('comps').select('*').order('id');
  comps = data || [];
  if(comps.length > 0 && !currentComp){
    currentComp = JSON.parse(JSON.stringify(comps[0]));
    editingComp = JSON.parse(JSON.stringify(comps[0]));
  }
}
async function loadEventData(eventId){
  // Charge les présences
  const { data: presData } = await sb.from('presences').select('*').eq('event_id', eventId);
  presence = {};
  (presData || []).forEach(p => { presence[p.discord_id] = p.status; });

  // Charge les assignations
  const { data: asgData } = await sb.from('assignments').select('*').eq('event_id', eventId);
  assignments = {};
  (asgData || []).forEach(a => {
    if(!assignments[a.role_id]) assignments[a.role_id] = [];
    assignments[a.role_id].push({ playerId: a.discord_id, weapon: a.weapon || '' });
  });

  // Charge les flagged
  const { data: flagData } = await sb.from('flagged').select('*').eq('event_id', eventId);
  flagged = new Set((flagData || []).map(f => f.discord_id));

  // Charge les infos de l'event
  const { data: event } = await sb.from('events').select('*').eq('id', eventId).single();
  if(event){
    document.getElementById('event-title').textContent = '⚔️ ' + event.title;
    document.getElementById('event-subtitle').innerHTML = (event.event_date || '') + ' — <span id="present-count">0 présents</span>';
    if(event.comp_id){
      const comp = comps.find(c => c.id === event.comp_id);
      if(comp) currentComp = JSON.parse(JSON.stringify(comp));
    }
  }
}

// ============================================================
// HELPERS
// ============================================================
function getInitials(n){ return n.slice(0,2).toUpperCase(); }
function roleDef(id){ return ROLES_DEF.find(r=>r.id===id); }
function classDef(id){ return CLASSES_DEF.find(c=>c.id===id); }
function avatarEl(name, color, size=34){
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color}22;color:${color};display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:${Math.round(size*.38)}px;flex-shrink:0;">${getInitials(name)}</div>`;
}
function visibleSlots(rid){
  const slotDef = currentComp?.slots?.[rid];
  const count = slotDef ? slotDef.count : 0;
  const strict = slotDef ? slotDef.strict : false;
  const assigned = (assignments[rid]||[]).length;
  if(strict) return count;
  return Math.max(count, assigned + 1);
}
function getAssignedRole(pid){
  for(const [rid,arr] of Object.entries(assignments)){
    if(arr.some(a=>a.playerId===pid)) return roleDef(rid);
  }
  return null;
}

// ============================================================
// NAVIGATION
// ============================================================
const CH_META = {
  profiles:['👤','profils-joueurs'],
  event: ['⚔️','événement-actif'],
  comps: ['🛠️','éditeur-comp'],
  classes: ['🎨','classes-rôles'],
};
function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.getElementById('nav-'+v).classList.add('active');
  const [ico,name]=CH_META[v]||['📋',v];
  document.getElementById('ch-icon').textContent=ico;
  document.getElementById('ch-name').textContent=name;
  if(v==='profiles') renderProfiles();
  if(v==='event') renderEvent();
  if(v==='comps') renderCompEditor();
  if(v==='classes') renderClassesEditor();
}

// ============================================================
// VIEW: PROFILES
// ============================================================
function buildFilterRow(){
  const filters=[{id:'alpha',label:'A–Z',color:null},...CLASSES_DEF.map(c=>({id:c.id,label:c.label,color:c.color}))];
  document.getElementById('filter-row').innerHTML=filters.map(f=>`
    <button class="btn btn-sm ${currentFilter===f.id?'active':''}" style="${f.color&&currentFilter!==f.id?'color:'+f.color:''}" onclick="filterPlayers('${f.id}')">${f.label}</button>`).join('');
}
function renderProfiles(){
  buildFilterRow();
  let list=[...players];
  if(currentFilter==='alpha') list.sort((a,b)=>a.name.localeCompare(b.name));
  else list=list.filter(p=>p.roles.some(rid=>(roleDef(rid)||{}).cls===currentFilter));
  document.getElementById('player-grid').innerHTML=list.map(p=>`
    <div class="player-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        ${avatarEl(p.name,p.color||'#5865F2')}
        <div style="flex:1;"><div style="font-weight:500">${p.name}</div><div style="font-size:11px;color:var(--text3)">${p.discord_id ? '🔗 '+p.discord_id.slice(0,8)+'...' : 'pas de discord ID'}</div></div>
        <button class="btn btn-icon" onclick="editPlayerRoles(${p.id})">⚙️</button>
        <button class="btn btn-icon btn-danger" onclick="deletePlayer(${p.id})">✕</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">
        ${p.roles.map(rid=>{const r=roleDef(rid);return r?`<span class="role-pill" style="background:${r.color}18;color:${r.color};">${r.label}</span>`:''}).join('')}
      </div>
    </div>`).join('');
}
function filterPlayers(f){ currentFilter=f; renderProfiles(); }

async function deletePlayer(id){
  if(!confirm('Supprimer ce joueur ?')) return;
  await sb.from('players').delete().eq('id', id);
  players = players.filter(p=>p.id!==id);
  renderProfiles();
}

function editPlayerRoles(id){
  editingPlayerId=id;
  const p=players.find(pl=>pl.id===id);
  document.getElementById('edit-player-name').textContent=p.name;
  document.getElementById('edit-roles-list').innerHTML=ROLES_DEF.map(r=>{
    const sel=p.roles.includes(r.id);
    return `<div class="role-pill" style="cursor:pointer;" data-rid="${r.id}" onclick="toggleEditRole(this,'${r.id}','${r.color}')">${r.label}</div>`;
  }).join('');
  document.querySelectorAll('#edit-roles-list [data-rid]').forEach(el=>{
    const sel=p.roles.includes(el.dataset.rid);
    applyPillState(el,sel,roleDef(el.dataset.rid).color);
  });
  document.getElementById('modal-edit-player').classList.add('open');
}
function toggleEditRole(el,rid,color){ const on=el.dataset.on==='1'; applyPillState(el,!on,roleDef(rid).color); }
function applyPillState(el,on,color){
  el.dataset.on=on?'1':'0';
  el.style.background=on?color:'transparent';
  el.style.color=on?'#0e1117':color;
  el.style.border=`1px solid ${color}${on?'':'44'}`;
}
async function savePlayerRoles(){
  const p=players.find(pl=>pl.id===editingPlayerId);
  const newRoles=Array.from(document.querySelectorAll('#edit-roles-list [data-rid]')).filter(el=>el.dataset.on==='1').map(el=>el.dataset.rid);
  await sb.from('players').update({ roles: newRoles }).eq('id', editingPlayerId);
  p.roles = newRoles;
  closeEditModal(); renderProfiles();
}
function closeEditModal(){ document.getElementById('modal-edit-player').classList.remove('open'); }

function openAddPlayer(){
  newSelected=[];
  document.getElementById('new-name').value='';
  document.getElementById('new-discord-id').value='';
  document.getElementById('new-roles').innerHTML=ROLES_DEF.map(r=>`
    <div class="role-pill" style="cursor:pointer;border:1px solid ${r.color}44;background:transparent;color:${r.color};"
      data-rid="${r.id}" onclick="toggleNewRole(this,'${r.id}','${r.color}')">${r.label}</div>`).join('');
  document.getElementById('modal-player').classList.add('open');
}
function toggleNewRole(el,rid,color){
  if(newSelected.includes(rid)){newSelected=newSelected.filter(x=>x!==rid);el.style.background='transparent';el.style.color=color;el.style.border=`1px solid ${color}44`;}
  else{newSelected.push(rid);el.style.background=color;el.style.color='#0e1117';el.style.border=`1px solid ${color}`;}
}
async function confirmAddPlayer(){
  const name=document.getElementById('new-name').value.trim();
  const discord_id=document.getElementById('new-discord-id').value.trim();
  if(!name){alert('Nom requis');return;}
  const palette=['#5ba4f5','#3ddc84','#f04747','#f07844','#b478f0','#7bcfb0','#e47fbf','#f0c040'];
  const color=palette[players.length%palette.length];
  const { data, error } = await sb.from('players').insert({ name, discord_id: discord_id||null, color, roles: newSelected }).select().single();
  if(error){ alert('Erreur: '+error.message); return; }
  players.push({...data, roles: data.roles||[]});
  closeAddModal(); renderProfiles();
}
function closeAddModal(){ document.getElementById('modal-player').classList.remove('open'); }

// ============================================================
// VIEW: EVENT
// ============================================================
async function setMyPresence(st){
  // Pour l'instant sans auth, on marque le premier joueur comme test
  // À remplacer par l'auth Discord plus tard
  alert('Présence via Discord uniquement pour l\'instant.');
}

function renderEvent(){
  renderPresence();
  renderComp();
  renderTempZone();
  updateCompSelect();
}

function getStatusStyle(st){
  if(st==='present') return {border:'rgba(61,220,132,.4)',bg:'rgba(61,220,132,.08)',color:'#3ddc84'};
  if(st==='maybe')   return {border:'rgba(240,192,64,.4)', bg:'rgba(240,192,64,.08)', color:'#f0c040'};
  if(st==='absent')  return {border:'rgba(240,71,71,.3)',  bg:'rgba(240,71,71,.06)',  color:'#f04747'};
  return {border:'rgba(255,255,255,0.07)',bg:'var(--bg3)',color:'var(--text2)'};
}

function renderPresence(){
  const o={present:0,maybe:1,none:2,absent:3};
  const sortFn=(a,b)=>{
    const pa=o[presence[a.discord_id]||'none'], pb=o[presence[b.discord_id]||'none'];
    if(pa!==pb) return pa-pb;
    return a.name.localeCompare(b.name);
  };
  const assignedIds=new Set(Object.values(assignments).flat().map(a=>a.playerId));
  const clsOrder=(p)=>{
    const r=getAssignedRole(p.discord_id);
    if(!r) return 999;
    return CLASSES_DEF.findIndex(c=>c.id===r.cls);
  };
  const assignedSortFn=(a,b)=>{
    const ca=clsOrder(a), cb=clsOrder(b);
    if(ca!==cb) return ca-cb;
    return a.name.localeCompare(b.name);
  };
  const free=players.filter(p=>!assignedIds.has(p.discord_id)).sort(sortFn);
  const assigned=players.filter(p=>assignedIds.has(p.discord_id)).sort(assignedSortFn);

  const makeChip=(p, useStatusColor, assignedRole)=>{
    const st=presence[p.discord_id]||'none';
    const isFlagged=flagged.has(p.discord_id);
    let border,bg,color,avatarColor;
    if(useStatusColor){
      const s=getStatusStyle(st);
      border=s.border; bg=s.bg; color=s.color; avatarColor=s.color;
    } else {
      const r=assignedRole;
      const cls=r&&r.cls?classDef(r.cls):null;
      const c=cls?cls.color:(r?r.color:'#8b92a8');
      border=c+'55'; bg=c+'12'; color=c; avatarColor=c;
    }
    const avatarHtml=`<div style="width:18px;height:18px;border-radius:50%;background:${avatarColor}22;color:${avatarColor};display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:7px;flex-shrink:0;">${getInitials(p.name)}</div>`;
    return `<div class="presence-chip" style="border-color:${border};background:${bg};color:${color};">
      ${avatarHtml}
      <span>${p.name}</span>
      <span class="chip-flag ${isFlagged?'on':''}" title="Marquer un doute" onclick="toggleFlag('${p.discord_id}',event)">⚑</span>
    </div>`;
  };

  const freeHtml=free.map(p=>makeChip(p,true,null)).join('');
  let assignedHtml='';
  if(assigned.length){
    assignedHtml=`<div style="width:100%;height:1px;background:var(--border2);margin:8px 0 6px;position:relative;">
      <span style="position:absolute;left:50%;transform:translateX(-50%) translateY(-50%);background:var(--bg2);padding:0 8px;font-size:10px;color:var(--text3);white-space:nowrap;">en comp</span>
    </div>`+assigned.map(p=>{
      const r=getAssignedRole(p.discord_id);
      return makeChip(p,false,r);
    }).join('');
  }
  document.getElementById('presence-list').innerHTML=freeHtml+assignedHtml;
  const presentCount=Object.values(presence).filter(v=>v==='present').length;
  const pc=document.getElementById('present-count');
  if(pc) pc.textContent=presentCount+' présents'+(flagged.size?` (${flagged.size} ⚑)`:'');
}

async function toggleFlag(discordId, e){
  e.stopPropagation();
  if(!currentEventId) return;
  if(flagged.has(discordId)){
    flagged.delete(discordId);
    await sb.from('flagged').delete().eq('event_id', currentEventId).eq('discord_id', discordId);
  } else {
    flagged.add(discordId);
    await sb.from('flagged').insert({ event_id: currentEventId, discord_id: discordId });
  }
  renderPresence();
}

function renderComp(){
  const zone=document.getElementById('comp-zone');
  if(!currentComp){ zone.innerHTML=''; return; }
  const groups={};
  Object.entries(currentComp.slots||{}).forEach(([rid,slotDef])=>{
    const r=roleDef(rid); if(!r) return;
    const cls=r.cls||'other';
    if(!groups[cls]) groups[cls]=[];
    groups[cls].push({rid, count:slotDef.count, strict:slotDef.strict});
  });
  zone.innerHTML=CLASSES_DEF.filter(cls=>groups[cls.id]).map(cls=>{
    const roles=groups[cls.id].sort((a,b)=>ROLES_DEF.findIndex(r=>r.id===a.rid)-ROLES_DEF.findIndex(r=>r.id===b.rid));
    return `<div class="role-block">
      <div class="role-block-header">
        <span class="role-block-label" style="color:${cls.color}">${cls.label}</span>
      </div>
      ${roles.map(({rid,count,strict})=>{
        const r=roleDef(rid)||{label:rid,color:'#aaa',unique:false};
        const assigned=assignments[rid]||[];
        const nSlots=visibleSlots(rid);
        const weapCnt={};
        assigned.forEach(a=>{if(a.weapon){const k=a.weapon.toLowerCase();weapCnt[k]=(weapCnt[k]||0)+1;}});
        const overCount=assigned.length>count;
        let html=`<div style="font-size:11px;font-weight:600;color:${r.color};letter-spacing:.04em;margin:6px 0 3px;text-transform:uppercase;display:flex;align-items:center;gap:6px;">
          ${r.label}
          <span style="color:${overCount?'#f04747':'var(--text3)'};font-weight:400;">${assigned.length}/${count}${overCount?'<span title="Dépassement" style="margin-left:2px;">⚠</span>':''}</span>
        </div>`;
        for(let i=0;i<nSlots;i++){
          const a=assigned[i];
          if(a){
            const p=players.find(pl=>pl.discord_id===a.playerId);
            const isDup=r.unique&&a.weapon&&(weapCnt[a.weapon.toLowerCase()]||0)>1;
            html+=`<div class="player-slot">
              ${p?avatarEl(p.name,p.color||'#5865F2',22):'<div style="width:22px;height:22px;border-radius:50%;background:var(--bg3);flex-shrink:0;"></div>'}
              <span style="flex:1;font-weight:500;color:${r.color}">${p?p.name:'?'}</span>
              <span class="slot-weapon" style="color:${isDup?'#f04747':'var(--text3)'};">${a.weapon||'—'}${isDup?' ⚠':''}</span>
              <button class="btn btn-icon btn-danger" onclick="removeAssign('${rid}',${i})" style="margin-left:4px;font-size:10px;">✕</button>
            </div>`;
          } else {
            html+=`<div class="empty-slot" onclick="openFloatingAssign(event,'${rid}')">+ Assigner</div>`;
          }
        }
        return html;
      }).join('')}
    </div>`;
  }).join('');
}

async function removeAssign(rid, idx){
  if(assignments[rid]) assignments[rid].splice(idx,1);
  if(currentEventId){
    // Resync depuis BDD pour être propre
    const playerId = assignments[rid]?.[idx]?.playerId;
    if(playerId) await sb.from('assignments').delete().eq('event_id', currentEventId).eq('role_id', rid).eq('discord_id', playerId);
  }
  renderComp(); renderPresence();
}

function loadTemplate(id){
  const c=comps.find(x=>x.id===parseInt(id));
  if(c){ currentComp=JSON.parse(JSON.stringify(c)); assignments={}; renderComp(); }
}
function updateCompSelect(){
  const sel=document.getElementById('comp-select');
  if(!sel) return;
  sel.innerHTML='<option value="">-- Template --</option>'+comps.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
}

function addTempRole(){
  tempRoles.push({id:'temp-'+Date.now(), label:'Rôle temporaire'});
  renderTempZone();
}
function renderTempZone(){
  const z=document.getElementById('temp-zone');
  if(!tempRoles.length){ z.innerHTML=''; return; }
  z.innerHTML=`<div class="temp-section">
    <div class="temp-section-title">Rôles temporaires</div>
    ${tempRoles.map(tr=>{
      const asgns=tempAssignments[tr.id]||[];
      return `<div class="temp-role-block">
        <div class="temp-role-header">
          <input class="temp-name-input" value="${tr.label}" oninput="renameTempRole('${tr.id}',this.value)">
          <button class="btn btn-danger btn-sm" onclick="deleteTempRole('${tr.id}')">🗑</button>
        </div>
        ${asgns.map((asgn,i)=>{
          const p=players.find(pl=>pl.discord_id===asgn.playerId);
          return p?`<div class="player-slot">
            ${avatarEl(p.name,p.color||'#5865F2',24)}
            <span style="font-weight:500;flex:1;">${p.name}</span>
            <span class="slot-weapon" style="color:var(--text3);">${asgn.weapon||'—'}</span>
            <button class="btn btn-danger btn-icon" onclick="removeTempAssign('${tr.id}',${i})" style="font-size:10px;">✕</button>
          </div>`:'';
        }).join('')}
        <div class="empty-slot" onclick="openTempAssign('${tr.id}')">+ Assigner un joueur</div>
      </div>`;
    }).join('')}
  </div>`;
}
function renameTempRole(id,label){ const t=tempRoles.find(r=>r.id===id); if(t) t.label=label; }
function deleteTempRole(id){ tempRoles=tempRoles.filter(r=>r.id!==id); delete tempAssignments[id]; renderTempZone(); renderPresence(); }
function removeTempAssign(id,idx){
  if(!tempAssignments[id]) return;
  tempAssignments[id].splice(idx,1);
  if(!tempAssignments[id].length) delete tempAssignments[id];
  renderTempZone(); renderPresence();
}

// ============================================================
// FLOATING ASSIGN
// ============================================================
function openFloatingAssign(e, rid){
  pendingRoleId=rid; pendingPlayerId=null; pendingIsTemp=false;
  const r=roleDef(rid)||{label:rid,color:'#aaa',unique:false};
  _showFloating(e, rid, r, false);
}
function openTempAssign(tid){
  pendingTempId=tid; pendingPlayerId=null; pendingIsTemp=true;
  const tr=tempRoles.find(t=>t.id===tid)||{label:''};
  const fakeEvt={currentTarget:{getBoundingClientRect:()=>({right:window.innerWidth/2,top:window.innerHeight/3})}};
  _showFloating(fakeEvt, tid, {label:tr.label,color:'#8b92a8',unique:false}, true);
}
function _showFloating(e, roleId, r, isTemp){
  const already=isTemp?(tempAssignments[roleId]||[]).map(a=>a.playerId):(assignments[roleId]||[]).map(a=>a.playerId);
  let candidates=isTemp?[...players]:players.filter(p=>p.roles.includes(roleId));
  candidates=[...candidates].sort((a,b)=>{
    const o={present:0,maybe:1,none:2,absent:3};
    const pa=o[presence[a.discord_id]||'none'], pb=o[presence[b.discord_id]||'none'];
    if(pa!==pb) return pa-pb;
    return a.name.localeCompare(b.name);
  });
  const stIco=(did)=>{const s=presence[did]||'none';return s==='present'?'🟢':s==='maybe'?'🟡':s==='absent'?'🔴':'⚫';};
  const modal=document.getElementById('modal-assign');
  let html=`<div style="color:${r.color};font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;letter-spacing:.05em;margin-bottom:10px;">${r.label}</div>`;
  html+=`<div style="max-height:300px;overflow-y:auto;">`;
  candidates.forEach(p=>{
    const isAlready=already.includes(p.discord_id);
    const usedIn=Object.entries(assignments).find(([rid2,arr])=>rid2!==roleId&&arr.some(a=>a.playerId===p.discord_id));
    html+=`<div class="modal-player-opt ${isAlready?'dimmed':''}" data-pid="${p.discord_id}">
      ${avatarEl(p.name,p.color||'#5865F2',28)}
      <div style="flex:1;">
        <div style="font-weight:500;">${p.name}${flagged.has(p.discord_id)?'<span style="color:#f0c040;font-size:10px;margin-left:4px;">⚑</span>':''}</div>
        <div style="font-size:11px;color:var(--text3);">${stIco(p.discord_id)} ${usedIn?'→ déjà en '+(roleDef(usedIn[0])||{label:usedIn[0]}).label:'disponible'}</div>
      </div>
      ${isAlready?'<span style="font-size:11px;color:var(--text3);">assigné</span>':''}
    </div>`;
  });
  html+=`</div>
    <input id="fa-weapon" class="weapon-input" placeholder="Arme (ex: Permafrost, Hache...)" style="margin-top:10px;display:none;">
    <div id="fa-dup-warn" class="dup-warn" style="display:none;"></div>
    <div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end;">
      <button class="btn btn-sm" onclick="closeFloating()">Fermer</button>
      <button class="btn btn-primary btn-sm" onclick="confirmFloating()">Confirmer</button>
    </div>`;
  modal.innerHTML=html;
  modal.querySelectorAll('.modal-player-opt:not(.dimmed)').forEach(el=>{
    el.onclick=()=>{
      const wasSelected=el.classList.contains('selected');
      modal.querySelectorAll('.modal-player-opt').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      pendingPlayerId=el.dataset.pid;
      const w=document.getElementById('fa-weapon');
      w.style.display='block'; w.focus();
      if(wasSelected) setTimeout(confirmFloating,10);
    };
  });
  modal.style.display='block';
  const rect=e.currentTarget.getBoundingClientRect();
  modal.style.left=Math.min(rect.right+10,window.innerWidth-370)+'px';
  modal.style.top=Math.min(rect.top,window.innerHeight-460)+'px';
}

async function confirmFloating(){
  if(!pendingPlayerId) return;
  const weapon=(document.getElementById('fa-weapon')||{}).value?.trim()||'';
  if(pendingIsTemp){
    if(!tempAssignments[pendingTempId]) tempAssignments[pendingTempId]=[];
    if(!tempAssignments[pendingTempId].some(a=>a.playerId===pendingPlayerId)){
      tempAssignments[pendingTempId].push({playerId:pendingPlayerId,weapon});
    }
    closeFloating(); renderTempZone(); renderPresence(); return;
  }
  // Enlève le joueur des autres rôles
  Object.keys(assignments).forEach(rid=>{
    if(rid!==pendingRoleId) assignments[rid]=(assignments[rid]||[]).filter(a=>a.playerId!==pendingPlayerId);
  });
  if(!assignments[pendingRoleId]) assignments[pendingRoleId]=[];
  assignments[pendingRoleId].push({playerId:pendingPlayerId,weapon});

  // Sauvegarde en BDD si on a un event actif
  if(currentEventId){
    // Supprime les anciennes assignations de ce joueur
    await sb.from('assignments').delete().eq('event_id', currentEventId).eq('discord_id', pendingPlayerId);
    // Insère la nouvelle
    await sb.from('assignments').insert({
      event_id: currentEventId,
      role_id: pendingRoleId,
      discord_id: pendingPlayerId,
      weapon: weapon
    });
  }
  closeFloating(); renderComp(); renderPresence();
}
function closeFloating(){ document.getElementById('modal-assign').style.display='none'; }
document.addEventListener('click',e=>{
  const m=document.getElementById('modal-assign');
  if(m.style.display!=='none'&&!m.contains(e.target)&&!e.target.closest('.empty-slot')&&!e.target.closest('.temp-role-block')) closeFloating();
});
async function generateEventImage(eventId) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 500 });
  await page.goto(
    `${process.env.WEBAPP_URL}?event_id=${eventId}&render=true`,
    { waitUntil: 'networkidle0', timeout: 15000 }
  );
  // Attend que le chargement soit fini
  await page.waitForSelector('#presence-list', { timeout: 10000 });
  const screenshot = await page.screenshot({ type: 'png', fullPage: false });
  await browser.close();
  return screenshot;
}

// ============================================================
// VIEW: COMP EDITOR
// ============================================================
function renderCompEditor(){
  document.getElementById('comp-tabs').innerHTML=comps.map((c,i)=>`
    <button class="btn btn-sm ${i===editCompIdx?'active':''}" onclick="selectComp(${i})">${c.name}</button>`).join('');
  document.getElementById('comp-name-input').value=editingComp?.name||'';
  let html='';
  CLASSES_DEF.forEach(cls=>{
    const classRoles=ROLES_DEF.filter(r=>r.cls===cls.id);
    if(!classRoles.length) return;
    html+=`<div class="comp-class-card">
      <div class="comp-class-title" style="color:${cls.color}">${cls.label}</div>
      <div class="comp-roles-grid">`;
    classRoles.forEach(r=>{
      const slotDef=(editingComp?.slots||{})[r.id]||{count:0,strict:false};
      const qty=slotDef.count||0;
      const strict=slotDef.strict||false;
      html+=`<div class="comp-role-card">
        <div style="display:flex;width:100%;justify-content:space-between;align-items:center;">
          <span class="comp-role-label" style="color:${r.color}" title="${r.label}">${r.label}</span>
          ${r.is_unique?`<span class="comp-role-unique">uniq</span>`:''}
        </div>
        <div style="display:flex;gap:12px;width:100%;align-items:center;">
          <div class="qty-pill">
            <button class="dec" onclick="changeQty('${r.id}',-1)">−</button>
            <span class="qty-val" id="qty-${r.id}">${qty}</span>
            <button class="inc" onclick="changeQty('${r.id}',1)">+</button>
          </div>
          <label class="max-toggle ${strict?'on':''}" title="Strict : n'affiche que N slots">
            <input type="checkbox" ${strict?'checked':''} onchange="toggleStrict('${r.id}',this.checked)" style="margin:0;">
            MAX
          </label>
        </div>
      </div>`;
    });
    html+=`</div></div>`;
  });
  document.getElementById('comp-editor').innerHTML=html||'<div style="color:var(--text3);padding:20px;">Aucun rôle défini.</div>';
}
function changeQty(rid, delta){
  if(!editingComp.slots) editingComp.slots={};
  const cur=editingComp.slots[rid]||{count:0,strict:false};
  const newCount=Math.max(0,(cur.count||0)+delta);
  editingComp.slots[rid]={count:newCount,strict:cur.strict||false};
  const valEl=document.getElementById('qty-'+rid);
  if(valEl) valEl.textContent=newCount;
}
function toggleStrict(rid, val){
  if(!editingComp.slots) editingComp.slots={};
  const cur=editingComp.slots[rid]||{count:0,strict:false};
  editingComp.slots[rid]={count:cur.count||0,strict:val};
  const lbl=document.querySelector(`[onchange="toggleStrict('${rid}',this.checked)"]`)?.closest('.max-toggle');
  if(lbl) lbl.classList.toggle('on',val);
}
function selectComp(idx){ editCompIdx=idx; editingComp=JSON.parse(JSON.stringify(comps[idx])); renderCompEditor(); }

async function saveComp(){
  editingComp.name=document.getElementById('comp-name-input').value||'Comp sans nom';
  const { data, error } = await sb.from('comps').upsert({ id: editingComp.id||undefined, name: editingComp.name, slots: editingComp.slots||{} }).select().single();
  if(error){ alert('Erreur: '+error.message); return; }
  comps[editCompIdx] = data;
  editingComp = JSON.parse(JSON.stringify(data));
  updateCompSelect(); renderCompEditor();
  const btn=document.querySelector('[onclick="saveComp()"]');
  if(btn){const o=btn.textContent;btn.textContent='✓ Sauvegardé';setTimeout(()=>btn.textContent=o,1500);}
}
async function newComp(){
  const { data } = await sb.from('comps').insert({ name: 'Nouvelle comp', slots: {} }).select().single();
  comps.push(data); editCompIdx=comps.length-1;
  editingComp=JSON.parse(JSON.stringify(data));
  updateCompSelect(); renderCompEditor();
}
async function deleteCurrentComp(){
  if(comps.length<=1){alert('Au moins une comp est requise.');return;}
  if(!confirm('Supprimer ?')) return;
  await sb.from('comps').delete().eq('id', comps[editCompIdx].id);
  comps.splice(editCompIdx,1); editCompIdx=0;
  editingComp=JSON.parse(JSON.stringify(comps[0]));
  updateCompSelect(); renderCompEditor();
}

// ============================================================
// VIEW: CLASSES & ROLES
// ============================================================
let dragSrcIdx=null, dragSrcType=null;
function initDrag(container, type){
  const rows=container.querySelectorAll('[data-drag-idx]');
  rows.forEach(row=>{
    row.addEventListener('dragstart',e=>{
      dragSrcIdx=parseInt(row.dataset.dragIdx);
      dragSrcType=type;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
    });
    row.addEventListener('dragend',()=>row.classList.remove('dragging'));
    row.addEventListener('dragover',e=>{
      e.preventDefault();
      container.querySelectorAll('[data-drag-idx]').forEach(r=>r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });
    row.addEventListener('dragleave',()=>row.classList.remove('drag-over'));
    row.addEventListener('drop',e=>{
      e.preventDefault();
      row.classList.remove('drag-over');
      const targetIdx=parseInt(row.dataset.dragIdx);
      if(dragSrcType!==type||dragSrcIdx===targetIdx) return;
      const arr=type==='class'?CLASSES_DEF:ROLES_DEF;
      const [moved]=arr.splice(dragSrcIdx,1);
      arr.splice(targetIdx,0,moved);
      // Met à jour sort_order en BDD
      const table=type==='class'?'classes_def':'roles_def';
      arr.forEach((item,i)=>{ sb.from(table).update({sort_order:i}).eq('id',item.id); });
      renderClassesEditor();
      if(document.getElementById('view-event').classList.contains('active')) renderEvent();
      if(document.getElementById('view-comps').classList.contains('active')) renderCompEditor();
    });
  });
}
function renderClassesEditor(){
  const cl=document.getElementById('classes-list');
  cl.innerHTML=CLASSES_DEF.map((c,i)=>`
    <div class="cls-row" draggable="true" data-drag-idx="${i}">
      <span style="color:var(--text3);font-size:12px;cursor:grab;margin-right:2px;">⠿</span>
      <div style="width:10px;height:10px;border-radius:50%;background:${c.color};flex-shrink:0;"></div>
      <span style="flex:1;font-weight:500;">${c.label}</span>
      <input type="color" value="${c.color}" onchange="updateClassColor('${c.id}',this.value)">
      <button class="btn btn-danger btn-icon" onclick="deleteClass('${c.id}')">✕</button>
    </div>`).join('');
  initDrag(cl,'class');
  const rl=document.getElementById('roles-list');
  rl.innerHTML=ROLES_DEF.map((r,i)=>{
    const cls=classDef(r.cls)||{color:'#aaa',label:r.cls};
    return `<div class="role-row-editor" draggable="true" data-drag-idx="${i}">
      <span style="color:var(--text3);font-size:12px;cursor:grab;margin-right:2px;">⠿</span>
      <div style="width:10px;height:10px;border-radius:50%;background:${r.color};flex-shrink:0;"></div>
      <span style="flex:1;color:${r.color};font-weight:500;">${r.label}</span>
      <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:${cls.color}22;color:${cls.color};font-weight:500;">${cls.label}</span>
      <button class="btn btn-danger btn-icon" onclick="deleteRole('${r.id}')">✕</button>
    </div>`;
  }).join('');
  initDrag(rl,'role');
  document.getElementById('new-role-class').innerHTML=CLASSES_DEF.map(c=>`<option value="${c.id}">${c.label}</option>`).join('');
}

async function updateClassColor(id,color){
  const c=CLASSES_DEF.find(cc=>cc.id===id);
  if(c) c.color=color;
  ROLES_DEF.filter(r=>r.cls===id).forEach(r=>r.color=color);
  await sb.from('classes_def').update({color}).eq('id',id);
  await sb.from('roles_def').update({color}).eq('cls',id);
  renderClassesEditor();
}
async function addClass(){
  const name=document.getElementById('new-class-name').value.trim();
  const color=document.getElementById('new-class-color').value;
  if(!name) return;
  const id=name.toLowerCase().replace(/\s+/g,'-');
  if(CLASSES_DEF.find(c=>c.id===id)){alert('Classe déjà existante');return;}
  const sort_order=CLASSES_DEF.length;
  const { data } = await sb.from('classes_def').insert({id,label:name,color,sort_order}).select().single();
  CLASSES_DEF.push(data);
  document.getElementById('new-class-name').value='';
  renderClassesEditor();
  if(document.getElementById('view-comps').classList.contains('active')) renderCompEditor();
}
async function deleteClass(id){
  if(ROLES_DEF.some(r=>r.cls===id)){alert('Supprimez d\'abord les rôles de cette classe.');return;}
  await sb.from('classes_def').delete().eq('id',id);
  CLASSES_DEF=CLASSES_DEF.filter(c=>c.id!==id);a
  renderClassesEditor();
}
async function addRole(){
  const name=document.getElementById('new-role-name').value.trim();
  const clsId=document.getElementById('new-role-class').value;
  if(!name||!clsId) return;
  const id=name.toLowerCase().replace(/\s+/g,'-');
  if(ROLES_DEF.find(r=>r.id===id)){alert('Rôle déjà existant');return;}
  const cls=classDef(clsId)||{color:'#aaa'};
  const sort_order=ROLES_DEF.length;
  const { data } = await sb.from('roles_def').insert({id,label:name,color:cls.color,cls:clsId,is_unique:false,sort_order}).select().single();
  ROLES_DEF.push(data);
  document.getElementById('new-role-name').value='';
  renderClassesEditor();
  if(document.getElementById('view-comps').classList.contains('active')) renderCompEditor();
}
async function deleteRole(id){
  await sb.from('roles_def').delete().eq('id',id);
  ROLES_DEF=ROLES_DEF.filter(r=>r.id!==id);
  renderClassesEditor();
}
async function saveClassesRoles(){
  const btn=document.querySelector('[onclick="saveClassesRoles()"]');
  if(btn){const o=btn.textContent;btn.textContent='✓ Sauvegardé';setTimeout(()=>btn.textContent=o,1500);}
}

// ============================================================
// INIT
// ============================================================
init();
</script>
</body>
</html>