require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { REST } = require('@discordjs/rest');
const { Client, GatewayIntentBits, Routes } = require('discord.js');
const { token, CLIENT_ID, GUILD_ID } = require('./config.json');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
  ]
});

const rest = new REST({ version: '10' }).setToken(token);

client.login(token);

client.on('ready', () => {
  console.log(`${client.user.tag} is online!`)
});

client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        console.log("Command received")
        const question_mc = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');
        const option3 = interaction.options.getString('option3');
        const option4 = interaction.options.getString('option4');

        const question = "I am going to provide a question along with a set of options, this is a multiple choice question and your job is simply to respond with the correct OR most correct answer within the given options. The question is: "
        + question_mc + `Option 1 is ${option1}` + `Option 2 is ${option2}` + `Option 3 is ${option3}` + `Option 4 is ${option4}` + "Please only respond with the correct option and a very brief explination for the answer"
        
        async function generateText(question) {
          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: question}],
            temperature: 0,
            max_tokens: 250,
          });
          
          console.log(response.data.choices[0].message);
          var aiReply = response.data.choices[0].message;
          var aiReply = aiReply.content;
          var aiReply = aiReply.toString();
          //var aiReply = aiReply.replace(/(\r\n|\n|\r)/gm, "");
          console.log(aiReply);
          interaction.reply( { content: aiReply } );
        }
        generateText(question);
        //interaction.reply( { content: aiReply } );
    }
});

async function validcommands() {
    const commands = [{
        name: 'ai-multi-choice',
        description: 'Generates most correct answer from a MC question',
        options: [
            {
                name: 'question',
                description: 'The question to ask GPT-3.5',
                type: 3,
                required: true
            },
            {
                name: 'option1',
                description: 'Option 1 of MC',
                type: 3,
                required: false
            },
            {
                name: 'option2',
                description: 'Option 2 of MC',
                type: 3,
                required: false
            },
            {
                name: 'option3',
                description: 'Option 3 of MC',
                type: 3,
                required: false
            },
            {
                name: 'option4',
                description: 'Option 4 of MC',
                type: 3,
                required: false
            }
        ]
    }];
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { 
          body: commands,
      });
  
      console.log('Successfully reloaded application (/) commands.');
  }
  catch (error) {
      console.error(error);
  }
  }
  validcommands();