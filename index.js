import openai from "./config/open-ai.js";
import {getWeather} from "./config/weather-api.js";
import readlineSync from 'readline-sync'
import colors from 'colors'

async function main() {
    console.log(colors.bold.green('Welcome to the Chatbot program'));
    console.log(colors.bold.green('You can start talking with the bot'))

    const chatHistory = []; //stores conversation history

    // Construct message by iterating over the history
    const messages = chatHistory.map(([role, content]) => ({role, content}))
    const weatherBotInstruction = 'Give a simple summary of the weather in plain English using this data:'

    while (true){
        const userInput = readlineSync.question(colors.yellow('You: '))
        try {
            if(userInput.toLowerCase() == 'exit'){
                return
            }

            if(userInput.toLowerCase().includes('weather')){
                const words = userInput.split(' ');
                let location = null;
          
                for (let i = 0; i < words.length; i++) {
                  if (['in', 'at', 'for'].includes(words[i].toLowerCase()) && i < words.length - 1) {
                    location = words[i + 1];
                    break;
                  }
                }
                const weatherData = await getWeather(location)
                messages.push({role: 'system', content: weatherBotInstruction + weatherData})
            }

            // Add latest user input
            messages.push({ role: 'user', content: userInput})
            // Call the API with the user input
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: 'gpt-3.5-turbo',
              });

            // Get completion text/content

            const completionText = completion.choices[0].message.content

            console.log(colors.bold.green('Bot: ') + completionText)

            // Update history with user input and assistant response
            chatHistory.push(['user', userInput])
            chatHistory.push(['assistant', completionText])
        } catch (error) {
            console.error(colors.red(error))
        }
    }
  }
  
  main();