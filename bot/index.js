// ============================================================
// GÉNÈRE L'EMBED COMPLET D'UN EVENT (version améliorée)
// ============================================================
async function buildEventEmbed(eventId) {
  const [
    { data: event },
    { data: players },
    { data: presData },
    { data: asgData },
    { data: classes },
    { data: roles },
  ] = await Promise.all([
    supabase.from('events').select('*').eq('id', eventId).single(),
    supabase.from('players').select('*'),
    supabase.from('presences').select('*').eq('event_id', eventId),
    supabase.from('assignments').select('*').eq('event_id', eventId),
    supabase.from('classes_def').select('*').order('sort_order'),
    supabase.from('roles_def').select('*').order('sort_order'),
  ]);

  if (!event) return null;

  // ── Préparation des données ──
  const presence = {};
  (presData || []).forEach(p => { presence[p.discord_id] = p.status; });

  const assignments = {};
  (asgData || []).forEach(a => {
    if (!assignments[a.role_id]) assignments[a.role_id] = [];
    assignments[a.role_id].push({ 
      discordId: a.discord_id, 
      weapon: a.weapon || '' 
    });
  });

  const assignedIds = new Set((asgData || []).map(a => a.discord_id));

  const stIco = (did) => {
    const s = presence[did] || 'none';
    return s === 'present' ? '🟢' : s === 'maybe' ? '🟡' : s === 'absent' ? '❌' : '⚫';
  };

  const sortByStatus = (a, b) => {
    const o = { present: 0, maybe: 1, none: 2, absent: 3 };
    return (o[presence[a.discord_id] || 'none']) - (o[presence[b.discord_id] || 'none']);
  };

  const free = (players || []).filter(p => !assignedIds.has(p.discord_id)).sort(sortByStatus);
  const assigned = (players || []).filter(p => assignedIds.has(p.discord_id)).sort(sortByStatus);

  const freeStr = free.length
    ? free.map(p => `${stIco(p.discord_id)}${p.name}`).join(' ')
    : '_aucun_';

  const assignedStr = assigned.length
    ? assigned.map(p => `${stIco(p.discord_id)}${p.name}`).join(' ')
    : '';

  let presenceLine = freeStr;
  if (assignedStr) {
    presenceLine += '\n─────────────────────────\n' + assignedStr;
  }

  const counts = { present: 0, maybe: 0, absent: 0 };
  (presData || []).forEach(p => {
    if (counts[p.status] !== undefined) counts[p.status]++;
  });
  const countStr = `🟢 ${counts.present} 🟡 ${counts.maybe} ❌ ${counts.absent}`;

  // ── Construction des fields par classe ──
  const fields = [];

  if (event.comp_id) {
    const { data: comp } = await supabase
      .from('comps')
      .select('*')
      .eq('id', event.comp_id)
      .single();

    if (comp && comp.slots) {
      const slots = comp.slots;

      (classes || []).forEach(cls => {
        const clsRoles = (roles || []).filter(r => 
          r.cls === cls.id && 
          slots[r.id] && 
          slots[r.id].count > 0
        );

        if (!clsRoles.length) return;

        let classValue = '';

        clsRoles.forEach(r => {
          const slotDef = slots[r.id];
          const count = slotDef?.count || 0;
          const asgn = assignments[r.id] || [];

          classValue += `**${r.label}** (${asgn.length}/${count})\n`;

          if (asgn.length === 0) {
            classValue += `> —\n`;
          } else {
            asgn.forEach(a => {
              const p = (players || []).find(pl => pl.discord_id === a.discordId);
              const name = p ? p.name : '?';
              const weapon = a.weapon ? ` — ${a.weapon}` : '';
              classValue += `> ${name}${weapon}\n`;
            });
          }
        });

        // On ajoute un field par classe
        fields.push({
          name: `🎯 ${cls.label}`,
          value: classValue.trim() || '—',
          inline: true   // ← tu peux mettre false si tu préfères une colonne par classe
        });
      });
    }
  }

  // Fallback si pas de composition
  if (fields.length === 0) {
    fields.push({
      name: 'Composition',
      value: '_Aucune composition chargée_',
      inline: false
    });
  }

  // ── Création de l'embed ──
  const embed = new EmbedBuilder()
    .setTitle(`⚔️ ${event.title}`)
    .setColor(0x5865F2)
    .setDescription(event.event_date ? `📅 ${event.event_date}` : null)
    .addFields(
      { 
        name: `📋 Présences — ${countStr}`, 
        value: presenceLine.slice(0, 1024) || '—',
        inline: false 
      },
      ...fields   // ← ici on déploie tous les fields de classes
    )
    .setFooter({ text: `Event ID: ${eventId}` })
    .setTimestamp();

  return embed;
}