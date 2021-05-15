const Discord = require("discord.js");
const config = require("./config.json");
const bot = require("./messages.json");
const roleReactions = require("./reactions.json");

const { challenges } = require("./challenges");

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

const prefix = "!";

// replys to user depending on command
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  var botReplies = Object.values(bot.messageContents);

  for (var i = 0; i < botReplies.length; i++) {
    var question = botReplies[i].questions;
    var answer  = botReplies[i].answer;
    if (Object.values(question).indexOf(command) != -1) {
      message.channel.send(`${answer[Math.floor(Math.random() * answer.length)]}`);
    }
  }

  // if (command === "challenge") { // TODO: figure out a better way to do this. add challenges to messages.json?
  //   message.reply(challenges[Math.floor(Math.random() * challenges.length)]);
  // }

});

// Adding reaction-role function
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == config.REACTION_CHANNEL) {
      var reactions = roleReactions.messageContents.Reactions.reactions;
      var addRole = Object.values(reactions).indexOf(reaction.emoji.name);
      var role = [
        config.ROLE_MONSTER_HUNTER_WORLD,
        config.ROLE_MONSTER_HUNTER_RISE,
        config.ROLE_MONSTER_HUNTER_4_ULTIMATE,
        config.ROLE_MONSTER_HUNTER_3_ULTIMATE
      ];

      if (Object.values(reactions).indexOf(reaction.emoji.name) != -1) {
          await reaction.message.guild.members.cache
            .get(user.id)
            .roles.add(role[addRole]);
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
      var reactions = roleReactions.messageContents.Reactions.reactions;
      var addRole = Object.values(reactions).indexOf(reaction.emoji.name);
      var role = [
        config.ROLE_MONSTER_HUNTER_WORLD,
        config.ROLE_MONSTER_HUNTER_RISE,
        config.ROLE_MONSTER_HUNTER_4_ULTIMATE,
        config.ROLE_MONSTER_HUNTER_3_ULTIMATE
      ];

      if (Object.values(reactions).indexOf(reaction.emoji.name) != -1) {
          await reaction.message.guild.members.cache
            .get(user.id)
            .roles.remove(role[addRole]);
      } else return;


    }
  });

client.login(config.BOT_TOKEN);
