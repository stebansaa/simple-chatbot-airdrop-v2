import fs from 'fs';
import airdrop from "./airdrop.js";
import TelegramBot from 'node-telegram-bot-api';

const token = '';
const bot = new TelegramBot(token, { polling: true });


// Global object to store the current question and progress of each user
//const userData = {};
//ok I will move this instead each bot.on

// English language

bot.onText(/\/airdropme/, async (msg) => {
    const userData = {};
    //add this line
    const userId = msg.from.id;
    userData[userId] = {};

// bot.onText(/\/airdropme/, async (msg) => {
    // const userId = msg.from.id;
   //  const userData = {};
// userData[userId] = {};  
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const firstName = msg.from.first_name;
    if (!userData[userId]) {
        userData[userId] = {};
    };
    // send message asking user to check their DMs
    await bot.sendMessage(chatId, `${firstName}, Thank you for helping test the Airdropme function! please check your DMs for a message from me. Or click this link: https://t.me/meerkbot`);
    // Load questions from external file
    const questions = JSON.parse(fs.readFileSync('questions-english.json'));
    // Send message asking user to check their DMs
    bot.sendMessage(userId, 'Before I ask the wallet address for your airdrop I need you to answer a few questions. You need to get at least 3 right!');

    // Initialize userData if not exist
    // if (!userData[userId]) {
        userData[userId] = {
            correctAnswerCount: 0,
            currentQuestion: null,
        }
    // }
    if (!userData[userId].currentQuestion) {
        // Select a random question from the questions array
        userData[userId].currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        // Create an inline keyboard with buttons for each possible answer
        const keyboard = userData[userId].currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
        const replyMarkup = {
            inline_keyboard: keyboard,
        };
        // Send the question to the user with the inline keyboard
        bot.sendMessage(userId, userData[userId].currentQuestion.question, { reply_markup: replyMarkup }).then(sentMessage => {
            userData[userId].messageId = sentMessage.message_id;
        });
    };
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
    
    //this may solve some issues
    //delete userData[userId];


    userData[userId].correctAnswerCount = 0;
    userData[userId].currentQuestion = null;
    } else if (userData[userId].correctAnswerCount > 0 && userData[userId].correctAnswerCount < 3) {
    bot.sendMessage(userId, 'You have ' + userData[userId].correctAnswerCount + ' correct answers. Keep going! ??????');
    }
    });
    delete userData[userId];
});

// Chinese language
bot.onText(/\/??????/, async (msg) => {
    const userData = {};
    const chatId = msg.chat.id;
    const userId = msg.from.id;
const firstName = msg.from.first_name;
// Load questions from external file
const questions = JSON.parse(fs.readFileSync('questions-chinese.json'));
// Send message asking user to check their DMs
await bot.sendMessage(chatId, `${firstName}, ??????????????????????????????????????????????????????????????????????????????????????????: https://t.me/meerkbot`);

bot.sendMessage(userId, '?????????????????????????????????????????????????????????????????????????????????????????????????????????3??????');
// Initialize userData if not exist
// if (!userData[userId]) {
userData[userId] = {
correctAnswerCount: 0,
currentQuestion: null,
}
// }
if (!userData[userId].currentQuestion) {
// Select a random question from the questions array
userData[userId].currentQuestion = questions[Math.floor(Math.random() * questions.length)];
// Create an inline keyboard with buttons for each possible answer
const keyboard = userData[userId].currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
const replyMarkup = {
inline_keyboard: keyboard,
};
// Send the question to the user with the inline keyboard
bot.sendMessage(userId, userData[userId].currentQuestion.question, { reply_markup: replyMarkup }).then(sentMessage => {
userData[userId].messageId = sentMessage.message_id;
});
};

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
    // bot.sendMessage(userId, 'Incorrect. The correct answer was: ' + userData[userId].currentQuestion.correctAnswer);
    bot.sendMessage(userId, '????????????????????????: ' + userData[userId].currentQuestion.correctAnswer);
    }
    
    if (userData[userId].correctAnswerCount >= 3) {
    // bot.sendMessage(userId, 'Perfect! You got 3 answers right. Please enter the wallet address where you want to receive your airdrop:');
    bot.sendMessage(userId, '????????????????????????3?????????????????????????????????????????????????????????');
    await airdrop(bot,query.message);
    userData[userId].correctAnswerCount = 0;
    userData[userId].currentQuestion = null;
    } else if (userData[userId].correctAnswerCount > 0 && userData[userId].correctAnswerCount < 3) {
    //bot.sendMessage(userId, '????????????' + userData[userId].correctAnswerCount + '?????????????????????????????????! ??????');    
    bot.sendMessage(userId, '????????????' + userData[userId].correctAnswerCount + '?????????????????????????????????! ??????');
}
    });



    delete userData[userId];

});

//korean language

bot.onText(/\/????????????/, async (msg) => {
    const userData = {};
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    // Load questions from external file
    const questions = JSON.parse(fs.readFileSync('questions-korean.json'));
    // Send message asking user to check their DMs
    await bot.sendMessage(chatId, `${firstName}, ???????????????. Airdropme ????????? ????????????????????? ???????????????! DM?????? ??????????????? ???????????? ?????????????????? ??? ????????? ???????????????: https://t.me/meerkbot`);
    bot.sendMessage(userId, 'Airdrop??? ????????? ?????? ????????? ?????? ?????? ??? ?????? ????????? ????????? ?????????. 3??? ?????? ???????????? ?????????!');

    // Initialize userData if not exist
    // if (!userData[userId]) {
        userData[userId] = {
            correctAnswerCount: 0,
            currentQuestion: null,
        }
    // }
    if (!userData[userId].currentQuestion) {
        // Select a random question from the questions array
        userData[userId].currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        // Create an inline keyboard with buttons for each possible answer
        const keyboard = userData[userId].currentQuestion.answers.map((a) => [{ text: a, callback_data: a }]);
        const replyMarkup = {
            inline_keyboard: keyboard,
        };
        // Send the question to the user with the inline keyboard
        bot.sendMessage(userId, userData[userId].currentQuestion.question, { reply_markup: replyMarkup }).then(sentMessage => {
            userData[userId].messageId = sentMessage.message_id;
        });
    };

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
    // bot.sendMessage(userId, 'Incorrect. The correct answer was: ' + userData[userId].currentQuestion.correctAnswer);
    bot.sendMessage(userId, '??????. ?????????: ' + userData[userId].currentQuestion.correctAnswer);
    }
    
    if (userData[userId].correctAnswerCount >= 3) {
    //bot.sendMessage(userId, 'Perfect! You got 3 answers right. Please enter the wallet address where you want to receive your airdrop:');
    bot.sendMessage(userId, '???????????????! ????????? 3?????? ????????? ?????? ??????????????????. ????????? ???????????? ??????????????? ?????? ????????? ?????? ????????? ????????????????????? :');
    await airdrop(bot,query.message);
    userData[userId].correctAnswerCount = 0;
    userData[userId].currentQuestion = null;
    } else if (userData[userId].correctAnswerCount > 0 && userData[userId].correctAnswerCount < 3) {
    //bot.sendMessage(userId, 'You have ' + userData[userId].correctAnswerCount + ' correct answers. Keep going! ??????');
    bot.sendMessage(userId, '????????? ' + userData[userId].correctAnswerCount + '?????? ????????? ??????????????????. ?????? ???????????????! ??????');
    }
    });

    delete userData[userId];
});
