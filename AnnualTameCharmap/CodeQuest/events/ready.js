
const { Events, ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.startup(`🤖 Tu Tiên Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);
        
        // Set bot status
        client.user.setActivity('Tu Tiên cultivation', { 
            type: ActivityType.Playing 
        });
        
        logger.info(`📊 Bot đang phục vụ ${client.guilds.cache.size} servers`);
        logger.info(`👥 Tổng cộng ${client.users.cache.size} users`);
    },
};
