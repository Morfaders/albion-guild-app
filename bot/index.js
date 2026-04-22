if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ]
});

const commands = [
  { name: 'ping', description: 'Vérifie que le bot fonctionne' },
  {
    name: 'event',
    description: 'Crée un événement actif',
    options: [
      { name: 'titre', description: "Titre de l'événement", type: 3, required: true },
      { name: 'date', description: 'Date et heure (ex: Vendredi 20h30)', type: 3, required: true },
      { name: 'comp', description: 'ID de la composition', type: 4, required: false }
    ]
  },
  { name: 'profil', description: 'Voir ton profil de joueur' }
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Enregistrement des slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands enregistrees !');
  } catch(err) {
    console.error('Erreur enregistrement:', err);
  }
}

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

  if(!event) return null;

  const presence = {};
  (presData||[]).forEach(p => presence[p.discord_id] = p.status);

  const assignments = {};
  (asgData||[]).forEach(a => {
    if(!assignments[a.role_id]) assignments[a.role_id] = [];
    assignments[a.role_id].push({ discordId: a.discord_id, weapon: a.weapon||'' });
  });

  const assignedIds = new Set((asgData||[]).map(a => a.discord_id));

  const stIco = (id) => {
    const s = presence[id];
    return s==='present'?'🟢':s==='maybe'?'🟡':s==='absent'?'❌':null;
  };

  const free = (players||[]).filter(p => !assignedIds.has(p.discord_id) && presence[p.discord_id]).sort((a,b) => {
    const o = { present:0, maybe:1, absent:2 };
    return ((o[presence[a.discord_id]]??9) - (o[presence[b.discord_id]]??9)) || a.name.localeCompare(b.name);
  });
  const assigned = (players||[]).filter(p => assignedIds.has(p.discord_id) && presence[p.discord_id]).sort((a,b) => a.name.localeCompare(b.name));

  const counts = { present:0, maybe:0, absent:0 };
  (presData||[]).forEach(p => { if(counts[p.status]!==undefined) counts[p.status]++; });
  const countStr = `🟢 ${counts.present}  🟡 ${counts.maybe}  ❌ ${counts.absent}`;

  let presenceStr = '';
  if(free.length > 0) presenceStr += free.map(p => `${stIco(p.discord_id)} ${p.name}`).join('  ');
  if(assigned.length > 0) {
    if(presenceStr) presenceStr += '\n── en comp ──\n';
    presenceStr += assigned.map(p => `${stIco(p.discord_id)} ${p.name}`).join('  ');
  }
  if(!presenceStr) presenceStr = '_Aucune réponse pour l\'instant_';

  let compStr = '';
  if(event.comp_id) {
    const { data: comp } = await supabase.from('comps').select('*').eq('id', event.comp_id).single();
    if(comp && comp.slots) {
      const activeRoles = (roles||[]).filter(r => comp.slots[r.id] && comp.slots[r.id].count > 0);
      const roleColWidth = Math.max(...activeRoles.map(r => r.label.length), 4);
      const allAssignedPlayerNames = Object.values(assignments)
        .flat()
        .map(a => { const p = (players||[]).find(pl => pl.discord_id === a.discordId); return p ? p.name : '?'; });
      const nameColWidth = Math.max(...allAssignedPlayerNames.map(n => n.length), 4);

      (classes||[]).forEach(cls => {
        const clsRoles = (roles||[]).filter(r => r.cls === cls.id && comp.slots[r.id] && comp.slots[r.id].count > 0);
        if(!clsRoles.length) return;
        const clsEmoji = classColorEmoji(cls.color);
        clsRoles.forEach(r => {
          const count = comp.slots[r.id].count || 0;
          const asgn = assignments[r.id] || [];
          const totalLines = Math.max(count, asgn.length);
          const roleLabel = r.label.padEnd(roleColWidth);
          for(let i = 0; i < totalLines; i++) {
            const a = asgn[i];
            const label = roleLabel;
            if(a) {
              const p = (players||[]).find(pl => pl.discord_id === a.discordId);
              const name = (p ? p.name : '?').padEnd(nameColWidth);
              const weapon = a.weapon ? ` — ${a.weapon}` : '';
              compStr += `${clsEmoji} \`${label}  ${name}${weapon}\`\n`;
            } else {
              compStr += `${clsEmoji} \`${label}  ${'—'.padEnd(nameColWidth)}\`\n`;
            }
          }
        });
      });
    }
  }
  if(!compStr) compStr = '_Aucune composition chargée_';

  const embed = new EmbedBuilder()
    .setTitle(`⚔️ ${event.title}`)
    .setColor(0x5865F2)
    .addFields(
      { name: `Présences — ${countStr}`, value: presenceStr.slice(0, 1024), inline: false },
      { name: 'Composition', value: compStr.slice(0, 1024) || '—', inline: false }
    );
  if(event.event_date) embed.setDescription(`📅 ${event.event_date}`);
  embed.setFooter({ text: `Event ID: ${eventId}` });
  return embed;
}

