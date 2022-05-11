import React, { useEffect, useState, useContext, useRef, Ref } from 'react';
import { AnimatedSprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

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
    const app = useApp();
    const frameCount = useContext(FrameCountContext);
    const animateSprite = useRef<PIXI.AnimatedSprite>();

    const initialize = useRef<boolean>(false);
    const startTime = useRef<number>(new Date().getTime());
    const startFrameTime = useRef<number>(new Date().getTime());
    const previousTime = useRef<number>(new Date().getTime());
    const isNext = useRef<boolean>(false);

    const [image, updateImage] = useState<PIXI.Texture[]>([]);
    const [loop, updateLoop] = useState(false);
    const [animationSpeed, updateAnimationSpeed] = useState(0.2);

    useEffect(() => {
        initialize.current = true;

        const sprite = getCurrentSprite(spriteKey);
        if (sprite.img && app.loader.resources[sprite.img]) {
            updateImage(
                Object.keys(app.loader.resources[sprite.img].data.frames).map(
                    (frame) => PIXI.Texture.from(frame)
                )
            );
        }
        updateLoop(sprite.loop);
        updateAnimationSpeed(sprite.speed);

        startTime.current = new Date().getTime();
        startFrameTime.current = new Date().getTime();
        previousTime.current = new Date().getTime();
        isNext.current = true;

        setTimeout(() => {
            if (animateSprite.current) {
                animateSprite.current.gotoAndPlay(0);
            }
        }, 10);
    }, [spriteKey]);

    useEffect(() => {
        if (!initialize.current) {
            return;
        }

        const sprite = getCurrentSprite(spriteKey);
        if (!sprite) {
            return;
        }

        const currentTime = new Date().getTime();
        const upTime = currentTime - startTime.current;

        if (upTime >= duration) {
            if (isNext.current) {
                isNext.current = false;
                next();
            }
            return;
        }

        const stepDuration = currentTime - previousTime.current;
        previousTime.current = currentTime;

        step(stepDuration);
    }, [frameCount, duration, next, spriteKey, step]);

    return (
        <>
            {initialize && image.length ? (
                <AnimatedSprite
                    key={spriteKey}
                    textures={image}
                    isPlaying
                    animationSpeed={animationSpeed}
                    anchor={0.5}
                    loop={loop}
                    ref={animateSprite as Ref<PIXI.AnimatedSprite>}
                />
            ) : null}
        </>
    );
};

export default CatDetail;
