import React, { useState, useEffect, useRef } from 'react';
import { AnimatedSprite, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';

// Const
import {
    WindowWidth,
    getDinoCurrentSprite,
    getDinoRandomSpriteKey,
} from '@/const';

const DinoWidth = 160;

export const Dino = () => {
    const isInited = useRef(false);

    const spriteKey = useRef(getDinoRandomSpriteKey());
    const speed = useRef<number>(0);

    const [x, updateX] = useState<number>(0);
    const [rail, updateRail] = useState<number>(0);
    const direction = useRef<number>(0);
    const [image, updateImage] = useState<PIXI.Texture[]>([]);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const _direction = Math.floor(Math.random() * 2);
        const x = _direction ? WindowWidth + DinoWidth : -DinoWidth;
        speed.current = 0.5;

        const sprite = getDinoCurrentSprite(spriteKey.current);
        const textures = PIXI.Assets.get(sprite.img);
        if (textures) {
            updateImage(
                Object.keys(textures.data.frames).map((frame) =>
                    PIXI.Texture.from(frame)
                )
            );
        }

        updateX(x);
        updateRail(Math.floor(Math.random() * 3));
        direction.current = _direction;

        return () => {
            isInited.current = false;
        };
    }, []);

    useTick(() => {
        updateX((prev) => {
            const next = prev + speed.current * (direction.current ? 1 : -1);

            if (next < 0 - DinoWidth) {
                return WindowWidth;
            }

            if (next > WindowWidth + DinoWidth) {
                return -DinoWidth;
            }

            return prev + speed.current * (direction.current ? 1 : -1);
        });
    });

    return image.length ? (
        <AnimatedSprite
            textures={image}
            isPlaying
            x={x}
            y={-50 * rail}
            animationSpeed={0.05}
            anchor={{ y: 1, x: 1 }}
            scale={{
                x: (1 - 0.2 * rail) * (direction ? 1 : -1),
                y: 1 - 0.2 * rail,
            }}
            zIndex={3 - rail}
        />
    ) : null;
};
