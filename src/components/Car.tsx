import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './Car.module.css';

import { WindowWidth } from '../const/App';
import { getCurrentSprite, getRandomSpriteKey } from '../const/Car';

// Context
import { FrameCountContext } from '../context/FrameCount';

const CarWidth = 180;

const Car = () => {
    const isInited = useRef(false);
    const frameCount = useContext(FrameCountContext);

    const spriteKey = useRef(getRandomSpriteKey());
    const speed = useRef<number>(0);
    const startFrameTime = useRef<number>(new Date().getTime());

    const [x, updateX] = useState<number>(0);
    const [rail, updateRail] = useState<number>(0);
    const [direction, updateDirection] = useState<number>(0);
    const [image, updateImage] = useState<string>('');
    const [index, updateIndex] = useState<number>(0);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const direction = Math.floor(Math.random() * 2);
        const x =
            Math.random() * (WindowWidth / 2 - CarWidth) +
            (!direction ? WindowWidth / 2 : 0);
        speed.current = Math.random() + 0.5;

        const sprite = getCurrentSprite(spriteKey.current);
        updateImage(sprite.img || '');

        updateX(x);
        updateDirection(direction);
        updateRail(Math.floor(Math.random() * 3));

        return () => {
            isInited.current = false;
        };
    }, []);

    useEffect(() => {
        const sprite = getCurrentSprite(spriteKey.current);
        if (!sprite) {
            return;
        }

        const length = sprite.frame.reduce(
            (prev, current) => prev + current,
            0
        );
        const currentTime = new Date().getTime();
        const frameDuration = currentTime - startFrameTime.current;

        if (frameDuration > length) {
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

        updateX((prev) => {
            const next = prev + speed.current * (direction ? 1 : -1);

            if (next < 0 - CarWidth) {
                return WindowWidth;
            }

            if (next > WindowWidth + CarWidth) {
                return -CarWidth;
            }

            return prev + speed.current * (direction ? 1 : -1);
        });
    }, [frameCount, direction]);

    return (
        <div
            className={styles.Car}
            style={{
                left: `${x}px`,
            }}
            data-build={rail}
            data-direction={direction}>
            <div
                className={styles.Car__inner}
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPositionX: `${-CarWidth * index}px`,
                }}></div>
        </div>
    );
};

export default Car;
