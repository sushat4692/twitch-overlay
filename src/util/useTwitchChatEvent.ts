import { useCallback, useEffect, useState } from 'react';
import { ChatClient } from '@twurple/chat';
import { StaticAuthProvider } from '@twurple/auth';
import { v4 as uuid } from 'uuid';

import { TopicItem } from '../types/TopicItem';

// Const
import { CHANNEL_NAME, CLIENT_ID, CLIENT_TOKEN } from '../const/App';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';

export const chatClient = new ChatClient({
    authProvider: new StaticAuthProvider(CLIENT_ID, CLIENT_TOKEN),
    channels: [CHANNEL_NAME],
});

export const useTwitchChatEvent = () => {
    const [topics, updateTopics] = useState<TopicItem[]>([]);
    const [topicShow, updateTopicShow] = useState<boolean>(true);

    const deleteTopic = useCallback((t: number) => {
        updateTopics((prev) =>
            prev.map((p, i) => (i !== t ? p : { ...p, ...{ hiding: true } }))
        );

        setTimeout(() => {
            updateTopics((prev) => prev.filter((_, i) => i !== t));
        }, 400);
    }, []);

    const popTopic = useCallback(() => {
        updateTopics((prev) =>
            prev.map((p, i) =>
                i !== prev.length - 1 ? p : { ...p, ...{ hiding: true } }
            )
        );

        setTimeout(() => {
            updateTopics((prev) =>
                prev.filter((_, i) => i !== prev.length - 1)
            );
        }, 400);
    }, []);

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

                    const [command, action, ...contents] = message
                        .split(' ')
                        .filter((m) => m.length);
                    const content = contents.join(' ');

                    if (command === '!topic' && msg.userInfo.isBroadcaster) {
                        switch (action) {
                            case 'push':
                                if (content) {
                                    updateTopics((prev) => [
                                        ...prev,
                                        { id: uuid(), content, hiding: false },
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
                                popTopic();
                                break;
                            case 'shift':
                                deleteTopic(0);
                                break;
                            case 'delete':
                                if (
                                    content &&
                                    parseInt(content).toString() == content
                                ) {
                                    deleteTopic(parseInt(content));
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
