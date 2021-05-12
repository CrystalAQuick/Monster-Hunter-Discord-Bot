const Discord = require("discord.js");
const config = require("./config.json");

const { challenges } = require("./challenges");

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

const prefix = "!";

client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }

  if (command === "hello" || command === "hey" || command === "hi") {
    message.reply(`${command}! <3`);
  }

  if (command === "challenge") {
    message.reply(challenges[Math.floor(Math.random() * challenges.length)]);
  }
});

// Adding reaction-role function
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == config.REACTION_CHANNEL) {
      if (reaction.emoji.name === '♥') {
          await reaction.message.guild.members.cache
            .get(user.id)
            .roles.add(config.ROLE_MONSTER_HUNTER_FREEDOM_UNITE);
        }
        if (reaction.emoji.name === '3️⃣') {
          await reaction.message.guild.members.cache
            .get(user.id)
            .roles.add(config.ROLE_MONSTER_HUNTER_3_ULTIMATE);
        }
        if (reaction.emoji.name === '4️⃣') {
          await reaction.message.guild.members.cache
            .get(user.id)
            .roles.add(config.ROLE_MONSTER_HUNTER_4_ULTIMATE);
        } else return;
    }
});

//  Removing reaction-rol function
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == config.REACTION_CHANNEL) {
      if (reaction.emoji.name === '♥') {
      await reaction.message.guild.members.cache
          .get(user.id)
          .roles.remove(config.ROLE_MONSTER_HUNTER_FREEDOM_UNITE);
      }
      if (reaction.emoji.name === '3️⃣') {
      await reaction.message.guild.members.cache
          .get(user.id)
          .roles.remove(config.ROLE_MONSTER_HUNTER_3_ULTIMATE);
      }
      if (reaction.emoji.name === '4️⃣') {
      await reaction.message.guild.members.cache
          .get(user.id)
          .roles.remove(config.ROLE_MONSTER_HUNTER_4_ULTIMATE);
      } else return;
    }
  });



client.login(config.BOT_TOKEN);
