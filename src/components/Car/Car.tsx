import React, { useState, useEffect, useContext, useRef } from 'react';
import { AnimatedSprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

// Const
import {
    WindowWidth,
    getCarCurrentSprite,
    getCarRandomSpriteKey,
} from '@/const';

// Context
import { FrameCountContext } from '@/context';

const CarWidth = 180;

export const Car: React.FC = () => {
    const app = useApp();
    const isInited = useRef(false);
    const frameCount = useContext(FrameCountContext);

    const spriteKey = useRef(getCarRandomSpriteKey());
    const speed = useRef<number>(0);

    const [x, updateX] = useState<number>(0);
    const [rail, updateRail] = useState<number>(0);
    const [direction, updateDirection] = useState<number>(0);
    const [image, updateImage] = useState<PIXI.Texture[]>([]);

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

        const sprite = getCarCurrentSprite(spriteKey.current);
        if (app.loader.resources[sprite.img]) {
            updateImage(
                Object.keys(app.loader.resources[sprite.img].data.frames).map(
                    (frame) => PIXI.Texture.from(frame)
                )
            );
        }

        updateX(x);
        updateDirection(direction);
        updateRail(Math.floor(Math.random() * 3));

        return () => {
            isInited.current = false;
        };
    }, []);

    useEffect(() => {
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

    return image.length ? (
        <AnimatedSprite
            textures={image}
            isPlaying
            x={x}
            y={-50 * rail}
            animationSpeed={0.2}
            anchor={{ y: 1, x: 1 }}
            scale={{
                x: (1 - 0.2 * rail) * (direction ? 1 : -1),
                y: 1 - 0.2 * rail,
            }}
            zIndex={3 - rail}
        />
    ) : null;
};
