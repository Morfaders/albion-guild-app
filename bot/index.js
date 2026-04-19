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

  // FIX 3 : Présences — on n'affiche QUE ceux qui ont répondu (present ou maybe ou absent)
  // On exclut les joueurs sans réponse (aucune entrée dans presData)
  const stIco = (id) => {
    const s = presence[id];
    if(!s) return null; // pas de réponse → on skip
    return s==='present'?'🟢':s==='maybe'?'🟡':'❌';
  };

  const sortByStatus = (a, b) => {
    const o = { present:0, maybe:1, absent:2 };
    const sa = presence[a.discord_id]||'z';
    const sb2 = presence[b.discord_id]||'z';
    return (o[sa]??9) - (o[sb2]??9) || a.name.localeCompare(b.name);
  };

  // Joueurs libres qui ont répondu
  const free = (players||[])
    .filter(p => !assignedIds.has(p.discord_id) && presence[p.discord_id])
    .sort(sortByStatus);

  // Joueurs en comp qui ont répondu
  const assigned = (players||[])
    .filter(p => assignedIds.has(p.discord_id) && presence[p.discord_id])
    .sort(sortByStatus);

  const counts = { present:0, maybe:0, absent:0 };
  (presData||[]).forEach(p => { if(counts[p.status]!==undefined) counts[p.status]++; });
  const countStr = `🟢 ${counts.present}  🟡 ${counts.maybe}  ❌ ${counts.absent}`;

  // Construction de la liste présences
  let presenceStr = '';
  if(free.length > 0) {
    presenceStr += free.map(p => `${stIco(p.discord_id)} ${p.name}`).join('  ');
  }
  if(assigned.length > 0) {
    if(presenceStr) presenceStr += '\n── en comp ──\n';
    presenceStr += assigned.map(p => `${stIco(p.discord_id)} ${p.name}`).join('  ');
  }
  if(!presenceStr) presenceStr = '_Aucune réponse pour l\'instant_';

  // FIX 1 + FIX 2 : Composition — affiche TOUS les slots (même vides), avec gomette de couleur de classe
  let compStr = '';

  if(event.comp_id) {
    const { data: comp } = await supabase.from('comps').select('*').eq('id', event.comp_id).single();
    if(comp && comp.slots) {
      const slots = comp.slots;

      (classes||[]).forEach(cls => {
        const clsRoles = (roles||[]).filter(r => r.cls === cls.id && slots[r.id] && slots[r.id].count > 0);
        if(!clsRoles.length) return;

        // FIX 2 : Gomette de couleur Discord pour la classe
        // Discord ne supporte pas les vraies couleurs inline, on utilise des emojis de couleur
        const clsEmoji = classColorEmoji(cls.color);

        clsRoles.forEach(r => {
          const slotDef = slots[r.id];
          const count = slotDef.count || 0;
          const asgn = assignments[r.id] || [];
          const roleLabel = r.label.padEnd(13);

          for(let i = 0; i < count; i++) {
            const a = asgn[i];
            if(a) {
              const p = (players||[]).find(pl => pl.discord_id === a.discordId);
              const name = p ? p.name : '?';
              const weapon = a.weapon ? ` — ${a.weapon}` : '';
              compStr += `${clsEmoji} \`${roleLabel}\` ${name}${weapon}\n`;
            } else {
              // FIX 1 : slot vide → affiche quand même avec un tiret
              compStr += `${clsEmoji} \`${roleLabel}\` -_______\n`;
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

/**
 * FIX 2 : Convertit une couleur hex en emoji de couleur Discord approximatif.
 * Discord n'ayant pas de texte coloré inline dans les embeds,
 * on mappe les couleurs à des emojis carrés standards.
 */
function classColorEmoji(hex) {
  if(!hex) return '⬜';
  const h = hex.replace('#','').toLowerCase();
  // Parse RGB
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);

  // Mapping vers les emojis carrés disponibles sur Discord
  // On cherche la teinte dominante
  const max = Math.max(r,g,b);
  const min = Math.min(r,g,b);
  const lightness = (max+min)/2/255;

  if(lightness < 0.15) return '⬛'; // très sombre → noir
  if(lightness > 0.85) return '⬜'; // très clair → blanc

  // Teinte
  if(max === min) return '🟫'; // gris

  let hue = 0;
  if(max===r) hue = 60*((g-b)/(max-min));
  else if(max===g) hue = 60*(2+(b-r)/(max-min));
  else hue = 60*(4+(r-g)/(max-min));
  if(hue<0) hue+=360;

  if(hue<25)  return '🔴';
  if(hue<45)  return '🟠';
  if(hue<70)  return '🟡';
  if(hue<150) return '🟢';
  if(hue<200) return '🔵'; // cyan → bleu
  if(hue<260) return '🔵';
  if(hue<290) return '🟣';
  if(hue<330) return '🟣'; // rose → violet
  return '🔴';
}

async function updateEventMessage(eventId) {
  const { data: event } = await supabase
    .from('events')
    .select('discord_message_id, discord_channel_id')
    .eq('id', eventId)
    .single();

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

client.once('ready', async () => {
  console.log(`Bot connecte : ${client.user.tag}`);
  await registerCommands();

  supabase
    .channel('bot-assignments')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assignments' }, async (payload) => {
      const eventId = payload.new?.event_id;
      if(eventId) await updateEventMessage(eventId);
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'assignments' }, async (payload) => {
      const eventId = payload.old?.event_id;
      if(eventId) await updateEventMessage(eventId);
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'presences' }, async (payload) => {
      const eventId = payload.new?.event_id;
      if(eventId) await updateEventMessage(eventId);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'presences' }, async (payload) => {
      const eventId = payload.new?.event_id;
      if(eventId) await updateEventMessage(eventId);
    })
    .subscribe();
});

client.on('interactionCreate', async interaction => {

  if(interaction.isChatInputCommand()){

    if(interaction.commandName === 'ping'){
      return interaction.reply({ content: 'Pong ! Le bot fonctionne.', ephemeral: true });
    }

    if(interaction.commandName === 'profil'){
      const discordId = interaction.user.id;
      const { data: player } = await supabase
        .from('players').select('*').eq('discord_id', discordId).single();
      if(player){
        return interaction.reply({
          content: `👤 **${player.name}**\nRoles : ${player.roles.length > 0 ? player.roles.join(', ') : 'aucun role defini'}`,
          ephemeral: true
        });
      } else {
        return interaction.reply({
          content: `❌ Tu n'as pas encore de profil. Un raid lead doit t'ajouter via la web app.`,
          ephemeral: true
        });
      }
    }

    if(interaction.commandName === 'event'){
      const titre = interaction.options.getString('titre');
      const date = interaction.options.getString('date');
      const compId = interaction.options.getInteger('comp') ?? 1;

      const { data: event, error } = await supabase
        .from('events')
        .insert({ title: titre, event_date: date, comp_id: compId })
        .select().single();

      if(error){
        return interaction.reply({ content: 'Erreur lors de la creation.', ephemeral: true });
      }

      const embed = await buildEventEmbed(event.id);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`present_${event.id}`)
          .setLabel('✓ Je suis là')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`maybe_${event.id}`)
          .setLabel('? Peut-être')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`absent_${event.id}`)
          .setLabel('✕ Absent')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setLabel('🛠 Gérer la comp')
          .setStyle(ButtonStyle.Link)
          .setURL(`${process.env.WEBAPP_URL}?event_id=${event.id}`)
      );

      const msg = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true
      });

      await supabase.from('events').update({
        discord_message_id: msg.id,
        discord_channel_id: msg.channelId
      }).eq('id', event.id);
    }
  }

  if(interaction.isButton()){
    const [action, eventId] = interaction.customId.split('_');
    if(!['present', 'maybe', 'absent'].includes(action)) return;

    const discordId = interaction.user.id;
    await interaction.deferUpdate();

    await supabase.from('presences').upsert({
      event_id: parseInt(eventId),
      discord_id: discordId,
      status: action
    });

    await updateEventMessage(parseInt(eventId));
  }
});

client.login(process.env.DISCORD_TOKEN);