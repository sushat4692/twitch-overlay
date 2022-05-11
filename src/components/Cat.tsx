import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container } from '@inlet/react-pixi';

import {
    getCurrentSprite,
    getRandomSpriteKey,
    getTargetSpriteDuration,
    SpriteType,
} from '../const/Cat';
import CatDetail from './CatDetail';

// const catAreaWidth = 1136;
const catAreaWidth = 1416;

const Cat = (): JSX.Element => {
    const isInited = useRef(false);
    const [x, updateX] = useState<number>(
        Math.floor(Math.random() * catAreaWidth)
    );
    const [reflect, updateReflect] = useState<boolean>(true);
    const [key, updateKey] = useState<SpriteType>('none');
    const [duration, updateDuration] = useState<number>(
        getTargetSpriteDuration('none') || 0
    );

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const randomSprite = getRandomSpriteKey(['fall']);

        updateKey(randomSprite);
        updateDuration(getTargetSpriteDuration(randomSprite) || 0);

        return () => {
            isInited.current = false;
        };
    }, []);

    const nextSprite = useCallback(
        (forceNext?: SpriteType[]) => {
            const currentSprite = getCurrentSprite(key);
            if (!currentSprite) {
                return;
            }

            if (currentSprite.afterReflect) {
                updateReflect((prev) => !prev);
            }

            const next = getRandomSpriteKey(
                forceNext || (currentSprite.next as SpriteType[])
            );

            const nextDuration = getTargetSpriteDuration(next) || 0;
            updateKey(next);
            updateDuration(nextDuration);
        },
        [key]
    );

    const stepSprite = useCallback(
        (stepDuration: number) => {
            const currentSprite = getCurrentSprite(key);
            if (!currentSprite) {
                return;
            }

            if (currentSprite.move) {
                updateX((prev) => {
                    const newX =
                        prev +
                        Math.floor(stepDuration * 0.1) * (reflect ? -1 : 1);
                    if (newX < 0) {
                        nextSprite(['spin']);
                        return 0;
                    } else if (newX > catAreaWidth) {
                        nextSprite(['spin']);
                        return catAreaWidth;
                    }

                    return newX;
                });
            }
        },
        [key, reflect, nextSprite]
    );

    return (
        <Container
            width={84}
            height={84}
            anchor={0}
            scale={{
                x: reflect ? -1 : 1,
                y: 1,
            }}
            y={0}
            x={x}>
            <CatDetail
                spriteKey={key}
                duration={duration}
                step={stepSprite}
                next={nextSprite}
            />
        </Container>
    );
};

export default Cat;
