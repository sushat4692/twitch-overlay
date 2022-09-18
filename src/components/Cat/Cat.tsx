import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container } from '@inlet/react-pixi';

import {
    getCatCurrentSprite,
    getCatRandomSpriteKey,
    getCatTargetSpriteDuration,
    CatSpriteType,
} from '@/const';
import { CatDetail } from '@/components';

// const catAreaWidth = 1136;
const catAreaWidth = 1416;

export const Cat: React.FC = () => {
    const isInited = useRef(false);
    const [x, updateX] = useState<number>(
        Math.floor(Math.random() * catAreaWidth)
    );
    const [reflect, updateReflect] = useState<boolean>(true);
    const [key, updateKey] = useState<CatSpriteType>('none');
    const [duration, updateDuration] = useState<number>(
        getCatTargetSpriteDuration('none') || 0
    );

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const randomSprite = getCatRandomSpriteKey(['fall']);

        updateKey(randomSprite);
        updateDuration(getCatTargetSpriteDuration(randomSprite) || 0);

        return () => {
            isInited.current = false;
        };
    }, []);

    const nextSprite = useCallback(
        (forceNext?: CatSpriteType[]) => {
            const currentSprite = getCatCurrentSprite(key);
            if (!currentSprite) {
                return;
            }

            if (currentSprite.afterReflect) {
                updateReflect((prev) => !prev);
            }

            const next = getCatRandomSpriteKey(
                forceNext || (currentSprite.next as CatSpriteType[])
            );

            const nextDuration = getCatTargetSpriteDuration(next) || 0;
            updateKey(next);
            updateDuration(nextDuration);
        },
        [key]
    );

    const stepSprite = useCallback(
        (stepDuration: number) => {
            const currentSprite = getCatCurrentSprite(key);
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