function classColorEmoji(hex) {
  if(!hex) return '⬜';
  const h = hex.replace('#','').toLowerCase();
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  const lightness = (max+min)/2/255;
  if(lightness < 0.15) return '⬛';
  if(lightness > 0.85) return '⬜';
  if(max === min) return '🟫';
  let hue = 0;
  if(max===r) hue = 60*((g-b)/(max-min));
  else if(max===g) hue = 60*(2+(b-r)/(max-min));
  else hue = 60*(4+(r-g)/(max-min));
  if(hue<0) hue+=360;
  if(hue<25)  return '🔴';
  if(hue<45)  return '🟠';
  if(hue<70)  return '🟡';
  if(hue<150) return '🟢';
  if(hue<260) return '🔵';
  if(hue<330) return '🟣';
  return '🔴';
}

async function updateEventMessage(eventId) {
  const { data: event } = await supabase.from('events').select('discord_message_id, discord_channel_id').eq('id', eventId).single();
  if(!event?.discord_message_id) return;
  try {
    const embed = await buildEventEmbed(eventId);
    if(!embed) return;
    const channel = await client.channels.fetch(event.discord_channel_id);
    const msg = await channel.messages.fetch(event.discord_message_id);
    await msg.edit({ embeds: [embed] });
  } catch(err) {
    console.error('Erreur update message:', err.message);
  }
}

// ─── NOUVEAU : DM privé pour utilisateur inconnu ──────────────────────────────
async function sendUnknownUserDM(discordUser, eventId) {
  try {
    const webAppUrl = process.env.WEBAPP_URL || 'https://ton-app.com';
    // Lien direct vers la web app avec discord_id pré-rempli ET new_player=1 pour ouvrir la modale
    const createProfileUrl = `${webAppUrl}?event_id=${eventId}&new_player=1&discord_id=${discordUser.id}`;

    const embed = new EmbedBuilder()
      .setTitle('👋 Bienvenue dans la guilde !')
      .setColor(0xf0c040)
      .setDescription(
        `Tu as répondu à un événement, mais **tu n'as pas encore de fiche joueur** dans notre système.\n\n` +
        `Pour que le raid lead puisse t'inclure dans la composition, crée ta fiche en 30 secondes :`
      )
      .addFields(
        {
          name: '📋 Ce qu\'il faut faire',
          value:
            '**1.** Clique sur le bouton ci-dessous\n' +
            '**2.** Entre ton pseudo en jeu\n' +
            '**3.** Coche les rôles que tu joues\n' +
            '**4.** Clique sur **Ajouter** — c\'est tout !',
          inline: false
        },
        {
          name: '🔗 Ton ID Discord',
          value: `\`${discordUser.id}\` *(déjà pré-rempli dans le formulaire)*`,
          inline: false
        }
      )
      .setFooter({ text: 'Ce message t\'est envoyé uniquement parce que ton Discord ID n\'est pas encore lié à un profil.' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('✏️ Créer ma fiche joueur')
        .setStyle(ButtonStyle.Link)
        .setURL(createProfileUrl)
    );

    await discordUser.send({ embeds: [embed], components: [row] });
    console.log(`DM envoyé à ${discordUser.tag} (${discordUser.id})`);
  } catch(err) {
    // L'utilisateur a peut-être les DMs désactivés
    console.warn(`Impossible d'envoyer un DM à ${discordUser.tag}: ${err.message}`);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

client.once('ready', async () => {
  console.log(`Bot connecte : ${client.user.tag}`);
  await registerCommands();

  supabase.channel('bot-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assignments' }, async (p) => { if(p.new?.event_id) await updateEventMessage(p.new.event_id); })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'assignments' }, async (p) => { if(p.old?.event_id) await updateEventMessage(p.old.event_id); })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'presences' }, async (p) => { if(p.new?.event_id) await updateEventMessage(p.new.event_id); })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'presences' }, async (p) => { if(p.new?.event_id) await updateEventMessage(p.new.event_id); })
    .subscribe();
});

