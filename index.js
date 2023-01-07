import fs from 'fs';
import airdrop from "./airdrop.js";
import TelegramBot from 'node-telegram-bot-api';
const token = '5613362744:AAEgqGw0z5qdTD6KcvbirUJVkAaeb1TvZWM';
const bot = new TelegramBot(token, { polling: true });

// load the questions from an external file
const questions = JSON.parse(fs.readFileSync('questions.json'));

// global variable to store the current question
let currentQuestion;
let oldQuestion;

// global variable to set get the number of correct questions
let correctAnswer = 0;

// listen for the /trivia command and send a random question to the user
// bot.onText(/\/trivia/, (msg) => {
bot.onText(/\/airdropme/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const firstName = msg.from.first_name;
    // send message asking user to check their DMs
    await bot.sendMessage(chatId, `${firstName}, please check your DMs for a message from me.`);
  // if there is no current question, send a new one
  if (!currentQuestion) {
    // select a random question from the questions array
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];

    // create an inline keyboard with buttons for each possible answer
    const keyboard = currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
    const replyMarkup = {
      inline_keyboard: keyboard,
    };

    // send the question to the user with the inline keyboard
    bot.sendMessage(userId, currentQuestion.question, { reply_markup: replyMarkup });
  }
});

// listen for answers to trivia questions and check if they are correct
bot.on('callback_query', async (query) => {
  const userId = query.message.chat.id;
  const answer = query.data;
  const messageId = query.message.message_id;

  // check if the answer is correct
  if (!currentQuestion) return ;
  const isCorrect = answer === currentQuestion.correctAnswer;
  if (isCorrect) {

    // increment a counter
    correctAnswer++; // num is now 1

    // send a message saying that it is correc!
    // bot.sendMessage(chatId, 'Correct!' + correctAnswer);
    // update the current question with a new one
    // but make sure is not the same as previous one
    oldQuestion = currentQuestion;

    while (oldQuestion == currentQuestion) {

      currentQuestion = questions[Math.floor(Math.random() * questions.length)];

    };



    // create an inline keyboard with buttons for the new question
    const keyboard = currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
    const replyMarkup = {
      inline_keyboard: keyboard,
    };

    // edit the message to show the new question with the inline keyboard
    bot.editMessageText(currentQuestion.question, { chat_id: userId, message_id: messageId, reply_markup: replyMarkup });
  } else {
    // end the game if the answer is incorrect
    bot.sendMessage(userId, 'Game over! The correct answer was: ' + currentQuestion.correctAnswer);
    // check to see if you got more than 3 answers right , if so ask for your airdrop adress
    if (correctAnswer > 3) {

      bot.sendMessage(userId, 'You got more than 3 answers right, what is your Wallet Adddress?');
      await airdrop(bot,query.message);
    };

    correctAnswer = 0;
    currentQuestion = null;
  }
});
