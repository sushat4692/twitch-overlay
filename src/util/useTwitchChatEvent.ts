import { useCallback, useEffect, useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';

// Types
import { TopicItem } from '../types/TopicItem';

// Const
import { CHANNEL_NAME } from '../const/App';
import TranslatePabpabWords from '../const/TranslatePabpab';
import TranslateDudbearWords from '../const/TranslateDudbear';

// Atoms
import { useValue as useCatsValue } from '../atoms/cats';
import { useValue as useCarsValue } from '../atoms/cars';
import { useValue as useBuildsValue } from '../atoms/builds';
import { useValue as useDinosValue } from '../atoms/dinos';
import { useTwitchChatBattle } from './useTwitchChatBattle';

import { chatClient } from './chatClient';

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

    const topicCommand = useCallback(
        (action: string, content: string) => {
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
        },
        [deleteTopic, popTopic]
    );

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
    const cats = useCatsValue();
    const cars = useCarsValue();
    const builds = useBuildsValue();
    const dinos = useDinosValue();

    const isInited = useRef(false);
    const [queue, setQueue] = useState<
        {
            channel: string;
            user: string;
            message: string;
            msg: TwitchPrivateMessage;
        }[]
    >([]);
    const { topics, topicShow, topicCommand } = useTopicActions();
    const translateCommand = useTranslateActions();

    const currentCommand = useCallback(
        (replyTo) => {
            const message = `現在の表示数 : 猫(${cats.length})、車(${cars.length})、建物(${builds.length})、恐竜(${dinos.length}) / Current numbers: Cats(${cats.length}), Cars(${cars.length}), Builds(${builds.length}) and Dinos(${dinos.length})`;
            chatClient.say(CHANNEL_NAME, message, { replyTo });
        },
        [cats, cars, dinos, builds]
    );

    const battleCommand = useTwitchChatBattle();

    const processQueue = useCallback(
        async ({
            channel,
            user,
            message,
            msg,
        }: {
            channel: string;
            user: string;
            message: string;
            msg: TwitchPrivateMessage;
        }) => {
            // console.log({ channel, user, message, msg });
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

            if (command === '!current') {
                currentCommand(msg);
            }

            if (command === '!battle') {
                battleCommand(msg, action);
            }
        },
        [currentCommand, topicCommand, translateCommand, battleCommand]
    );

    useEffect(() => {
        if (!queue.length) {
            return;
        }

        const current = queue[0];
        processQueue(current);
        setQueue(queue.filter((q) => q.msg.id !== current.msg.id));
    }, [queue, processQueue]);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        (async () => {
            await chatClient.connect();

            chatClient.onMessage(
                (
                    channel: string,
                    user: string,
                    message: string,
                    msg: TwitchPrivateMessage
                ) => {
                    setQueue((prev) => [
                        ...prev,
                        { channel, user, message, msg },
                    ]);
                }
            );
        })();
    }, []);

    return { topics, topicShow };
};
