import fs from 'fs';
import airdrop from "./airdrop.js";
import TelegramBot from 'node-telegram-bot-api';
const token = '';
const bot = new TelegramBot(token, { polling: true });

// load the questions from an external file
const questions = JSON.parse(fs.readFileSync('questions.json'));

// global object to store the current question and progress of each user
const userData = {};

// listen for the /trivia command and send a random question to the user
bot.onText(/\/airdropme/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const firstName = msg.from.first_name;
    // send message asking user to check their DMs
    await bot.sendMessage(chatId, `${firstName}, Thank you for helping test the Airdropme function! please check your DMs for a message from me. Or click this link: https://t.me/meerkbot`);
  //send a message telling the user to answer a few questions
  bot.sendMessage(userId, 'Before I ask the wallet address for your airdrop I need you to answer a few questions. You need to get at least 3 right!');

  // if the user does not have an entry in the userData object, initialize one
//  if (!userData[userId]) {
    userData[userId] = {
      correctAnswerCount: 0,
      currentQuestion: null,
    }
  // }
  
  // if there is no current question, send a new one
  if (!userData[userId].currentQuestion) {
    // select a random question from the questions array
    userData[userId].currentQuestion = questions[Math.floor(Math.random() * questions.length)];

    // create an inline keyboard with buttons for each possible answer
    const keyboard = userData[userId].currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
    const replyMarkup = {
      inline_keyboard: keyboard,
    };

    // send the question to the user with the inline keyboard
    bot.sendMessage(userId, userData[userId].currentQuestion.question, { reply_markup: replyMarkup }).then(sentMessage => {
      userData[userId].messageId = sentMessage.message_id;
    });
  }
});

// listen for answers to trivia questions and check if they are correct
bot.on('callback_query', async (query) => {
  // Declare user-specific variables
  const userId = query.message.chat.id;
  const answer = query.data;
  
  // check if the user have an entry in the userData object
  if (!userData[userId]) return;
  // check if the answer is correct
  const isCorrect = answer === userData[userId].currentQuestion.correctAnswer;
  if (isCorrect) {
  userData[userId].correctAnswerCount++;
  // update the current question with a new one
  // but make sure is not the same as previous one
  let oldQuestion = userData[userId].currentQuestion;
  while (oldQuestion == userData[userId].currentQuestion) {
  userData[userId].currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  }
  // create an inline keyboard with buttons for the new question
  const keyboard = userData[userId].currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
  const replyMarkup = {
  inline_keyboard: keyboard,
  };
  // edit the message to show the new question with the inline keyboard
  bot.editMessageText(userData[userId].currentQuestion.question, { chat_id: userId, message_id: userData[userId].messageId, reply_markup: replyMarkup });
  } else {
  bot.sendMessage(userId, 'Incorrect. The correct answer was: ' + userData[userId].currentQuestion.correctAnswer);
  }
  
  if (userData[userId].correctAnswerCount >= 3) {
  bot.sendMessage(userId, 'Perfect! You got 3 answers right. Please enter the wallet address where you want to receive your airdrop:');
  await airdrop(bot,query.message);
  userData[userId].correctAnswerCount = 0;
  userData[userId].currentQuestion = null;
  } else if (userData[userId].correctAnswerCount > 0 && userData[userId].correctAnswerCount < 3) {
  bot.sendMessage(userId, 'You have ' + userData[userId].correctAnswerCount + ' correct answers. Keep going! ☝️');
  }
  });