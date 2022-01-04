import { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { PubSubClient } from '@twurple/pubsub';
import { StaticAuthProvider } from '@twurple/auth';

// Types
import { AvatarFilter } from '../types/AvatarFilter';

// Context
import { ImageDescriptionContext } from '../context/ImageDescription';

// Util
import { play as playMeowSound } from './useMeowSound';
import { play as playBuildSound } from './useBuildSound';
import { play as playCarSound } from './useCarSound';
import {
    play as playAvatarSound,
    playGaming,
    playGrayScale,
    playGunya,
} from './useAvatarSound';
import { chatClient } from './useTwitchChatEvent';

// Const
import { CHANNEL_NAME, CLIENT_ID, CLIENT_TOKEN } from '../const/App';

let imageZoomTimer: ReturnType<typeof setTimeout> | null = null;
let avatarFilterTimer: ReturnType<typeof setTimeout> | null = null;
let avatarGunyaTimer: ReturnType<typeof setTimeout> | null = null;
export const pubSubClient = new PubSubClient();

export const useTwitchPubSubEvent = () => {
    const { description } = useContext(ImageDescriptionContext);

    const [cats, updateCats] = useState<{ id: string }[]>([
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ]);
    const [builds, updateBuilds] = useState<{ id: string }[]>([
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ]);
    const [cars, updateCars] = useState<{ id: string }[]>([
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ]);
    const [imageZoom, updateImageZoom] = useState(false);
    const [isAvatar8Bit, updateIsAvatar8Bit] = useState(false);
    const [isAvatarGunya, updateIsAvatarGunya] = useState(false);
    const [avatarFilter, updateAvatarFilter] = useState(AvatarFilter.Normal);

    useEffect(() => {
        (async () => {
            await pubSubClient.onRedemption(
                await pubSubClient.registerUserListener(
                    new StaticAuthProvider(CLIENT_ID, CLIENT_TOKEN)
                ),
                async (message) => {
                    switch (message.rewardId) {
                        case 'ac64948e-1c7e-4851-a2c8-995e788f7f55':
                            // ネコチャン
                            updateCats((prev) => [...prev, { id: uuid() }]);
                            playMeowSound();
                            break;
                        case 'fc757707-5252-4449-8f58-2639adbd0b67': {
                            // ネコチャン 3-7
                            const cnt = Math.floor(Math.random() * 5) + 3;
                            for (let i = 0; i < cnt; i += 1) {
                                updateCats((prev) => [...prev, { id: uuid() }]);
                            }
                            playMeowSound();
                            break;
                        }
                        case 'f5f977c9-418a-4cee-8b0c-f429dab30a41':
                            // 建物
                            updateBuilds((prev) => [...prev, { id: uuid() }]);
                            playBuildSound();
                            break;
                        case '0f10aab3-7ffd-430f-a0fd-5155528e904b': {
                            // 建物 3-7
                            const cnt = Math.floor(Math.random() * 5) + 3;
                            for (let i = 0; i < cnt; i += 1) {
                                updateBuilds((prev) => [
                                    ...prev,
                                    { id: uuid() },
                                ]);
                            }
                            playBuildSound();
                            break;
                        }
                        case '2ed2aab6-2dcd-4ae1-a8b1-44a8a76f5b96':
                            // 車
                            updateCars((prev) => [...prev, { id: uuid() }]);
                            playCarSound();
                            break;
                        case '65314b39-5013-43d7-bec8-d4e13738ffa1': {
                            // 車 3-7
                            const cnt = Math.floor(Math.random() * 5) + 3;
                            for (let i = 0; i < cnt; i += 1) {
                                updateCars((prev) => [...prev, { id: uuid() }]);
                            }
                            playCarSound();
                            break;
                        }
                        case 'e658cacc-6813-40b9-a8f7-c74e6e9d7deb':
                            // 写真ズーム
                            updateImageZoom(true);
                            if (imageZoomTimer) {
                                clearTimeout(imageZoomTimer);
                            }

                            imageZoomTimer = setTimeout(() => {
                                imageZoomTimer = null;
                                updateImageZoom(false);
                            }, 10000);
                            break;
                        case 'e4ab3a2d-602f-4174-9218-02cbdcde7bc0':
                            // 写真説明
                            chatClient.say(
                                CHANNEL_NAME,
                                `@${message.userName} ${
                                    description ??
                                    'ごめんなさい、説明がありません… / Sorry, No message...'
                                }`
                            );
                            break;
                        case '5d4ecec8-f38a-4845-8709-f681ccda6ff3':
                            // アバター切り替え
                            updateIsAvatar8Bit((prev) => !prev);
                            playAvatarSound();
                            break;
                        case '77fd6776-1552-4f22-ab8b-9cc4c126c584':
                            // アバター虹色に光る
                            updateAvatarFilter(AvatarFilter.Gaming);
                            if (avatarFilterTimer) {
                                clearTimeout(avatarFilterTimer);
                            }

                            avatarFilterTimer = setTimeout(() => {
                                avatarFilterTimer = null;
                                updateAvatarFilter(AvatarFilter.Normal);
                            }, 10000);
                            playGaming();
                            break;
                        case 'dd14164c-b966-4bf4-b01a-8fcf0073610a':
                            // アバター白黒になる
                            updateAvatarFilter(AvatarFilter.Grayscale);
                            if (avatarFilterTimer) {
                                clearTimeout(avatarFilterTimer);
                            }

                            avatarFilterTimer = setTimeout(() => {
                                avatarFilterTimer = null;
                                updateAvatarFilter(AvatarFilter.Normal);
                            }, 10000);
                            playGrayScale();
                            break;
                        case '14c22763-f7b8-4680-ab2a-2a858d8aa150':
                            // アバターがぐにゃぐにゃする
                            updateIsAvatarGunya(true);
                            if (avatarGunyaTimer) {
                                clearTimeout(avatarGunyaTimer);
                            }

                            avatarGunyaTimer = setTimeout(() => {
                                avatarGunyaTimer = null;
                                updateIsAvatarGunya(false);
                            }, 10000);
                            playGunya();
                            break;
                    }
                }
            );
        })();
    }, []);

    return {
        cats,
        builds,
        cars,
        imageZoom,
        isAvatar8Bit,
        isAvatarGunya,
        avatarFilter,
    };
};
