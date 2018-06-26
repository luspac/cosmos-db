const { BotFrameworkAdapter, ConversationState, UserState, BotStateSet, MessageFactory } = require("botbuilder");
const { CosmosDbStorage } = require("botbuilder-azure");
const restify = require("restify");
const { DialogSet, TextPrompt } = require("botbuilder-dialogs");

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var cosmosDB = new CosmosDbStorage({
    serviceEndpoint: 'https://lucas-cosmos-db.documents.azure.com:443/',
    authKey: 'VloIqoMckfrFoa8AtWfjgRrmRGLm9I8Bt9MUgDeI1ldbBWrn20XBn9IhwhMY0wBcAZhkaX6ihmAcEJ42Lxuzsw==',
    databaseId: 'Tasks',
    collectionId: 'Items'
});

// Using cosmosDb as the storage provider
// const conversationState = new ConversationState(cosmosDB);
const convoState = new ConversationState(cosmosDB);
const userState  = new UserState(cosmosDB);

adapter.use(new BotStateSet(convoState, userState));

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        
        const isMessage = context.activity.type === 'message';

        const utterance = (context.activity.text || '').trim().toLowerCase();

        // State will store all of your information 
        const convo = convoState.get(context);
        // const user = userState.get(context); // userState will not be used in this example

        const dc = dialogs.createContext(context, convo);

        await dc.continue(); // Continue the current dialog if one is currently active

        // Default action
        if (!context.responded && isMessage) {

            // Getting the user info from the state
            const userinfo = userState.get(dc.context); 

            if(utterance.includes('history')){
                console.log(userinfo.guestInfo);
            }

            // If guest info is undefined prompt the user to check in
            if(!userinfo.guestInfo){
                await dc.begin('checkInPrompt');
            }else{
                await dc.begin('mainMenu'); 
            }           
        }
    });
});

const dialogs = new DialogSet();
dialogs.add('mainMenu', [
    async function (dc, args) {
        const menu = ["Reserve Table", "Wake Up"];
        await dc.context.sendActivity(MessageFactory.suggestedActions(menu));    
    },
    async function (dc, result){
        // Decide which module to start
        switch(result){
            case "Reserve Table":
                await dc.begin('reservePrompt');
                break;
            case "Wake Up":
                await dc.begin('wakeUpPrompt');
                break;
            default:
                await dc.context.sendActivity("Sorry, i don't understand that command. Please choose an option from the list below.");
                break;            
        }
    },
    async function (dc, result){
        await dc.replace('mainMenu'); // Show the menu again
    }

]);

// Importing the dialogs 
const checkIn = require("./checkIn");
dialogs.add('checkInPrompt', new checkIn.CheckIn(userState));

const reserve_table = require("./reserveTable");
dialogs.add('reservePrompt', new reserve_table.ReserveTable(userState));

const wake_up = require("./wake_up");
dialogs.add('wakeUpPrompt', new wake_up.WakeUp(userState));


