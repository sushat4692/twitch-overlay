import { useEffect, useState } from 'react';
import { ChatClient } from '@twurple/chat';
import { StaticAuthProvider } from '@twurple/auth';
import { v4 as uuid } from 'uuid';

// Const
import { CHANNEL_NAME, CLIENT_ID, CLIENT_TOKEN } from '../const/App';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';

console.log(CHANNEL_NAME);

const chatClient = new ChatClient({
    authProvider: new StaticAuthProvider(CLIENT_ID, CLIENT_TOKEN),
    channels: [CHANNEL_NAME],
});

export const useTwitchChatEvent = () => {
    const [topics, updateTopics] = useState<{ id: string; content: string }[]>(
        []
    );
    const [topicShow, updateTopicShow] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            await chatClient.connect();

            chatClient.onMessage(
                async (
                    channel: string,
                    user: string,
                    message: string,
                    msg: TwitchPrivateMessage
                ) => {
                    if (channel !== `#${CHANNEL_NAME}`) {
                        return;
                    }

                    const [command, action, content] = message
                        .split(' ')
                        .filter((m) => m.length);

                    if (command === '!topic' && msg.userInfo.isBroadcaster) {
                        switch (action) {
                            case 'push':
                                if (content) {
                                    updateTopics((prev) => [
                                        ...prev,
                                        { id: uuid(), content },
                                    ]);
                                }
                                break;
                            case 'show':
                                updateTopicShow(true);
                                break;
                            case 'hide':
                                updateTopicShow(false);
                                break;
                            case 'pop':
                                updateTopics((prev) => prev.slice(0, -1));
                                break;
                            case 'shift':
                                updateTopics((prev) => prev.slice(1));
                                break;
                            case 'delete':
                                if (
                                    content &&
                                    parseInt(content).toString() == content
                                ) {
                                    const t = parseInt(content);
                                    updateTopics((prev) =>
                                        prev.filter((_, i) => i !== t)
                                    );
                                }
                                break;
                            case 'clear':
                                updateTopics([]);
                                break;
                        }
                    }
                }
            );
        })();
    }, []);

    return { topics, topicShow };
};
