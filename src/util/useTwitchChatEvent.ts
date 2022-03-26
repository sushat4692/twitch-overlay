import { useCallback, useEffect, useState } from 'react';
import { ChatClient } from '@twurple/chat';
import { StaticAuthProvider } from '@twurple/auth';
import { v4 as uuid } from 'uuid';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';

import { TopicItem } from '../types/TopicItem';

// Const
import { CHANNEL_NAME, CLIENT_ID, CHAT_CLIENT_TOKEN } from '../const/App';
import TranslatePabpabWords from '../const/TranslatePabpab';
import TranslateDudbearWords from '../const/TranslateDudbear';

export const chatClient = new ChatClient({
    authProvider: new StaticAuthProvider(CLIENT_ID, CHAT_CLIENT_TOKEN),
    channels: [CHANNEL_NAME],
});

const useTopicActions = () => {
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

    const topicCommand = useCallback((action: string, content: string) => {
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
                if (content && parseInt(content).toString() == content) {
                    deleteTopic(parseInt(content));
                }
                break;
            case 'clear':
                updateTopics([]);
                break;
        }
    }, []);

    return { topics, topicShow, topicCommand };
};

const useTranslateActions = () => {
    const translateWord = (
        content: string,
        collection: { [key: string]: string }
    ) => {
        const WordKeis = Object.keys(collection);

        return WordKeis.reduce((prev, current, index) => {
            return prev.replaceAll(
                new RegExp(
                    current.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'),
                    'ig'
                ),
                `__index:${index}__`
            );
        }, content).replaceAll(/__index:([0-9]*?)__/gi, (match, index) => {
            const key = WordKeis[index];
            return match.replaceAll(match, collection[key]);
        });
    };

    return useCallback(
        (replyTo: TwitchPrivateMessage, action: string, content: string) => {
            const message = (() => {
                switch (action) {
                    case 'pabpab':
                        return translateWord(content, TranslatePabpabWords);
                    case 'dudbear': {
                        return translateWord(content, TranslateDudbearWords);
                    }
                }

                return null;
            })();

            if (!message) {
                return;
            }

            chatClient.say(CHANNEL_NAME, message, { replyTo });
        },
        []
    );
};

export const useTwitchChatEvent = () => {
    const { topics, topicShow, topicCommand } = useTopicActions();
    const translateCommand = useTranslateActions();

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
                        topicCommand(action, content);
                    }

                    if (command === '!translate') {
                        translateCommand(msg, action, content);
                    }
                }
            );
        })();
    }, []);

    return { topics, topicShow };
};
