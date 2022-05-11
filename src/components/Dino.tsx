import React, { useState, useEffect, useContext, useRef } from 'react';
import { AnimatedSprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { WindowWidth } from '../const/App';
import { getCurrentSprite, getRandomSpriteKey } from '../const/Dino';

// Context
import { FrameCountContext } from '../context/FrameCount';

const DinoWidth = 160;

const Dino = () => {
    const app = useApp();
    const isInited = useRef(false);
    const frameCount = useContext(FrameCountContext);

    const spriteKey = useRef(getRandomSpriteKey());
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
        const x = direction ? WindowWidth + DinoWidth : -DinoWidth;
        speed.current = 0.5;

        const sprite = getCurrentSprite(spriteKey.current);
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

            if (next < 0 - DinoWidth) {
                return WindowWidth;
            }

            if (next > WindowWidth + DinoWidth) {
                return -DinoWidth;
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

export default Dino;
