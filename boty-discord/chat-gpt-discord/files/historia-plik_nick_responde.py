import openai
import discord

intents = discord.Intents.all()
client = discord.Client(intents=intents)

openai.api_key = ""

with open('conversation_history.txt', 'r') as f:
    conversation_history = [line.strip() for line in f.readlines()]

@client.event
async def on_ready():
    print(f"Logged in as {client.user.name}")

@client.event
async def on_message(message):
    global conversation_history

    if message.author == client.user:
        return

    if message.channel.id != 888043542033862669:
        return

    prompt = "".join(conversation_history + [f"{message.author}: {message.content}\n"])

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
        temperature=0.9,
        n=1,
        stop=None,
    )

    response_text = response.choices[0].text.strip()
    
    conversation_history.append(f"{client.user.name}: {response_text}")

    with open('conversation_history.txt', 'w') as f:
        f.write('\n'.join(conversation_history))

    await message.channel.send(f"{message.author}: {response_text}")

client.run("")
