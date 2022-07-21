import { PrivateMessage } from '@twurple/chat/lib';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { useCallback, useEffect } from 'react';
import { useState } from '../atoms/battle';
import { CHANNEL_NAME } from '../const/App';
import { chatClient } from './chatClient';

const getRandomArbitrary = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const useTwitchChatBattle = () => {
    const [battle, setBattle] = useState();

    const battleStart = useCallback(
        (msg: TwitchPrivateMessage) => {
            if (battle.is_battle) {
                chatClient.say(
                    CHANNEL_NAME,
                    '既に戦闘中です / The battle is already started',
                    { replyTo: msg }
                );
                return;
            }

            const your_hp = getRandomArbitrary(32, 64);

            const enemy_index = getRandomArbitrary(0, 5);
            const { enemy, enemy_japanese, enemy_english, enemy_hp } = (() => {
                switch (enemy_index) {
                    case 0:
                        return {
                            enemy: 'demon_king',
                            enemy_japanese: '魔王',
                            enemy_english: 'Demon King',
                            enemy_hp: getRandomArbitrary(32, 64),
                        };
                    default:
                        return {
                            enemy: 'slime',
                            enemy_japanese: 'スライム',
                            enemy_english: 'Slime',
                            enemy_hp: getRandomArbitrary(8, 16),
                        };
                }
            })();

            chatClient.say(
                CHANNEL_NAME,
                `${enemy_japanese}があらわれた！ / ${enemy_english} appeared!`
            );

            setBattle({
                is_battle: true,
                is_process: false,
                anime_action: '',
                calc_action: '',
                your_max_hp: your_hp,
                your_current_hp: your_hp,
                enemy,
                enemy_japanese,
                enemy_english,
                enemy_max_hp: enemy_hp,
                enemy_current_hp: enemy_hp,
            });
        },
        [battle]
    );

    const checkBattleStatus = useCallback(
        (msg: PrivateMessage) => {
            if (!battle.is_battle) {
                chatClient.say(
                    CHANNEL_NAME,
                    '今は平和です / Peaceful world now',
                    {
                        replyTo: msg,
                    }
                );
                return false;
            }

            if (battle.is_process) {
                chatClient.say(
                    CHANNEL_NAME,
                    'ちょっと待ってね / Please wait a while',
                    {
                        replyTo: msg,
                    }
                );
                return false;
            }
            setBattle((prev) => {
                return { ...prev, ...{ is_process: true } };
            });

            return true;
        },
        [battle.is_battle, battle.is_process]
    );

    const battleEnemyAction = useCallback(() => {
        const { damage, anime_action } = (() => {
            const damage = getRandomArbitrary(5, 10);
            const critical = getRandomArbitrary(0, 7);

            if (critical <= 0) {
                chatClient.say(CHANNEL_NAME, `クリティカル！ / Fatal blow!`);
                return { damage: damage * 2, anime_action: 'enemy_critical' };
            }

            return { damage, anime_action: 'enemy_attack' };
        })();

        if (getRandomArbitrary(0, 7) <= 0) {
            chatClient.say(
                CHANNEL_NAME,
                `あなたは${battle.enemy_japanese}の攻撃を避けた！ / You avoided ${battle.enemy_english}'s attack!`
            );

            setBattle((prev) => {
                return {
                    ...prev,
                    ...{
                        anime_action: 'enemy_miss',
                    },
                };
            });
            return;
        }

        chatClient.say(
            CHANNEL_NAME,
            `${battle.enemy_japanese}の攻撃、あなたは${damage}ポイントのダメージを受けた！ / ${battle.enemy_english}'s attack, You takes ${damage} points of damage!`
        );

        // You lose
        if (damage >= battle.your_current_hp) {
            setBattle((prev) => {
                return {
                    ...prev,
                    ...{
                        anime_action: 'you_lose',
                        your_current_hp: 0,
                    },
                };
            });

            chatClient.say(
                CHANNEL_NAME,
                `あなたは負けてしまった… / You lose...`
            );
            return;
        }

        setBattle((prev) => {
            return {
                ...prev,
                ...{
                    anime_action,
                    your_current_hp: prev.your_current_hp - damage,
                },
            };
        });
    }, [battle.enemy_english, battle.enemy_japanese, battle.your_current_hp]);

    useEffect(() => {
        if (battle.calc_action === 'enemy_attack') {
            setBattle((prev) => {
                return { ...prev, ...{ calc_action: '' } };
            });

            battleEnemyAction();
        }
    }, [battle.calc_action, battleEnemyAction]);

    const battleAttack = useCallback(
        (msg: TwitchPrivateMessage) => {
            if (!checkBattleStatus(msg)) {
                return;
            }

            if (getRandomArbitrary(0, 7) <= 0) {
                chatClient.say(
                    CHANNEL_NAME,
                    `ミス、ダメージを与えられなかった！ / Your attack missed!`
                );

                setBattle((prev) => {
                    return {
                        ...prev,
                        ...{
                            anime_action: 'your_miss',
                        },
                    };
                });
                return;
            }

            const { damage, anime_action } = (() => {
                const damage = getRandomArbitrary(5, 10);
                const critical = getRandomArbitrary(0, 7);

                if (critical <= 0) {
                    chatClient.say(
                        CHANNEL_NAME,
                        `クリティカル！ / Fatal blow!`
                    );
                    return {
                        damage: damage * 2,
                        anime_action: 'your_critical',
                    };
                }

                return { damage, anime_action: 'your_attack' };
            })();

            chatClient.say(
                CHANNEL_NAME,
                `あなたは${damage}ポイントのダメージを与えた！ / You dealt ${damage} points damage!`
            );

            // You won
            if (damage >= battle.enemy_current_hp) {
                setBattle((prev) => {
                    return {
                        ...prev,
                        ...{
                            anime_action: 'you_win',
                            enemy_current_hp: 0,
                        },
                    };
                });

                chatClient.say(
                    CHANNEL_NAME,
                    `${battle.enemy_japanese}を倒した！ / You defeat ${battle.enemy_english}!`
                );
                return;
            }

            setBattle((prev) => {
                return {
                    ...prev,
                    ...{
                        anime_action,
                        enemy_current_hp: prev.enemy_current_hp - damage,
                    },
                };
            });
        },
        [
            battle.enemy_current_hp,
            battle.enemy_english,
            battle.enemy_japanese,
            checkBattleStatus,
        ]
    );

    const battleRetreat = useCallback(
        (msg: PrivateMessage) => {
            if (!checkBattleStatus(msg)) {
                return;
            }

            chatClient.say(
                CHANNEL_NAME,
                `魔王からは逃げられない！ / You can escape from Demon King!`
            );

            setBattle((prev) => {
                return {
                    ...prev,
                    ...{
                        anime_action: 'your_miss',
                    },
                };
            });
        },
        [checkBattleStatus]
    );

    return (msg: TwitchPrivateMessage, action: string) => {
        switch (action) {
            case 'start':
                battleStart(msg);
                break;
            case 'attack':
                battleAttack(msg);
                break;
            case 'retreat':
                battleRetreat(msg);
                break;
        }
    };
};
