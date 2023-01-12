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
    bot.sendMessage(userId, 'You have ' + userData[userId].correctAnswerCount + ' correct answers. Keep going! ☝️');
    }
    });
    delete userData[userId];
});

// Chinese language
bot.onText(/\/空投/, async (msg) => {
    const userData = {};
    const chatId = msg.chat.id;
    const userId = msg.from.id;
const firstName = msg.from.first_name;
// Load questions from external file
const questions = JSON.parse(fs.readFileSync('questions-chinese.json'));
// Send message asking user to check their DMs
await bot.sendMessage(chatId, `${firstName}, 谢谢你帮助测试空投功能！请查看我给你发的私信。或点击这个链接: https://t.me/meerkbot`);

bot.sendMessage(userId, '在我询问你空投的钱包地址之前，我需要你回答几个问题。你需要回答正确至少3个！');
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
    bot.sendMessage(userId, '错误。正确答案是: ' + userData[userId].currentQuestion.correctAnswer);
    }
    
    if (userData[userId].correctAnswerCount >= 3) {
    // bot.sendMessage(userId, 'Perfect! You got 3 answers right. Please enter the wallet address where you want to receive your airdrop:');
    bot.sendMessage(userId, '完美！你回答对了3个问题。请输入你要收到空投的钱包地址：');
    await airdrop(bot,query.message);
    userData[userId].correctAnswerCount = 0;
    userData[userId].currentQuestion = null;
    } else if (userData[userId].correctAnswerCount > 0 && userData[userId].correctAnswerCount < 3) {
    //bot.sendMessage(userId, '你已经有' + userData[userId].correctAnswerCount + '个正确答案了。继续前进! ☝️');    
    bot.sendMessage(userId, '你已经有' + userData[userId].correctAnswerCount + '个正确答案了。继续前进! ☝️');
}
    });



    delete userData[userId];

});

//korean language

bot.onText(/\/에어드랍/, async (msg) => {
    const userData = {};
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    // Load questions from external file
    const questions = JSON.parse(fs.readFileSync('questions-korean.json'));
    // Send message asking user to check their DMs
    await bot.sendMessage(chatId, `${firstName}, 감사합니다. Airdropme 기능을 테스트해주셔서 감사합니다! DM에서 나에게서의 메시지를 확인하시거나 이 링크를 클릭하세요: https://t.me/meerkbot`);
    bot.sendMessage(userId, 'Airdrop에 사용할 지갑 주소를 묻기 전에 몇 가지 질문에 답해야 합니다. 3개 이상 맞추셔야 합니다!');

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
    bot.sendMessage(userId, '오답. 정답은: ' + userData[userId].currentQuestion.correctAnswer);
    }
    
    if (userData[userId].correctAnswerCount >= 3) {
    //bot.sendMessage(userId, 'Perfect! You got 3 answers right. Please enter the wallet address where you want to receive your airdrop:');
    bot.sendMessage(userId, '완벽합니다! 당신은 3개의 문항을 모두 맞추셨습니다. 여기에 여러분이 에어드랍을 받길 원하는 지갑 주소를 입력해주십시오 :');
    await airdrop(bot,query.message);
    userData[userId].correctAnswerCount = 0;
    userData[userId].currentQuestion = null;
    } else if (userData[userId].correctAnswerCount > 0 && userData[userId].correctAnswerCount < 3) {
    //bot.sendMessage(userId, 'You have ' + userData[userId].correctAnswerCount + ' correct answers. Keep going! ☝️');
    bot.sendMessage(userId, '당신은 ' + userData[userId].correctAnswerCount + '개의 문항을 맞추셨습니다. 계속 진행하세요! ☝️');
    }
    });

    delete userData[userId];
});
