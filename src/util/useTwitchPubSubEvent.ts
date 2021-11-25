import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { PubSubClient } from '@twurple/pubsub';
import { StaticAuthProvider } from '@twurple/auth';

// Util
import { playMeowSound } from './useMeowSound';
import { playBuildSound } from './useBuildSound';
import { playCarSound } from './useCarSound';

// Const
import { CLIENT_ID, CLIENT_TOKEN } from '../const/App';

let imageZoomTimer: ReturnType<typeof setTimeout> | null = null;
const pubSubClient = new PubSubClient();

export const useTwitchPubSubEvent = () => {
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
                            updateImageZoom(true);
                            if (imageZoomTimer) {
                                clearTimeout(imageZoomTimer);
                            }

                            imageZoomTimer = setTimeout(() => {
                                imageZoomTimer = null;
                                updateImageZoom(false);
                            }, 10000);
                            break;
                    }
                }
            );
        })();
    }, []);

    return { cats, builds, cars, imageZoom };
};
