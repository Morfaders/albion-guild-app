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
      { name: 'titre', description: 'Titre', type: 3, required: true },
      { name: 'date', description: 'Date', type: 3, required: true },
      { name: 'comp', description: 'ID comp', type: 4, required: false }
    ]
  },
  { name: 'profil', description: 'Voir ton profil' }
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
}

// ============================================================
// EMBED EVENT
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

  if(!event) return null;

  // ===== PRÉSENCE =====
  const presence = {};
  (presData||[]).forEach(p => presence[p.discord_id] = p.status);

  const assignments = {};
  (asgData||[]).forEach(a => {
    if(!assignments[a.role_id]) assignments[a.role_id] = [];
    assignments[a.role_id].push({ discordId: a.discord_id, weapon: a.weapon||'' });
  });

  const assignedIds = new Set((asgData||[]).map(a => a.discord_id));

  const stIco = (id) => {
    const s = presence[id]||'none';
    return s==='present'?'🟢':s==='maybe'?'🟡':s==='absent'?'❌':'⚫';
  };

  const free = (players||[]).filter(p => !assignedIds.has(p.discord_id));
  const assigned = (players||[]).filter(p => assignedIds.has(p.discord_id));

  const freeStr = free.length ? free.map(p => `${stIco(p.discord_id)}${p.name}`).join(' ') : '_aucun_';
  const assignedStr = assigned.length ? assigned.map(p => `${stIco(p.discord_id)}${p.name}`).join(' ') : '';

  let presenceLine = freeStr;
  if(assignedStr){
    presenceLine += '\n────────────\n' + assignedStr;
  }

  const counts = { present:0, maybe:0, absent:0 };
  (presData||[]).forEach(p => { if(counts[p.status]!==undefined) counts[p.status]++; });
  const countStr = `🟢 ${counts.present}  🟡 ${counts.maybe}  ❌ ${counts.absent}`;

  // ===== COMPOSITION =====
  const CLASS_EMOJIS = {
    tank: '🛡️',
    heal: '💚',
    dps: '⚔️'
  };

  let compFields = [];

  if(event.comp_id){
    const { data: comp } = await supabase
      .from('comps')
      .select('*')
      .eq('id', event.comp_id)
      .single();

    if(comp && comp.slots){
      const slots = comp.slots;

      (classes||[]).forEach(cls => {

        const clsRoles = (roles||[]).filter(r =>
          r.cls === cls.id &&
          slots[r.id] &&
          slots[r.id].count > 0
        );

        if(!clsRoles.length) return;

        let value = '';

        clsRoles.forEach(r => {
          const count = slots[r.id]?.count || 0;
          const asgn = assignments[r.id] || [];

          value += `└ ${r.label} (${asgn.length}/${count})\n`;

          if(asgn.length === 0){
            value += `      —\n`;
          } else {
            asgn.forEach(a => {
              const p = players.find(pl => pl.discord_id === a.discordId);
              const name = p ? p.name : '?';
              const weapon = a.weapon ? ` — ${a.weapon}` : '';
              value += `      ${name}${weapon}\n`;
            });
          }
        });

        const emoji = CLASS_EMOJIS[cls.id] || '🎯';

        compFields.push({
          name: `${emoji} ${cls.label}`,
          value: value || '—',
          inline: true
        });

      });
    }
  }

  if(compFields.length === 0){
    compFields.push({
      name: 'Composition',
      value: '_Aucune composition chargée_',
      inline: false
    });
  }

  // ===== EMBED =====
  const embed = new EmbedBuilder()
    .setTitle(`⚔️ ${event.title}`)
    .setColor(0x5865F2)
    .addFields({
      name: `Présences — ${countStr}`,
      value: presenceLine.slice(0,1024),
      inline: false
    })
    .addFields(compFields);

  if(event.event_date){
    embed.setDescription(`📅 ${event.event_date}`);
  }

  embed.setFooter({ text: `Event ID: ${eventId}` });

  return embed;
}

// ============================================================
// UPDATE MESSAGE
// ============================================================
async function updateEventMessage(eventId) {
  const { data: event } = await supabase
    .from('events')
    .select('discord_message_id, discord_channel_id')
    .eq('id', eventId)
    .single();

  if(!event?.discord_message_id) return;

  const embed = await buildEventEmbed(eventId);
  const channel = await client.channels.fetch(event.discord_channel_id);
  const msg = await channel.messages.fetch(event.discord_message_id);
  await msg.edit({ embeds: [embed] });
}

// ============================================================
// READY
// ============================================================
client.once('ready', async () => {
  console.log(`✅ ${client.user.tag}`);
  await registerCommands();
});

// ============================================================
// INTERACTIONS
// ============================================================
client.on('interactionCreate', async interaction => {

  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'ping') {
      return interaction.reply({ content: 'pong', ephemeral: true });
    }

    if (interaction.commandName === 'event') {
      const titre = interaction.options.getString('titre');
      const date = interaction.options.getString('date');
      const compId = interaction.options.getInteger('comp') || null;

      const { data: event } = await supabase
        .from('events')
        .insert({ title: titre, event_date: date, comp_id: compId })
        .select()
        .single();

      const embed = await buildEventEmbed(event.id);

      const msg = await interaction.reply({
        embeds: [embed],
        fetchReply: true
      });

      await supabase.from('events').update({
        discord_message_id: msg.id,
        discord_channel_id: msg.channelId
      }).eq('id', event.id);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);