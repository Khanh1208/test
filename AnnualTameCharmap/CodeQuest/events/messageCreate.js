
const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        // Ignore messages from bots
        if (message.author.bot) return;
        
        // Check if message starts with prefix
        const prefix = '!';
        if (!message.content.startsWith(prefix)) return;
        
        // Parse command and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Get command from client
        const command = message.client.commands.get(commandName);
        if (!command) return;
        
        // Execute command with error handling
        try {
            logger.info(`👤 ${message.author.tag} used command: ${commandName}`);
            command.execute(message, args);
        } catch (error) {
            logger.error(`Error executing command ${commandName}:`, error);
            message.reply('❌ Đã xảy ra lỗi khi thực hiện lệnh này!');
        }
    },
};
