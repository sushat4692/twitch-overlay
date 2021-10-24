import React, { useEffect, useState } from 'react';
import styles from './CatDetail.module.css'

import {useAnimationFrameCount} from '../util/useAnimationFrameCount'
import { getCurrentSprite, SpriteType } from '../const/Cat';

type Props = {
    spriteKey: SpriteType
    duration: number
    step: (duration: number) => void
    next: () => void
}

const CatDetail: React.FC<Props> = ({spriteKey, duration, step, next}: Props) => {
    const frameCount = useAnimationFrameCount();

    const [initialize, updateInitialize] = useState<boolean>(false)
    const [image, updateImage] = useState<string>('')
    const [isNext, updateIsNext] = useState<boolean>(false)
    const [index, updateIndex] = useState<number>(0);
    const [startTime, updateStartTime] = useState<number>((new Date).getTime());
    const [startFrameTime, updateStartFrameTime] = useState<number>((new Date).getTime());
    const [previousTime, updatePreviousTime] = useState<number>((new Date).getTime())

    useEffect(() => {
        updateInitialize(true);

        const sprite = getCurrentSprite(spriteKey)
        updateImage(sprite.img || '')

        updateStartTime((new Date).getTime())
        updateStartFrameTime((new Date).getTime())
        updatePreviousTime((new Date).getTime())
        updateIsNext(true)
    }, [spriteKey])

    useEffect(() => {
        if (!initialize) {
            return;
        }

        const sprite = getCurrentSprite(spriteKey)
        if (!sprite) {
            return
        }

        const length = sprite.frame.reduce((prev, current) => prev+current, 0)
        const currentTime = (new Date).getTime();
        const upTime = currentTime - startTime;
        const frameDuration = currentTime - startFrameTime;

        if (upTime >= duration) {
            if (isNext) {
                updateIsNext(false);
                next();
            }
            return;
        }

        if (frameDuration > length) {
            if (!sprite.loop) {
                return;
            }

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

        const stepDuration = currentTime - previousTime;
        updatePreviousTime(currentTime)

        step(stepDuration)
    }, [frameCount])

    return (
        <>
            {initialize ? (
                <div className={styles.CatDetail} style={{
                    backgroundImage: `url(${image})`,
                    backgroundPositionX: `${-84 * index}px`
                }}></div>
            ) : null}
        </>
    )
}

export default CatDetail;