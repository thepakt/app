import {TelegramClient} from "telegram";
import {Api} from "telegram/tl";
import {API_HASH, API_ID, BOT_TOKEN} from "./env.ts";
import input from "input";
import express from "express";

const client = new TelegramClient(
    'user', API_ID, API_HASH, {connectionRetries: 5});
// Initialize Express app
const app = express();
app.use(express.json());

client.start({
    phoneCode: async () => input.text('Enter your phone code: '),
    phoneNumber: async () => input.text('Enter your phone number: '),
    password: async () => input.password('Enter your 2FA password: '),
    onError: (err) => console.error(err),
}).catch(console.error);

async function createChat(...users: string[]) {
    const result = await client.invoke(
        new Api.messages.CreateChat({
            users,
            title: "Hello guys bot"
        })
    );

    // Log the result
    return result;
}


app.post('/create-chat', (req, res) => {
    //check that params.hash === "aboba"
    if (req.body.hash !== 'aboba') {
        res.status(401).send('Invalid hash');
        return;
    }
    const {users} = req.body;

    if (!Array.isArray(users) || users.length === 0) {
        res.status(400).send('Invalid users array');
    }

    try {
        createChat(...users)
            .then(result => res.json(result.toJSON()))
            .catch(error => {
                console.error(error);
                res.status(500).send('Failed to create chat');
            })
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create chat');
    }

});

// Start the server
const PORT = process.env.PORT || 13452;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});