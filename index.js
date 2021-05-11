const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

const prefix = "!";

const jokes = [
    'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
    '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
    'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
    'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
    'If you listen to a UNIX shell, can you hear the C?',
    'Why do Java programmers have to wear glasses? Because they don’t C#.',
    'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
    'When Apple employees die, does their life HTML5 in front of their eyes?',
    'Without requirements or design, programming is the art of adding bugs to an empty text file.',
    'Before software can be reusable it first has to be usable.',
    'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
    'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
    'There are two ways to write error-free programs; only the third one works.',
];

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

  if (command === "joke") {
    message.reply(jokes[Math.floor(Math.random() * jokes.length)]);
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
