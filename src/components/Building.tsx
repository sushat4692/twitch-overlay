import React, { useState, useEffect, useRef } from 'react';
import { AnimatedSprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { WindowWidth } from '../const/App';
import { getCurrentSprite, getRandomSpriteKey } from '../const/Building';

const Building = () => {
    const app = useApp();
    const isInited = useRef(false);

    const spriteKey = useRef(getRandomSpriteKey());

    const [x, updateX] = useState<number>(0);
    const [rail, updateRail] = useState<number>(0);
    const [image, updateImage] = useState<PIXI.Texture[]>([]);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const x = Math.floor(Math.random() * WindowWidth);

        const sprite = getCurrentSprite(spriteKey.current);
        if (app.loader.resources[sprite.img]) {
            updateImage(
                Object.keys(app.loader.resources[sprite.img].data.frames).map(
                    (frame) => PIXI.Texture.from(frame)
                )
            );
        }

        updateX(x);
        updateRail(Math.floor(Math.random() * 3));

        return () => {
            isInited.current = false;
        };
    }, []);

    return image.length ? (
        <AnimatedSprite
            textures={image}
            isPlaying
            x={x}
            y={-50 * rail}
            animationSpeed={0.2}
            anchor={{ y: 1, x: 1 }}
            scale={{
                x: 1 - 0.2 * rail,
                y: 1 - 0.2 * rail,
            }}
            zIndex={3 - rail}
        />
    ) : null;
};

export default Building;
