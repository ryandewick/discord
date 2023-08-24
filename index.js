const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");

const classSetups = require("./classSetups.json");

const commands = [
  {
    name: "class",
    description: "Class Setups based on weapon type.",
    options: [
      {
        name: "assault_rifle",
        description: "Class setups for assault rifles.",
        type: 1,
        options: [
          {
            name: "gun",
            description: "Select an assault rifle.",
            type: 3,
            required: true,
            choices: [
              {
                name: "ACR",
                value: "acr",
              },
            ],
          },
        ],
      },
      {
        name: "smg",
        description: "Class setups for SMGs.",
        type: 1,
        options: [
          {
            name: "gun",
            description: "Select an SMG.",
            type: 3,
            required: true,
            choices: [
              {
                name: "UMP45",
                value: "ump45",
              },
            ],
          },
        ],
      },
      {
        name: "lmg",
        description: "Class setups for LMGs.",
        type: 1,
        options: [
          {
            name: "gun",
            description: "Select an LMG.",
            type: 3,
            required: true,
            choices: [
              {
                name: "RPD",
                value: "rpd",
              },
            ],
          },
        ],
      },
      {
        name: "sniper",
        description: "Class setups for snipers.",
        type: 1,
        options: [
          {
            name: "gun",
            description: "Select a sniper.",
            type: 3,
            required: true,
            choices: [
              {
                name: "Intervention",
                value: "intervention",
              },
              // ... other snipers
            ],
          },
        ],
      },
    ],
  },
];

const { clientId, guildId, BOT_TOKEN } = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
  console.log("Bot is online!");

  // Register the slash command for a specific guild
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const weaponType = interaction.options.getSubcommand();
  const gunChoice = interaction.options.getString("gun");

  const setup = classSetups[weaponType]?.[gunChoice];

  if (setup) {
    const response = `
      **${setup.name}:**
      - Primary: ${setup.primary}
      - Secondary: ${setup.secondary}
      - Equipment: ${setup.equipment}
      - Special Grenade: ${setup.specialGrenade}
      - Perk 1: ${setup.perk1}
      - Perk 2: ${setup.perk2}
      - Perk 3: ${setup.perk3}
      - Deathstreak: ${setup.deathstreak}
    `;

    await interaction.reply(response);
  } else {
    await interaction.reply(
      "Invalid choice. Please select a valid weapon type and gun."
    );
  }
});

client.login(BOT_TOKEN);
