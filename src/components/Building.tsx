import React, { useState, useCallback, useEffect } from 'react';
import styles from './Building.module.css'

import {useAnimationFrameCount} from '../util/useAnimationFrameCount'
import { getCurrentSprite, getRandomSpriteKey } from '../const/Building';

const Building = () => {
    const frameCount = useAnimationFrameCount();

    const [spriteKey] = useState(getRandomSpriteKey())
    const [x, updateX] = useState<number>(0)
    const [image, updateImage] = useState<string>('')
    const [index, updateIndex] = useState<number>(0);
    const [startFrameTime, updateStartFrameTime] = useState<number>((new Date).getTime());

    useEffect(() => {
        const x = Math.random() * (1920 - 160);

        const sprite = getCurrentSprite(spriteKey)
        updateImage(sprite.img || '')

        updateX(x);
    }, [])

    useEffect(() => {
        const sprite = getCurrentSprite(spriteKey)
        if (!sprite) {
            return
        }

        const length = sprite.frame.reduce((prev, current) => prev+current, 0)
        const currentTime = (new Date).getTime();
        const frameDuration = currentTime - startFrameTime;

        if (frameDuration > length) {
            updateStartFrameTime(currentTime);
        }

        const index = (() => {
            let index = 0;
            let sum = 0;

            sprite.frame.some((frame, i) => {
                sum += frame;
                index = i;
                return frameDuration <= sum
            })

            return index;
        })()
        updateIndex(index)
    }, [frameCount])

    return (<div className={styles.Building} style={{
        left: `${x}px`,
        backgroundImage: `url(${image})`,
        backgroundPositionX: `${-160 * index}px`,
    }}></div>)
}

export default Building;