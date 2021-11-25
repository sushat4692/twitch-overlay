import React, { useEffect, useState, useContext, useRef } from 'react';
import styles from './CatDetail.module.css';

import { getCurrentSprite, SpriteType } from '../const/Cat';

// Context
import { FrameCountContext } from '../context/FrameCount';

type Props = {
    spriteKey: SpriteType;
    duration: number;
    step: (duration: number) => void;
    next: () => void;
};

const CatDetail: React.FC<Props> = ({
    spriteKey,
    duration,
    step,
    next,
}: Props) => {
    const frameCount = useContext(FrameCountContext);

    const initialize = useRef<boolean>(false);
    const startTime = useRef<number>(new Date().getTime());
    const startFrameTime = useRef<number>(new Date().getTime());
    const previousTime = useRef<number>(new Date().getTime());
    const isNext = useRef<boolean>(false);

    const [image, updateImage] = useState<string>('');
    const [index, updateIndex] = useState<number>(0);

    useEffect(() => {
        initialize.current = true;

        const sprite = getCurrentSprite(spriteKey);
        updateImage(sprite.img || '');

        startTime.current = new Date().getTime();
        startFrameTime.current = new Date().getTime();
        previousTime.current = new Date().getTime();
        isNext.current = true;
    }, [spriteKey]);

    useEffect(() => {
        if (!initialize.current) {
            return;
        }

        const sprite = getCurrentSprite(spriteKey);
        if (!sprite) {
            return;
        }

        const length = sprite.frame.reduce(
            (prev, current) => prev + current,
            0
        );
        const currentTime = new Date().getTime();
        const upTime = currentTime - startTime.current;
        const frameDuration = currentTime - startFrameTime.current;

        if (upTime >= duration) {
            if (isNext.current) {
                isNext.current = false;
                next();
            }
            return;
        }

        if (frameDuration > length) {
            if (!sprite.loop) {
                return;
            }

            startFrameTime.current = currentTime;
        }

        const index = (() => {
            let index = 0;
            let sum = 0;

            sprite.frame.some((frame, i) => {
                sum += frame;
                index = i;
                return frameDuration <= sum;
            });

            return index;
        })();
        updateIndex(index);

        const stepDuration = currentTime - previousTime.current;
        previousTime.current = currentTime;

        step(stepDuration);
    }, [frameCount, duration, next, spriteKey, step]);

    return (
        <>
            {initialize ? (
                <div
                    className={styles.CatDetail}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundPositionX: `${-84 * index}px`,
                    }}></div>
            ) : null}
        </>
    );
};

export default CatDetail;
