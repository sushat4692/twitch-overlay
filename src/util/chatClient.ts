import { ChatClient } from '@twurple/chat';

// Const
import { CHANNEL_NAME } from '@/const/App';
import { authProvider } from '@/const/AuthProvider';

export const chatClient = new ChatClient({
    authProvider,
    channels: [CHANNEL_NAME],
});
