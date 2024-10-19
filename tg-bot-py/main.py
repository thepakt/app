from telethon.sync import TelegramClient
from telethon import functions

# TODO: ask durov or somebody, how to make sure this is not rate limited..
with TelegramClient('user').start() as client:
    result = client(functions.messages.CreateChatRequest(
        # TODO: add our escrow bot to the chat too
        # TODO: make the escrow bot, log all messages to the chat
        users=["nikivi", "imartemy", "todo_escrow_bot"],
        title="Do Thing.",
    ))
    print(result.stringify())

