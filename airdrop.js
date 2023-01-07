import fs from "fs";

export default async function airdrop(bot,msg){
    const chatId = msg.chat.id;
    const userId = msg.chat.id;
    const username = msg.chat.username;
    const firstName = msg.chat.first_name;
    // send message asking user to check their DMs
    // await bot.sendMessage(chatId, `${firstName}, please check your DMs for a message from me.`);

    const namePrompt = await bot.sendMessage(userId, "Enter the wallet address where you want to receive your airdrop, please make sure is correct. 👉 This will be your TrustEVM wallet address, if it does not start with 👉 0x, it is not valid and you wont receive the airdrop!. You will receive the airdrop if you are within the first 300 users to register.", {
        reply_markup: {
            force_reply: true,
        },
    });

    bot.onReplyToMessage(userId, namePrompt.message_id, async (nameMsg) => {
        const name = nameMsg.text;

        if (name.substr(0, 2) !== "0x") {
            // send error message as DM
            await bot.sendMessage(userId, "Sorry, that is not a valid TrustEVM wallet address. Please make sure your wallet address starts with '0x'. Then try again by writing /airdropme here!");
        } else {
            const date = new Date();
            const time = date.toLocaleTimeString();
            // save date, time, username, and name in DB if you want to ...
            fs.appendFileSync('message.txt', `✅ Ok, you are all set! The date is ${date},  your username is ${username}, and your wallet address is ${name}.`);
            await bot.sendMessage(chatId, `✅ Ok, you are all set! The date is ${date},  your username is ${username}, you wallet address was stored.`);
            // delete the user prompt message
           // We dont need to do this anymore await bot.deleteMessage(userId, namePrompt.message_id);
        }
    });
};
