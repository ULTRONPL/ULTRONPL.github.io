import openai
import discord

intents = discord.Intents.all()
client = discord.Client(intents=intents)

openai.api_key = ""
model_engine = "text-davinci-003"

conversation_history = []

@client.event
async def on_ready():
    print(f"Logged in as {client.user.name}")

@client.event
async def on_message(message):
    global conversation_history

    if message.author == client.user:
        return

    prompt = "".join(conversation_history + [f"{message.author}: {message.content}\n"])

    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=150,
        temperature=0.9,
        n=1,
        stop=None,
    )

    response_text = response.choices[0].text.strip()
    
    conversation_history.append(f"{client.user.name}: {response_text}")

    await message.channel.send(f"{message.author}: {response_text}")

client.run("")
