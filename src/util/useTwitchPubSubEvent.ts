import { useEffect, useContext, useCallback, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { PubSubClient } from '@twurple/pubsub';
import { toast } from 'react-toastify';

// Atoms
import {
    useCatsSetter,
    useCarsSetter,
    useBuildsSetter,
    useDinosSetter,
    useIsImageZoomSetter,
    useIsAvatar8BitSetter,
    useIsAvatarGunyaSetter,
    useIsAvatarBiggerSetter,
    useIsAvatarFocusSetter,
    useIsAvatarGlitchSetter,
    useWeatherSetter,
    useAvatarFilterSetter,
} from '@/atoms';

// Types
import { AvatarFilter, WeatherType } from '@/types';

// Context
import { ImageDescriptionContext } from '@/context';

// Util
import {
    playMeowSound,
    playBuildSound,
    playCarSound,
    playDinoSound,
    playAvatarSound,
    playGaming,
    playGrayScale,
    playGunya,
    playFocus,
    playZoomin,
    playZoomout,
    playGlitch,
    playRain,
    playSnow,
    playLvup,
    chatClient,
} from '@/util';

// Const
import { CHANNEL_NAME, authProvider } from '@/const';

let imageZoomTimer: ReturnType<typeof setTimeout> | null = null;
let avatarFilterTimer: ReturnType<typeof setTimeout> | null = null;
let avatarGunyaTimer: ReturnType<typeof setTimeout> | null = null;
let avatarBiggerTimer: ReturnType<typeof setTimeout> | null = null;
let avatarFocusTimer: ReturnType<typeof setTimeout> | null = null;
let avatarGlitchTimer: ReturnType<typeof setTimeout> | null = null;
let weatherTimer: ReturnType<typeof setTimeout> | null = null;
export const pubSubClient = new PubSubClient();

declare global {
    interface Window {
        redemptionHandler: (
            rewardId: string,
            userName: string
        ) => Promise<void>;
    }
}

export const useTwitchPubSubEvent = () => {
    const isInited = useRef(false);
    const { description } = useContext(ImageDescriptionContext);

    const updateCats = useCatsSetter();
    const pushCats = (num = 1) => {
        const pusher: { id: string }[] = [];
        for (let i = 0; i < num; i += 1) {
            pusher.push({ id: uuid() });
        }

        updateCats((prev) => {
            if ((prev.length % 10) + num >= 10) {
                setTimeout(() => {
                    toast(
                        `Cat's Level Up to "${
                            Math.floor((prev.length + num) / 10) + 1
                        }"!`
                    );
                    playLvup();
                }, 300);
            }

            return [...prev, ...pusher];
        });
    };

    const updateBuilds = useBuildsSetter();
    const pushBuilds = (num = 1) => {
        const pusher: { id: string }[] = [];
        for (let i = 0; i < num; i += 1) {
            pusher.push({ id: uuid() });
        }

        updateBuilds((prev) => {
            if ((prev.length % 10) + num >= 10) {
                setTimeout(() => {
                    toast(
                        `Build's Level Up to "${
                            Math.floor((prev.length + num) / 10) + 1
                        }"!`
                    );
                    playLvup();
                }, 300);
            }

            return [...prev, ...pusher];
        });
    };

    const updateCars = useCarsSetter();
    const pushCars = (num = 1) => {
        const pusher: { id: string }[] = [];
        for (let i = 0; i < num; i += 1) {
            pusher.push({ id: uuid() });
        }

        updateCars((prev) => {
            if ((prev.length % 10) + num >= 10) {
                setTimeout(() => {
                    toast(
                        `Car's Level Up to "${
                            Math.floor((prev.length + num) / 10) + 1
                        }"!`
                    );
                    playLvup();
                }, 300);
            }

            return [...prev, ...pusher];
        });
    };

    const updateDinos = useDinosSetter();
    const pushDinos = (num = 1) => {
        const pusher: { id: string }[] = [];
        for (let i = 0; i < num; i += 1) {
            pusher.push({ id: uuid() });
        }

        updateDinos((prev) => {
            if ((prev.length % 10) + num >= 10) {
                setTimeout(() => {
                    toast(
                        `Dino's Level Up to "${
                            Math.floor((prev.length + num) / 10) + 1
                        }"!`
                    );
                    playLvup();
                }, 300);
            }

            return [...prev, ...pusher];
        });
    };

    const updateImageZoom = useIsImageZoomSetter();
    const updateIsAvatar8Bit = useIsAvatar8BitSetter();
    const updateIsAvatarGunya = useIsAvatarGunyaSetter();
    const updateIsAvatarBigger = useIsAvatarBiggerSetter();
    const updateIsAvatarFocus = useIsAvatarFocusSetter();
    const updateIsAvatarGlitch = useIsAvatarGlitchSetter();
    const updateWeather = useWeatherSetter();
    const updateAvatarFilter = useAvatarFilterSetter();

    const redemptionHandler = useCallback(
        async (rewardId: string, userName = '') => {
            // console.log(rewardId);
            switch (rewardId) {
                case 'ac64948e-1c7e-4851-a2c8-995e788f7f55':
                    // ネコチャン
                    pushCats();
                    playMeowSound();
                    break;
                case 'fc757707-5252-4449-8f58-2639adbd0b67': {
                    // ネコチャン 3-7
                    const cnt = Math.floor(Math.random() * 5) + 3;
                    pushCats(cnt);
                    playMeowSound();
                    break;
                }
                case 'f5f977c9-418a-4cee-8b0c-f429dab30a41':
                    // 建物
                    pushBuilds();
                    playBuildSound();
                    break;
                case '0f10aab3-7ffd-430f-a0fd-5155528e904b': {
                    // 建物 3-7
                    const cnt = Math.floor(Math.random() * 5) + 3;
                    pushBuilds(cnt);
                    playBuildSound();
                    break;
                }
                case '2ed2aab6-2dcd-4ae1-a8b1-44a8a76f5b96':
                    // 車
                    pushCars();
                    playCarSound();
                    break;
                case '65314b39-5013-43d7-bec8-d4e13738ffa1': {
                    // 車 3-7
                    const cnt = Math.floor(Math.random() * 5) + 3;
                    pushCars(cnt);
                    playCarSound();
                    break;
                }
                case 'aa504142-b0e1-4a18-914b-65201ad76f6b':
                    // 恐竜
                    pushDinos();
                    playDinoSound();
                    break;
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
                        `@${userName} ${
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
                case '9d7fd0dc-6ccd-4e35-a0a7-e14dea4b0922':
                    // 強いられるアバター
                    updateIsAvatarFocus(true);
                    if (avatarFocusTimer) {
                        clearTimeout(avatarFocusTimer);
                    }

                    avatarFocusTimer = setTimeout(() => {
                        avatarFocusTimer = null;
                        updateIsAvatarFocus(false);
                    }, 10000);
                    playFocus();
                    break;
                case 'ac73f2a1-6311-4115-9076-0940da62c889':
                    // アバターが大きくなる
                    updateIsAvatarBigger(true);
                    if (avatarBiggerTimer) {
                        clearTimeout(avatarBiggerTimer);
                    }

                    avatarBiggerTimer = setTimeout(() => {
                        avatarBiggerTimer = null;
                        updateIsAvatarBigger(false);
                        playZoomout();
                    }, 10000);
                    playZoomin();
                    break;
                case '3b2952b8-bf53-45b7-af08-b608695dcce2':
                    // アバターがグリッチ
                    updateIsAvatarGlitch(true);
                    if (avatarGlitchTimer) {
                        clearTimeout(avatarGlitchTimer);
                    }

                    avatarGlitchTimer = setTimeout(() => {
                        avatarGlitchTimer = null;
                        updateIsAvatarGlitch(false);
                    }, 10000);
                    playGlitch();
                    break;
                case 'b6c72ccb-924f-4b11-9ff2-696b76360ff9':
                    // 雨を降らせる
                    updateWeather(WeatherType.Rain);
                    if (weatherTimer) {
                        clearTimeout(weatherTimer);
                    }

                    weatherTimer = setTimeout(() => {
                        weatherTimer = null;
                        updateWeather(WeatherType.Normal);
                    }, 10000);
                    playRain();
                    break;
                case '124a28cd-5547-4f56-8514-8926f19540e2':
                    // 雪を降らせる
                    updateWeather(WeatherType.Snow);
                    if (weatherTimer) {
                        clearTimeout(weatherTimer);
                    }

                    weatherTimer = setTimeout(() => {
                        weatherTimer = null;
                        updateWeather(WeatherType.Normal);
                    }, 10000);
                    playSnow();
                    break;
            }
        },
        [description]
    );
    window.redemptionHandler = redemptionHandler;

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        (async () => {
            await pubSubClient.onRedemption(
                await pubSubClient.registerUserListener(authProvider),
                async (message) => {
                    await redemptionHandler(message.rewardId, message.userName);
                }
            );
        })();
    }, []);
};
