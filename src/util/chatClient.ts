import { ChatClient } from '@twurple/chat';
import { StaticAuthProvider } from '@twurple/auth';

// Const
import { CHANNEL_NAME, CLIENT_ID, CHAT_CLIENT_TOKEN } from '../const/App';

export const chatClient = new ChatClient({
    authProvider: new StaticAuthProvider(CLIENT_ID, CHAT_CLIENT_TOKEN),
    channels: [CHANNEL_NAME],
});
