import React, { useState, useEffect, useRef } from 'react';
import { AnimatedSprite, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';

// Const
import {
    WindowWidth,
    getCarCurrentSprite,
    getCarRandomSpriteKey,
} from '@/const';

const CarWidth = 180;

export const Car: React.FC = () => {
    const isInited = useRef(false);

    const spriteKey = useRef(getCarRandomSpriteKey());
    const speed = useRef<number>(0);

    const [x, updateX] = useState<number>(0);
    const [rail, updateRail] = useState<number>(0);
    const direction = useRef(0);
    const [image, updateImage] = useState<PIXI.Texture[]>([]);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const _direction = Math.floor(Math.random() * 2);
        const x =
            Math.random() * (WindowWidth / 2 - CarWidth) +
            (!_direction ? WindowWidth / 2 : 0);
        speed.current = Math.random() + 0.5;

        const sprite = getCarCurrentSprite(spriteKey.current);
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

            if (next < 0 - CarWidth) {
                return WindowWidth;
            }

            if (next > WindowWidth + CarWidth) {
                return -CarWidth;
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
            animationSpeed={0.2}
            anchor={{ y: 1, x: 1 }}
            scale={{
                x: (1 - 0.2 * rail) * (direction.current ? 1 : -1),
                y: 1 - 0.2 * rail,
            }}
            zIndex={3 - rail}
        />
    ) : null;
};
