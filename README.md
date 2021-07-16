# NodBot
A simple Discord bot created by @voidf1sh#0420 for retreiving gifs, saving copypastas, and more coming soon.

## Dependencies
NodBot depends on `fs`, `discord.js`, `dotenv`, `giphy-api`, and `axios`.

## Features
Dynamic Help Message
Ability to save favorite gifs and copypastas

## Usage
All commands are provided as "file extensions" instead of prefixes to the message.

```
foo.gif -- Will return the first GIF for 'foo'
foo.savegif -- Will send the first GIF result for 'foo', with Reactions to browse the results and save the GIF
foo.savepasta -- Prompts the user for the copypasta text to save as 'foo.pasta'
foo.pasta -- If a copypasta by the name of 'foo' is saved, the bot will send it
foo.weather -- Returns the current weather in 'foo', where 'foo' is a city or ZIP code
foobar.spongebob - Returns 'FoObAr' aka SpongeBob text
.joint -- Puff, Puff, Pass.
```

## To Do
DONE: Clean up text input for copypastas, line breaks and apostrophes break the bot.
Add ability to reload commands, gifs, pastas, etc without rebooting the bot manually.
DONE: Change `savepasta` to use a collector and ask for the name or the pasta.
Add Stock quotes from Yahoo Finance API
Add self-delete if wrongbad'd
Move most string literals to config.json or strings.json for ease of editing.
Make construction of the `data` element easier for the createEmbeds functions.
Find a Cannabis API for strain information lookup.
