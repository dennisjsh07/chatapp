// Import necessary modules and models
const cron = require('node-cron');
const Chat = require('../model/chat'); // Import Chat model
const ArchivedChat = require('../model/archivedChat'); // Import ArchivedChat model
const { Op } = require('sequelize');

// Define a cron job that runs every night at a specified time (e.g., 1:00 AM)
exports.cronJob = cron.schedule('0 1 * * *', async () => {
    try {
        // Calculate the date one day ago from the current date
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        // Find and select all messages in the Chat table that are one day old or older
        const messagesToArchive = await Chat.findAll({
            where: {
                createdAt: {
                    [Op.lte]: oneDayAgo,
                },
            },
        });

        // Bulk insert the selected messages into the ArchivedChat table
        await ArchivedChat.bulkCreate(
            messagesToArchive.map((message) => ({
                name: message.name,
                message: message.message,
                fileUrl: message.fileUrl,
            }))
        );

        // Delete the archived messages from the Chat table
        await Chat.destroy({
            where: {
                createdAt: {
                    [Op.lte]: oneDayAgo,
                },
            },
        });

        console.log('Archived messages successfully.');
    } catch (error) {
        console.error('Error archiving messages:', error);
    }
});
