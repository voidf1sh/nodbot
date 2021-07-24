# Release Notes

## v2.2.0
NodBot no longer stores saved GIFs, Copypastas, and other custom content locally. This means no more discrepancies between versions of the bot!

## v2.1.0
Want to add a phrase to the `.joint` rotation? Try `<phrase>.roll`.

Wondering what GIFs and Copypastas have been saved? Try `.gifs` and `.pastas`, also check out the new help message with `.help`!

NodBot now uses Tenor instead of Giphy for GIF searches!

Changing the method to search for and save GIFs for later reuse. Previously the bot simply sent a message containing the link to a GIF which Discord would display in the chat. However the new code uses Embeds to make the messages look prettier. These Embeds require a *direct* link to the GIF, which isn't very user friendly. Now you can search for a GIF and NodBot will DM you with results for you to browse before choosing the GIF you'd like to save, then name it.

Generic bug squashing, sanitizing of inputs, setting up some configs for deployment on Heroku.

Updating Copypasta save method to be interactive and give a less complicated command syntax.