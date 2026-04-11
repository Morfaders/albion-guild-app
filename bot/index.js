require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Connexion Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Connexion Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ]
});

// Définition des slash commands
const commands = [
  {
    name: 'ping',
    description: 'Vérifie que le bot fonctionne',
  },
  {
    name: 'event',
    description: 'Crée un événement actif',
    options: [
      {
        name: 'titre',
        description: 'Titre de l\'événement (ex: ZvZ Vendredi Soir)',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'date',
        description: 'Date et heure (ex: Vendredi 20h30)',
        type: 3, // STRING
        required: true,
      }
    ]
  },
  {
    name: 'profil',
    description: 'Voir ou créer ton profil de joueur',
  }
];

// Enregistre les commandes sur Discord au démarrage
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Enregistrement des slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands enregistrées !');
  } catch (error) {
    console.error('Erreur enregistrement commands:', error);
  }
}

// Bot prêt
client.once('ready', async () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  await registerCommands();
});

// Gestion des interactions
client.on('interactionCreate', async interaction => {

  // --- SLASH COMMANDS ---
  if (interaction.isChatInputCommand()) {

    // /ping
    if (interaction.commandName === 'ping') {
      await interaction.reply({ content: '🏓 Pong ! Le bot fonctionne.', ephemeral: true });
    }

    // /profil
    if (interaction.commandName === 'profil') {
      const discordId = interaction.user.id;
      const { data: player } = await supabase
        .from('players')
        .select('*')
        .eq('discord_id', discordId)
        .single();

      if (player) {
        await interaction.reply({
          content: `👤 Ton profil : **${player.name}**\nRôles : ${player.roles.length > 0 ? player.roles.join(', ') : 'aucun rôle défini'}`,
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: `❌ Tu n'as pas encore de profil. Un raid lead doit t'ajouter via la web app.`,
          ephemeral: true
        });
      }
    }

    // /event
    if (interaction.commandName === 'event') {
      const titre = interaction.options.getString('titre');
      const date = interaction.options.getString('date');

      // Crée l'événement en BDD
      const { data: event, error } = await supabase
        .from('events')
        .insert({ title: titre, event_date: date })
        .select()
        .single();

      if (error) {
        await interaction.reply({ content: '❌ Erreur lors de la création.', ephemeral: true });
        return;
      }

      // Poste le message avec les boutons
      const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

      const embed = new EmbedBuilder()
        .setTitle(`⚔️ ${titre}`)
        .setDescription(`📅 ${date}\n\n_Clique sur un bouton pour indiquer ta présence._`)
        .setColor(0x5865F2)
        .setFooter({ text: `Event ID: ${event.id}` });

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

      // Sauvegarde l'ID du message Discord dans la BDD
      await supabase
        .from('events')
        .update({
          discord_message_id: msg.id,
          discord_channel_id: msg.channelId
        })
        .eq('id', event.id);
    }
  }

  // --- BOUTONS DE PRÉSENCE ---
  if (interaction.isButton()) {
    const [action, eventId] = interaction.customId.split('_');
    if (!['present', 'maybe', 'absent'].includes(action)) return;

    const discordId = interaction.user.id;

    // Met à jour la présence en BDD
    await supabase
      .from('presences')
      .upsert({
        event_id: parseInt(eventId),
        discord_id: discordId,
        status: action
      });

    // Récupère les stats de présence
    const { data: presences } = await supabase
      .from('presences')
      .select('status')
      .eq('event_id', eventId);

    const counts = { present: 0, maybe: 0, absent: 0 };
    presences?.forEach(p => counts[p.status]++);

    const statusLabel = action === 'present' ? '✅ présent(e)' : action === 'maybe' ? '🟡 peut-être' : '❌ absent(e)';

    await interaction.reply({
      content: `Tu es marqué(e) **${statusLabel}**.\n🟢 ${counts.present} présents · 🟡 ${counts.maybe} peut-être · 🔴 ${counts.absent} absents`,
      ephemeral: true
    });
  }
});

// Lance le bot
client.login(process.env.DISCORD_TOKEN);