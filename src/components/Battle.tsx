import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { WindowHeight } from '../const/App';
import BattleHPBar from './Battle/HPBar';
import BattleMessage from './Battle/Message';
import { FrameCountContext } from '../context/FrameCount';
import { useState as useBattleState } from '../atoms/battle';

import DemonKingImage from '../assets/battle/DemonKing.png';
import SlimeImage from '../assets/battle/Slime.png';

import {
    playEncount,
    playMiss,
    playEnemyAttack,
    playEnemyCritical,
    playGameClear,
    playGameOver,
    playYourAttack,
    playYourCritical,
} from '../util/useBattleSound';

const Battle: React.FC = () => {
    const frameCount = useContext(FrameCountContext);
    const [battle, setBattle] = useBattleState();
    const [isBrink, setIsBrink] = useState(false);
    const [isShake, setIsShake] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [isLose, setIsLose] = useState(false);
    const [enemyImage, setEnemyImage] = useState('');

    useEffect(() => {
        if (battle.is_battle) {
            playEncount();
            setIsWin(false);
            setIsLose(false);
        }
    }, [battle.is_battle]);

    useEffect(() => {
        if (!battle.is_battle) {
            return;
        }

        switch (battle.anime_action) {
            case 'your_attack':
                setIsBrink(true);
                playYourAttack();

                setTimeout(() => {
                    setIsBrink(false);
                    setBattle((prev) => {
                        return { ...prev, ...{ calc_action: 'enemy_attack' } };
                    });
                }, 1000);
                break;
            case 'your_critical':
                setIsBrink(true);
                playYourCritical();

                setTimeout(() => {
                    setIsBrink(false);
                    setBattle((prev) => {
                        return { ...prev, ...{ calc_action: 'enemy_attack' } };
                    });
                }, 1000);
                break;
            case 'your_miss':
                playMiss();

                setTimeout(() => {
                    setBattle((prev) => {
                        return { ...prev, ...{ calc_action: 'enemy_attack' } };
                    });
                }, 1000);
                break;
            case 'enemy_attack':
                setIsShake(true);
                playEnemyAttack();

                setTimeout(() => {
                    setIsShake(false);
                    setBattle((prev) => {
                        return { ...prev, ...{ is_process: false } };
                    });
                }, 1000);
                break;
            case 'enemy_critical':
                setIsShake(true);
                playEnemyCritical();

                setTimeout(() => {
                    setIsShake(false);
                    setBattle((prev) => {
                        return { ...prev, ...{ is_process: false } };
                    });
                }, 1000);
                break;
            case 'enemy_miss':
                playMiss();

                setTimeout(() => {
                    setBattle((prev) => {
                        return { ...prev, ...{ is_process: false } };
                    });
                }, 1000);
                break;
            case 'you_win':
                playYourCritical();

                setTimeout(() => {
                    playGameClear();
                    setIsWin(true);
                }, 1000);

                setTimeout(() => {
                    setBattle((prev) => {
                        return { ...prev, ...{ is_battle: false } };
                    });
                }, 5500);
                break;
            case 'you_lose':
                playEnemyCritical();

                setTimeout(() => {
                    playGameOver();
                    setIsLose(true);
                }, 1000);

                setTimeout(() => {
                    setBattle((prev) => {
                        return { ...prev, ...{ is_battle: false } };
                    });
                }, 5500);
                break;
        }
    }, [battle.is_battle, battle.anime_action]);

    useEffect(() => {
        switch (battle.enemy) {
            case 'demon_king':
                setEnemyImage(DemonKingImage);
                break;
            default:
                setEnemyImage(SlimeImage);
                break;
        }
    }, [battle.enemy]);

    const usePosition = useMemo(() => {
        if (isShake) {
            const index = Math.floor((frameCount / 8) % 2);

            return {
                x: 32 + (index ? 5 : -5),
                y: WindowHeight - 32,
            };
        } else {
            return {
                x: 32,
                y: WindowHeight - 32,
            };
        }
    }, [isShake, frameCount]);

    const enemyAlpha = useMemo(() => {
        if (isWin) {
            return 0;
        }

        if (isLose) {
            return 0.3;
        }

        if (isBrink) {
            const index = Math.floor((frameCount / 8) % 2);
            return index ? 1 : 0;
        } else {
            return 1;
        }
    }, [isBrink, isWin, isLose, frameCount]);

    const wireDraw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0x000000);
        g.lineStyle(6, 0xffffff, 1);
        g.drawRoundedRect(0, -400, 520, 400, 6);
        g.endFill();
    }, []);

    return battle.is_battle ? (
        <Container position={[usePosition.x, usePosition.y]}>
            <Graphics draw={wireDraw} />

            <Sprite
                width={472}
                height={230}
                x={24}
                y={-376}
                image={enemyImage}
                alpha={enemyAlpha}
            />

            <BattleHPBar
                x={0}
                y={-124}
                label="You"
                barColor={0x0000ff}
                current={battle.your_current_hp}
                max={battle.your_max_hp}
            />

            <BattleHPBar
                x={0}
                y={-68}
                label="Enemy"
                barColor={0xff0000}
                current={battle.enemy_current_hp}
                max={battle.enemy_max_hp}
            />

            {isWin ? <BattleMessage label="You Win" /> : null}
            {isLose ? <BattleMessage label="You Lose" /> : null}
        </Container>
    ) : null;
};

export default Battle;
