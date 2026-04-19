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
  const hasStatus = new Set(Object.keys(presence));

  const stIco = (id) => {
    const s = presence[id]||'none';
    return s==='present'?'🟢':s==='maybe'?'🟡':s==='absent'?'❌':'⚫';
  };

  const sortByStatus = (a, b) => {
    const o = { present:0, maybe:1, none:2, absent:3 };
    return (o[presence[a.discord_id]||'none']) - (o[presence[b.discord_id]||'none']);
  };

  // 1) Seulement les joueurs qui ont cliqué sur un statut
  const free = (players||[]).filter(p => !assignedIds.has(p.discord_id) && hasStatus.has(p.discord_id)).sort(sortByStatus);
  const assigned = (players||[]).filter(p => assignedIds.has(p.discord_id) && hasStatus.has(p.discord_id)).sort(sortByStatus);

  const freeStr = free.length ? free.map(p => `${stIco(p.discord_id)}${p.name}`).join(' ') : '_aucun_';
  const assignedStr = assigned.length ? assigned.map(p => `${stIco(p.discord_id)}${p.name}`).join(' ') : '';

  let presenceLine = freeStr;
  if(assignedStr) presenceLine += '\n────────────\n' + assignedStr;

  const counts = { present:0, maybe:0, absent:0 };
  (presData||[]).forEach(p => { if(counts[p.status]!==undefined) counts[p.status]++; });
  const countStr = `🟢 ${counts.present}  🟡 ${counts.maybe}  ❌ ${counts.absent}`;

  // 2) Tous les rôles visibles (même vides) + 3) en-tête classe par groupe
  let compStr = '';
  if(event.comp_id){
    const { data: comp } = await supabase.from('comps').select('*').eq('id', event.comp_id).single();
    if(comp && comp.slots){
      const slots = comp.slots;
      (classes||[]).forEach(cls => {
        const clsRoles = (roles||[]).filter(r => r.cls === cls.id && slots[r.id] && slots[r.id].count > 0);
        if(!clsRoles.length) return;

        compStr += `\n**${cls.label}**:\n`;  // gommette = en-tête classe

        clsRoles.forEach(r => {
          const asgn = assignments[r.id] || [];
          const label = r.label.padEnd(14);
          const max = slots[r.id].count;

          if(asgn.length === 0){
            compStr += `\`${label}\` — (vide)\n`;
          } else {
            asgn.forEach((a, i) => {
              const p = (players||[]).find(pl => pl.discord_id === a.discordId);
              const name = p ? p.name : '?';
              const weapon = a.weapon ? `- ${a.weapon}` : '';
              if(i === 0){
                compStr += `\`${label}\` ${name.padEnd(12)} ${weapon}\n`;
              } else {
                compStr += `\`${' '.repeat(14)}\` ${name.padEnd(12)} ${weapon}\n`;
              }
            });
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
      { name: `Présences — ${countStr}`, value: presenceLine.slice(0, 1024), inline: false },
      { name: 'Composition', value: compStr.slice(0, 1024) || '—', inline: false }
    );

  if(event.event_date) embed.setDescription(`📅 ${event.event_date}`);
  embed.setFooter({ text: `Event ID: ${eventId}` });

  return embed;
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