client.on('interactionCreate', async interaction => {

  if(interaction.isChatInputCommand()) {

    if(interaction.commandName === 'ping') {
      return interaction.reply({ content: 'Pong ! Le bot fonctionne.', ephemeral: true });
    }

    if(interaction.commandName === 'profil') {
      const discordId = interaction.user.id;
      const { data: player } = await supabase.from('players').select('*').eq('discord_id', discordId).single();
      if(player) {
        return interaction.reply({ content: `👤 **${player.name}**\nRoles : ${player.roles.length > 0 ? player.roles.join(', ') : 'aucun role defini'}`, ephemeral: true });
      } else {
        const webAppUrl = process.env.WEBAPP_URL || 'https://ton-app.com';
        const createProfileUrl = `${webAppUrl}?new_player=1&discord_id=${discordId}`;
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('✏️ Créer ma fiche').setStyle(ButtonStyle.Link).setURL(createProfileUrl)
        );
        return interaction.reply({ content: `❌ Tu n'as pas encore de profil.\nClique ci-dessous pour en créer un (ton ID Discord sera pré-rempli).`, components: [row], ephemeral: true });
      }
    }

    if(interaction.commandName === 'event') {
      const titre = interaction.options.getString('titre');
      const date = interaction.options.getString('date');
      const compId = interaction.options.getInteger('comp') ?? 1;

      const { data: event, error } = await supabase.from('events').insert({ title: titre, event_date: date, comp_id: compId }).select().single();
      if(error) return interaction.reply({ content: 'Erreur lors de la creation.', ephemeral: true });

      const embed = await buildEventEmbed(event.id);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`present_${event.id}`).setLabel('✓ Je suis là').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`maybe_${event.id}`).setLabel('? Peut-être').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`absent_${event.id}`).setLabel('✕ Absent').setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setLabel('🛠 Gérer la comp')
          .setStyle(ButtonStyle.Link)
          .setURL(`${process.env.WEBAPP_URL}?event_id=${event.id}`)
      );

      const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
      await supabase.from('events').update({ discord_message_id: msg.id, discord_channel_id: msg.channelId }).eq('id', event.id);
    }
  }

  if(interaction.isButton()) {
    const parts = interaction.customId.split('_');
    const action = parts[0];
    const eventId = parseInt(parts[1]);
    if(!['present', 'maybe', 'absent'].includes(action)) return;

    const discordId = interaction.user.id;
    await interaction.deferUpdate();

    // ─── NOUVEAU : vérifier si le joueur existe ───────────────────────────────
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id')
      .eq('discord_id', discordId)
      .maybeSingle();

    if(!existingPlayer) {
      // Enregistrer quand même la présence pour le comptage
      await supabase.from('presences').upsert({ event_id: eventId, discord_id: discordId, status: action });
      // Envoyer un DM pour créer sa fiche
      await sendUnknownUserDM(interaction.user, eventId);
    } else {
      await supabase.from('presences').upsert({ event_id: eventId, discord_id: discordId, status: action });
    }
    // ─────────────────────────────────────────────────────────────────────────

    await updateEventMessage(eventId);
  }
});

client.login(process.env.DISCORD_TOKEN);