
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const playerManager = require('../player');
const logger = require('../utils/logger');

module.exports = {
    name: 'interactionCreate',
    
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                await this.handleSlashCommand(interaction);
            } else if (interaction.isButton()) {
                await this.handleButtonInteraction(interaction);
            } else if (interaction.isStringSelectMenu()) {
                await this.handleSelectMenuInteraction(interaction);
            }
        } catch (error) {
            logger.error('Error handling interaction:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Lỗi hệ thống')
                .setDescription('Đã xảy ra lỗi khi xử lý tương tác!')
                .setTimestamp();

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    async handleSlashCommand(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) {
            logger.warn(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(`Error executing command ${interaction.commandName}:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Lỗi lệnh')
                .setDescription('Đã xảy ra lỗi khi thực hiện lệnh!')
                .setTimestamp();

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    async handleButtonInteraction(interaction) {
        const userId = interaction.user.id;
        const customId = interaction.customId;
        
        try {
            // Load the appropriate command based on button prefix
            if (customId.startsWith('help_') || customId.includes('guide') || customId.includes('support')) {
                const hotroCommand = require('../commands/hotro');
                return await this.handleHotroButtons(interaction, hotroCommand);
            } else if (customId.startsWith('cultivation_') || customId.includes('tuluyen')) {
                const tuluyenCommand = require('../commands/tuluyen');
                return await this.handleTuluyenButtons(interaction, tuluyenCommand);
            } else if (customId.startsWith('breakthrough_') || customId.includes('dotpha')) {
                const dotphaCommand = require('../commands/dotpha');
                return await this.handleDotphaButtons(interaction, dotphaCommand);
            } else if (customId.startsWith('shop_') || customId.includes('buy_')) {
                const shopCommand = require('../commands/shop');
                return await this.handleShopButtons(interaction, shopCommand);
            } else if (customId.includes('inventory') || customId.includes('equip_') || customId.includes('use_')) {
                const khoCommand = require('../commands/kho');
                return await this.handleKhoButtons(interaction, khoCommand);
            } else if (customId.includes('ranking') || customId.includes('bxh_')) {
                const bxhCommand = require('../commands/bxh');
                return await this.handleBxhButtons(interaction, bxhCommand);
            } else if (customId.startsWith('boss_') || customId.includes('fight_boss')) {
                const bossCommand = require('../commands/boss');
                return await this.handleBossButtons(interaction, bossCommand);
            } else if (customId.startsWith('admin_')) {
                const adminCommand = require('../commands/admin');
                return await this.handleAdminButtons(interaction, adminCommand);
            } else if (customId === 'start_cultivation') {
                await this.handleStartCultivation(interaction);
            } else if (customId === 'stop_cultivation') {
                await this.handleStopCultivation(interaction);
            } else if (customId === 'confirm_registration') {
                await this.handleRegistrationConfirm(interaction);
            } else if (customId === 'learn_more_first') {
                await this.handleLearnMore(interaction);
            } else if (customId === 'cancel_registration') {
                await this.handleCancelRegistration(interaction);
            } else {
                await interaction.reply({ content: '❌ Tương tác không được nhận diện!', ephemeral: true });
            }
        } catch (error) {
            logger.error('Error in button interaction:', error);
            await interaction.reply({ content: '❌ Có lỗi xảy ra khi xử lý tương tác!', ephemeral: true });
        }
    },

    async handleHotroButtons(interaction, command) {
        const customId = interaction.customId;
        
        if (customId === 'beginner_guide') {
            return await command.showBeginnerGuide(interaction);
        } else if (customId === 'advanced_guide') {
            return await command.showAdvancedGuide(interaction);
        } else if (customId === 'contact_support') {
            return await command.showContact(interaction);
        } else if (customId === 'commands_by_category') {
            return await command.showCommandsHelp(interaction);
        } else if (customId === 'command_examples') {
            await interaction.reply({ 
                content: '💡 **Ví dụ sử dụng commands:**\n\n`!dk` - Đăng ký tài khoản\n`!tuluyen` - Bắt đầu tu luyện\n`!dotpha` - Thực hiện đột phá\n`!shop` - Mở cửa hàng\n`!pvp @user` - Thách đấu PvP\n`!boss list` - Xem danh sách boss', 
                ephemeral: true 
            });
        } else {
            await interaction.reply({ content: '🔄 Chức năng đang được phát triển...', ephemeral: true });
        }
    },

    async handleTuluyenButtons(interaction, command) {
        const customId = interaction.customId;
        const player = playerManager.getPlayer(interaction.user.id);
        
        if (customId === 'cultivation_start') {
            return await command.startCultivation(interaction, player, interaction.client);
        } else if (customId === 'cultivation_complete') {
            return await command.completeCultivation(interaction, player, interaction.client);
        } else if (customId === 'cultivation_status') {
            return await command.showCultivationStatus(interaction, player, interaction.client);
        } else if (customId === 'cultivation_info') {
            return await command.showCultivationInfo(interaction, player, interaction.client);
        } else {
            await interaction.reply({ content: '🔄 Chức năng tu luyện đang được xử lý...', ephemeral: true });
        }
    },

    async handleDotphaButtons(interaction, command) {
        const customId = interaction.customId;
        const player = playerManager.getPlayer(interaction.user.id);
        
        if (customId === 'breakthrough_attempt') {
            return await command.attemptBreakthrough(interaction, player, interaction.client);
        } else if (customId === 'breakthrough_info') {
            return await command.showBreakthroughInfo(interaction, player, interaction.client);
        } else if (customId === 'breakthrough_history') {
            return await command.showBreakthroughHistory(interaction, player, interaction.client);
        } else if (customId === 'breakthrough_confirm') {
            return await command.executeBreakthrough(interaction, player, interaction.client);
        } else if (customId === 'breakthrough_cancel') {
            await interaction.update({ content: '❌ Đã hủy đột phá!', components: [] });
        } else {
            await interaction.reply({ content: '🔄 Chức năng đột phá đang được xử lý...', ephemeral: true });
        }
    },

    async handleShopButtons(interaction, command) {
        const customId = interaction.customId;
        const player = playerManager.getPlayer(interaction.user.id);
        
        if (customId === 'shop_weapons') {
            return await command.showWeaponsShop(interaction, player);
        } else if (customId === 'shop_armor') {
            return await command.showArmorShop(interaction, player);
        } else if (customId === 'shop_pills') {
            return await command.showPillsShop(interaction, player);
        } else if (customId === 'shop_materials') {
            return await command.showMaterialsShop(interaction, player);
        } else if (customId === 'shop_special') {
            return await command.showSpecialShop(interaction, player);
        } else if (customId === 'back_to_main_shop') {
            return await command.showMainShop(interaction, player);
        } else {
            await interaction.reply({ content: '🔄 Chức năng shop đang được xử lý...', ephemeral: true });
        }
    },

    async handleKhoButtons(interaction, command) {
        const customId = interaction.customId;
        const player = playerManager.getPlayer(interaction.user.id);
        
        if (customId === 'show_weapons_inventory') {
            return await command.showWeaponsInventory(interaction, player);
        } else if (customId === 'show_armor_inventory') {
            return await command.showArmorInventory(interaction, player);
        } else if (customId === 'show_pills_inventory') {
            return await command.showPillsInventory(interaction, player);
        } else if (customId === 'show_materials_inventory') {
            return await command.showMaterialsInventory(interaction, player);
        } else if (customId === 'auto_sort_inventory') {
            await interaction.reply({ content: '📋 Đã sắp xếp kho đồ tự động!', ephemeral: true });
        } else if (customId === 'inventory_statistics') {
            await interaction.reply({ content: '📊 Thống kê kho đồ đang được tải...', ephemeral: true });
        } else {
            await interaction.reply({ content: '🔄 Chức năng kho đồ đang được xử lý...', ephemeral: true });
        }
    },

    async handleBxhButtons(interaction, command) {
        const customId = interaction.customId;
        const player = playerManager.getPlayer(interaction.user.id);
        
        if (customId === 'find_my_rank') {
            const ranks = command.getPlayerRanks(player);
            await interaction.reply({
                content: `📍 **Vị trí của bạn:**\n🏔️ Cảnh giới: #${ranks.realm}\n💪 Sức mạnh: #${ranks.power}\n⚔️ PvP: #${ranks.pvp}`,
                ephemeral: true
            });
        } else if (customId === 'hall_of_fame') {
            await interaction.reply({ content: '🏛️ Hall of Fame đang được tải...', ephemeral: true });
        } else if (customId === 'weekly_rewards') {
            await interaction.reply({ content: '🎁 Phần thưởng tuần đang được tính toán...', ephemeral: true });
        } else {
            await interaction.reply({ content: '🔄 Chức năng bảng xếp hạng đang được xử lý...', ephemeral: true });
        }
    },

    async handleBossButtons(interaction, command) {
        const customId = interaction.customId;
        const player = playerManager.getPlayer(interaction.user.id);
        
        if (customId === 'show_boss_list') {
            return await command.showBossList(interaction, player);
        } else if (customId === 'recommended_boss') {
            await interaction.reply({ content: '🎯 Đang tìm boss phù hợp cho bạn...', ephemeral: true });
        } else if (customId === 'boss_preparation') {
            await interaction.reply({ content: '🛡️ Tips chuẩn bị chiến đấu với boss...', ephemeral: true });
        } else if (customId === 'boss_leaderboard') {
            return await command.showBossLeaderboard(interaction);
        } else if (customId.startsWith('fight_boss_')) {
            const bossId = customId.replace('fight_boss_', '');
            await interaction.reply({ content: `⚔️ Đang chuẩn bị chiến đấu với boss ${bossId}...`, ephemeral: true });
        } else {
            await interaction.reply({ content: '🔄 Chức năng boss đang được xử lý...', ephemeral: true });
        }
    },

    async handleAdminButtons(interaction, command) {
        const customId = interaction.customId;
        
        // Check admin permissions
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({ content: '❌ Bạn không có quyền sử dụng chức năng này!', ephemeral: true });
        }
        
        if (customId === 'admin_stats') {
            return await command.showBotStats(interaction);
        } else if (customId === 'admin_maintenance') {
            return await command.performMaintenance(interaction);
        } else if (customId === 'admin_backup') {
            return await command.createBackup(interaction);
        } else {
            await interaction.reply({ content: '🔄 Chức năng admin đang được xử lý...', ephemeral: true });
        }
    },

    async handleSelectMenuInteraction(interaction) {
        const selected = interaction.values[0];
        
        if (interaction.customId === 'select_ranking_category') {
            const bxhCommand = require('../commands/bxh');
            const player = playerManager.getPlayer(interaction.user.id);
            
            switch (selected) {
                case 'realm':
                    return await bxhCommand.showRealmRanking(interaction, player);
                case 'power':
                    return await bxhCommand.showPowerRanking(interaction, player);
                case 'pvp':
                    return await bxhCommand.showPvPRanking(interaction, player);
                case 'boss':
                    return await bxhCommand.showBossRanking(interaction, player);
                case 'coins':
                    return await bxhCommand.showCoinsRanking(interaction, player);
                default:
                    await interaction.reply({ content: '❌ Lựa chọn không hợp lệ!', ephemeral: true });
            }
        } else if (interaction.customId === 'help_category_select') {
            const hotroCommand = require('../commands/hotro');
            
            switch (selected) {
                case 'beginner':
                    return await hotroCommand.showBeginnerGuide(interaction);
                case 'commands':
                    return await hotroCommand.showCommandsHelp(interaction);
                case 'cultivation':
                    return await hotroCommand.showCultivationHelp(interaction);
                case 'combat':
                    return await hotroCommand.showCombatHelp(interaction);
                case 'shop':
                    return await hotroCommand.showShopHelp(interaction);
                case 'faq':
                    return await hotroCommand.showFAQ(interaction);
                default:
                    await interaction.reply({ content: '❌ Danh mục không hợp lệ!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: '❌ Menu không được nhận diện!', ephemeral: true });
        }
    },

    // Keep existing cultivation handlers
    async handleStartCultivation(interaction) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId);
        
        if (player.banned) {
            return interaction.reply({ 
                content: '🚫 Tài khoản của bạn đã bị cấm!', 
                ephemeral: true 
            });
        }

        if (player.isCultivating) {
            return interaction.reply({ 
                content: '❌ Bạn đang trong quá trình tu luyện!', 
                ephemeral: true 
            });
        }

        // Check daily limit
        const today = new Date().toDateString();
        const lastDate = player.lastCultivationDate ? 
            new Date(player.lastCultivationDate).toDateString() : null;
        
        if (lastDate !== today) {
            player.cultivationCount = 0;
        }

        if (player.cultivationCount >= 5) {
            return interaction.reply({ 
                content: '⏰ Bạn đã tu luyện đủ 5 lần hôm nay!', 
                ephemeral: true 
            });
        }

        // Start cultivation
        player.isCultivating = true;
        player.cultivationStartTime = Date.now();
        player.cultivationCount++;
        player.lastCultivationDate = new Date().toISOString();
        
        // Auto-complete after 30 minutes
        setTimeout(() => {
            if (player.isCultivating) {
                const expGained = 1800;
                player.exp += expGained;
                player.isCultivating = false;
                delete player.cultivationStartTime;
            }
        }, 30 * 60 * 1000);
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🧘‍♂️ BẮT ĐẦU TU LUYỆN')
            .setDescription('Bạn đã bắt đầu tu luyện! Sẽ tự động kết thúc sau 30 phút.')
            .addFields(
                {
                    name: '⏰ Thời gian',
                    value: '30 phút',
                    inline: true
                },
                {
                    name: '⚡ EXP/giây',
                    value: '1 EXP',
                    inline: true
                },
                {
                    name: '🎯 Tổng EXP',
                    value: '1,800 EXP',
                    inline: true
                }
            )
            .setTimestamp();

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('stop_cultivation')
                    .setLabel('⏹️ Dừng tu luyện')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({ embeds: [embed], components: [actionRow] });
    },

    async handleStopCultivation(interaction) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId);
        
        if (!player.isCultivating) {
            return interaction.reply({ 
                content: '❌ Bạn không đang tu luyện!', 
                ephemeral: true 
            });
        }
        
        const timeSpent = Date.now() - player.cultivationStartTime;
        const minutesSpent = Math.floor(timeSpent / (1000 * 60));
        const expGained = Math.floor(timeSpent / 1000);
        
        player.exp += expGained;
        player.isCultivating = false;
        delete player.cultivationStartTime;
        
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⏹️ DỪNG TU LUYỆN')
            .setDescription('Bạn đã dừng tu luyện!')
            .addFields(
                {
                    name: '⚡ EXP nhận được',
                    value: `${expGained.toLocaleString()} EXP`,
                    inline: true
                },
                {
                    name: '⏰ Thời gian tu luyện',
                    value: `${minutesSpent} phút`,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.update({ embeds: [embed], components: [] });
    },

    async handleRegistrationConfirm(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        
        try {
            // Check if player already has a real account
            const existingPlayer = await playerManager.getPlayer(userId, username);
            if (existingPlayer.createdAt) {
                return interaction.reply({ 
                    content: '⚠️ Bạn đã có tài khoản rồi!', 
                    ephemeral: true 
                });
            }

            // Create new player account
            const player = await playerManager.createPlayerAccount(userId, username);
            
            logger.info(`New player account created: ${username} (${userId})`);
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎉 ĐĂNG KÝ THÀNH CÔNG!')
                .setDescription(`Chào mừng **${username}** đến với thế giới tu tiên!`)
                .addFields(
                    {
                        name: '🏔️ Cảnh giới',
                        value: 'Phàm Nhân - Level 1',
                        inline: true
                    },
                    {
                        name: '💰 Tài sản',
                        value: '1,000 Coins',
                        inline: true
                    },
                    {
                        name: '🎁 Quà tân thủ',
                        value: 'Đã được thêm vào kho!',
                        inline: true
                    }
                )
                .setTimestamp();

            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('start_first_cultivation')
                        .setLabel('🧘‍♂️ Tu luyện lần đầu')
                        .setStyle(ButtonStyle.Success)
                );

            await interaction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
            logger.error('Error in handleRegistrationConfirm:', error);
            
            if (error.message === 'Player account already exists') {
                await interaction.reply({
                    content: '⚠️ Bạn đã có tài khoản rồi!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ Có lỗi xảy ra khi đăng ký!',
                    ephemeral: true
                });
            }
        }
    },

    async handleLearnMore(interaction) {
        const learnEmbed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('📚 HƯỚNG DẪN CHO NGƯỜI MỚI')
            .setDescription('Tất cả những gì bạn cần biết về tu tiên!')
            .addFields(
                {
                    name: '🧘‍♂️ Tu Luyện',
                    value: '• Sử dụng `!tuluyen` để bắt đầu\n• 5 lần tu luyện mỗi ngày\n• Nhận EXP để tăng level',
                    inline: true
                },
                {
                    name: '⚡ Đột Phá',
                    value: '• Sử dụng `!dotpha` khi đủ EXP\n• Tăng cảnh giới và sức mạnh\n• Mở khóa tính năng mới',
                    inline: true
                },
                {
                    name: '⚔️ Chiến Đấu',
                    value: '• PvP với `!pvp @user`\n• Đánh boss với `!boss`\n• Nhận rewards và EXP',
                    inline: true
                }
            )
            .setFooter({ text: 'Sẵn sàng bắt đầu chưa?' });
        
        await interaction.update({ embeds: [learnEmbed] });
    },

    async handleCancelRegistration(interaction) {
        const cancelEmbed = new EmbedBuilder()
            .setColor('#95A5A6')
            .setTitle('👋 HẸN GẶP LẠI')
            .setDescription('Bạn đã hủy đăng ký. Sử dụng `!dk` khi sẵn sàng!')
            .setFooter({ text: 'Tu tiên luôn chờ đón bạn!' });
        
        await interaction.update({ embeds: [cancelEmbed], components: [] });
    }
};
