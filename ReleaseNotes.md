# Release Notes

## To Do
Move most string literals to config.json or strings.json for ease of editing.
Make construction of the `data` element easier for the createEmbeds functions.
Find a Cannabis API for strain information lookup.

## v2.1
Changing the method to search for and save GIFs for later reuse. Previously the bot simply sent a message containing the link to a GIF which Discord would display in the chat. However the new code uses Embeds to make the messages look prettier. These Embeds require a *direct* link to the GIF, which isn't very user friendly. Now you can search for a GIF and NodBot will DM you with results for you to browse before choosing the GIF you'd like to save, then name it.
Generic bug squashing, sanitizing of inputs, setting up some configs for deployment on Heroku.