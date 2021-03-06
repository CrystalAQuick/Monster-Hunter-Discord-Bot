const Discord = require("discord.js");
const fs = require('fs')
const config = require("./config.json");
const bot = require("./messages.json");
const roleReactions = require("./reactions.json");
const monsters = require("./monsters.json");
const { MessageAttachment } = require("discord.js");

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

const prefix = "!";

// replies to user depending on command
client.on('message', function(message) {
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
      messageToSend = `${answer[Math.floor(Math.random() * answer.length)]}`; // building a reply

      if (botReplies[5].questions === question) { // checking for daily challenge
        var monsterNames = Object.keys(monsters.Monsters);
        var monsterValues = Object.values(monsters.Monsters);
        var randomMonster = Math.floor(Math.random() * monsterNames.length);
        var monster = monsterNames[randomMonster];
        var monsterValue = monsterValues[randomMonster]; // .species, .threat etc
        var challengeList = Object.values(botReplies[4].answer);
        var challenge = challengeList[Math.floor(Math.random() * challengeList.length)]; // random challenge

        messageToSend = cardMessage(monster, monsterValue.species, challenge, monsterValue.threat, monsterValue.value);

        message.channel.send(messageToSend);
        break;
      }

      message.channel.send(`${messageToSend}, ${message.author.toString()}`);
    }
  }

});

client.on('message', function(message) {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "startdailychallenge" && message.channel.id === config.DAILY_CHALLENGE_CHANNEL) {
    var checkminutes = 2, checkthe_interval = checkminutes * 60 * 100; //This checks every 10 minutes, change 10 to whatever minute you'd like
    setInterval(function() {
      var monsterNames = Object.keys(monsters.Monsters);
      var monsterValues = Object.values(monsters.Monsters);
      var randomMonster = Math.floor(Math.random() * monsterNames.length);
      var monster = monsterNames[randomMonster];
      var monsterValue = monsterValues[randomMonster]; // .species, .threat etc
      var botReplies = Object.values(bot.messageContents);

      var challengeList = Object.values(botReplies[4].answer);
      var challenge = challengeList[Math.floor(Math.random() * challengeList.length)]; // random challenge

      messageToSend = cardMessage(monster, monsterValue.species, challenge, monsterValue.threat, monsterValue.value);

      message.channel.send(messageToSend);
    }, checkthe_interval);

  }
});

function cardMessage(monsterName, species, challenge, threat) {
  let monsterNameTrim = monsterName.trim().replace(/\s/g, '');
  let path = `./images/${monsterNameTrim}.png`;
  let image = '';

  if (fs.existsSync(path)) {
    var monsterImage = new MessageAttachment(`./images/${monsterNameTrim}.png`);
    image = `${monsterNameTrim}.png`;
  } else {
    let path = `./images/${monsterNameTrim}.jpg`;
    if (fs.existsSync(path)) {
      var monsterImage = new MessageAttachment(`./images/${monsterNameTrim}.jpg`);
      image = `${monsterNameTrim}.jpg`;
    } else {
      var monsterImage = new MessageAttachment(`./images/monsterNotFound.png`);
      image = 'monsterNotFound.png';
    }
  }

  const challengeCard = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle(monsterName)
    .setAuthor('Daily Challenge')
    .setDescription(`Species: ${species}`)
    .attachFiles(monsterImage)
    .setThumbnail(`attachment://${image}`)
    .addFields(
      { name: 'Challenge', value: `${challenge}\n Recommended Hunter level: 6`},
      { name: 'Threat', value: threat, inline: true },
    )
  return challengeCard;
}

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
