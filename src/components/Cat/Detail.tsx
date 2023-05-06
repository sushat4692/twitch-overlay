import React, { useEffect, useState, useContext, useRef, Ref } from 'react';
import { AnimatedSprite, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';

import { getCatCurrentSprite, CatSpriteType } from '@/const';

type Props = {
    spriteKey: CatSpriteType;
    duration: number;
    step: (duration: number) => void;
    next: () => void;
};

export const CatDetail: React.FC<Props> = ({
    spriteKey,
    duration,
    step,
    next,
}: Props) => {
    const [delta, setDelta] = useState(0);
    const animateSprite = useRef<PIXI.AnimatedSprite>();

    const initialize = useRef<boolean>(false);
    const startTime = useRef<number>(new Date().getTime());
    const startFrameTime = useRef<number>(new Date().getTime());
    const previousTime = useRef<number>(new Date().getTime());
    const isNext = useRef<boolean>(false);

    const [image, updateImage] = useState<PIXI.Texture[]>([]);
    const [loop, updateLoop] = useState(false);
    const [animationSpeed, updateAnimationSpeed] = useState(0.2);

    useTick(() =>
        setDelta((delta) =>
            delta >= Number.MAX_SAFE_INTEGER - 100 ? 0 : delta + 1
        )
    );

    useEffect(() => {
        initialize.current = true;

        const sprite = getCatCurrentSprite(spriteKey);
        if (sprite.img) {
            const textures = PIXI.Assets.get(sprite.img);
            if (textures) {
                updateImage(
                    Object.keys(textures.data.frames).map((frame) =>
                        PIXI.Texture.from(frame)
                    )
                );
            }
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

        const sprite = getCatCurrentSprite(spriteKey);
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
    }, [delta, duration, next, spriteKey, step]);

    return (
        <>
            {initialize.current && image.length ? (
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
