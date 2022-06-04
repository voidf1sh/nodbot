# About Nodbot
Nodbot is a content saving and serving Discord bot. Nodbot is able to search Tenor for GIFs, save custom copypastas, and look up marijuana strain information. Nodbot is in semi-active development by voidf1sh. It's buggy as hell and very shoddily built. Don't use it.

# Nodbot Help

Use the `/help` command to see the bot's help message.

## Create Docker Image
`docker build --tag=name/nodbot .`

## Push Docker Image
`docker push name/nodbot`

# Immediate To-Do

1. ~~Sanitize inputs for SQL queries.~~ Done.
2. ~~Move environment variables so they don't get included in the image.~~
3. Implement error handling on all actions.
4. Ephemeral responses to some/most slash commands.
5. Comment the code! Document!