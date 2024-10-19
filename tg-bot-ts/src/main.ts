import {TelegramClient} from "telegram";
import {Api} from "telegram/tl";
import {API_HASH, API_ID, BOT_TOKEN} from "./env.ts";
import input from "input";

(async () => {
    const client = new TelegramClient(
        'user', API_ID, API_HASH, {connectionRetries: 5});
    // Start the Telegram bot client using the bot token
    // await client.start({
    //
    // });
    await client.start({
        phoneCode: async () => input.text('Enter your phone code: '),
        phoneNumber: async () => input.text('Enter your phone number: '),
        password: async () => input.password('Enter your 2FA password: '),
        onError: (err) => console.error(err),
    });

    // Create a new chat with specific users and title
    const result = await client.invoke(
        new Api.messages.CreateChat({
            users: ["nikivi", "imartemy"],
            title: "Test chat created by the bot"
        })
    );

    // Log the result
    console.log(result.toJSON());
})();
