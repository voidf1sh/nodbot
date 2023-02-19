const Collection = require('@discordjs/collection');

module.exports = {
    CommandData: class {
        constructor() {
            this.name = "";
            this.type = ""; // "dot" or "slash"
            this.isValid = false;
            this.guildId = "";
        }
    },
    GlobalContentManager: class {
        constructor(collections) {
            const { pastas, joints, mds, gifs, strains } = collections;
            this.pastas = (pastas instanceof Collection) ? pastas : new Collection();
            this.joints = (joints instanceof Collection) ? joints: new Collection();
            this.mds = (mds instanceof Collection) ? mds : new Collection();
            this.gifs = (gifs instanceof Collection) ? gifs : new Collection();
            this.strains = (strains instanceof Collection) ? strains : new Collection();
            this.guildId = "GLOBAL";
        
            this.queryBuilders = {
                insert: {
                    pasta(title, content) {
                        // Upload a copypasta to the database
                        const rawQuery = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
                        const values = ["pastas", "title", "content", "guild_id", title, content, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(content) {
                        // Upload a stoner catchphrase to the database
                        const rawQuery = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
                        const values = ["joints", "content", "guild_id", content, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(content) {
                        // Upload medical advice to the database
                        const rawQuery = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
                        const values = ["mds", "content", "guild_id", content, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title, url) {
                        // Upload an embeddable media url to the database
                        const rawQuery = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
                        const values = ["media", "title", "url", "guild_id", title, url, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    strain(name, type, effects, flavor, rating) {
                        // Upload an embeddable media url to the database
                        const rawQuery = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
                        const values = ["media", "title", "url", "guild_id", title, url, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                },
                select: {
                    pasta(title) {
                        // Fetch a copypasta from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["pastas", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(id) {
                        // Fetch a stoner catchphrase from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["joints", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(id) {
                        // Fetch medical advice from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["mds", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title) {
                        // Fetch an embeddable media url from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["media", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                },
                update: {
                    pasta(title, content) {
                        // Update a copypasta in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["pastas", {content: content}, "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(id, content) {
                        // Update a stoner catchphrase in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["joints", {content: content}, "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(id, content) {
                        // Update medical advice in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["mds", {content: content}, "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title, url) {
                        // Update an embeddable media url in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["media", {url: url}, "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                },
                delete: {
                    pasta(title) {
                        // Delete a copypasta from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["pastas", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(id) {
                        // Delete a stoner catchphrase from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["joints", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(id) {
                        // Delete medical advice from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["mds", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title) {
                        // Delete an embeddable media url from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["media", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                }
            }
        }
        
    },
    GuildContentManager: class {
        constructor(collections) {
            const { pastas, joints, mds, gifs } = collections;
            this.pastas = (pastas instanceof Collection) ? pastas : new Collection();
            this.joints = (joints instanceof Collection) ? joints: new Collection();
            this.mds = (mds instanceof Collection) ? mds : new Collection();
            this.gifs = (gifs instanceof Collection) ? gifs : new Collection();
            this.guildId = "";
        
            this.queryBuilders = {
                insert: {
                    pasta(title, content) {
                        // Upload a copypasta to the database
                        const rawQuery = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
                        const values = ["pastas", "title", "content", "guild_id", title, content, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(content) {
                        // Upload a stoner catchphrase to the database
                        const rawQuery = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
                        const values = ["joints", "content", "guild_id", content, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(content) {
                        // Upload medical advice to the database
                        const rawQuery = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
                        const values = ["mds", "content", "guild_id", content, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title, url) {
                        // Upload an embeddable media url to the database
                        const rawQuery = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
                        const values = ["media", "title", "url", "guild_id", title, url, this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                },
                select: {
                    pasta(title) {
                        // Fetch a copypasta from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["pastas", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(id) {
                        // Fetch a stoner catchphrase from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["joints", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(id) {
                        // Fetch medical advice from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["mds", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title) {
                        // Fetch an embeddable media url from the database
                        const rawQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["media", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                },
                update: {
                    pasta(title, content) {
                        // Update a copypasta in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["pastas", {content: content}, "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(id, content) {
                        // Update a stoner catchphrase in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["joints", {content: content}, "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(id, content) {
                        // Update medical advice in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["mds", {content: content}, "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title, url) {
                        // Update an embeddable media url in the database
                        const rawQuery = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
                        const values = ["media", {url: url}, "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                },
                delete: {
                    pasta(title) {
                        // Delete a copypasta from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["pastas", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    joint(id) {
                        // Delete a stoner catchphrase from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["joints", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    md(id) {
                        // Delete medical advice from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["mds", "id", id, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    },
                    media(title) {
                        // Delete an embeddable media url from the database
                        const rawQuery = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        const values = ["media", "title", title, "guild_id", this.guildId];
                        return {
                            rawQuery: rawQuery,
                            values: values
                        }
                    }
                }
            }
        }
    }
}