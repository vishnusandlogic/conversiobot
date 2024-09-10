const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            const attachments = context.activity.attachments;
            if(attachments && attachments.length > 0) {
                for (const attachment of attachments) {
                    if (attachment.contentType.startsWith('audio/')) {
                        await this.handleAudioAttachment(context, attachment);
                    }
                }
            }
            else {
                const reply = await this.sendData(context.activity.text);
                await context.sendActivity(MessageFactory.text(JSON.stringify(reply)));
                const replyText = `Echo: ${context.activity.text}`;
                await context.sendActivity(MessageFactory.text(JSON.stringify(reply)));

            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async sendData(message) {
        let data = null;
        const url = `https://api.coindesk.com/v1/bpi/currentprice.json`;
        await axios.get(url)
            .then(response => {
                // Handle success
                console.log('Data:', response.data);
                data = response.data;
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });

            return data;
    }

    async handleAudioAttachment(context, attachment) {
        const audioUrl = attachment.contentUrl;
        try {
            // Download the audio file
            const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
            console.log(`File is ready Response ${response.data}`);
            console.log(`File is ready Response Data ${response.data}`);
            // Send the audio file to another API
            // await this.sendAudioToApi(response.data);

            await context.sendActivity('Audio file received and processed.');
        } catch (error) {
            console.error('Error handling audio attachment:', error);
            await context.sendActivity('Failed to process the audio file.');
        }
    }
}

module.exports.EchoBot = EchoBot;
