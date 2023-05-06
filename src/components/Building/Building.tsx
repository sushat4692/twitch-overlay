import React, { useState, useEffect, useRef } from 'react';
import { AnimatedSprite } from '@pixi/react';
import * as PIXI from 'pixi.js';

import { WindowWidth } from '@/const';
import { getBuildingCurrentSprite, getBuildingRandomSpriteKey } from '@/const';

export const Building = () => {
    const isInited = useRef(false);

    const spriteKey = useRef(getBuildingRandomSpriteKey());

    const [x, updateX] = useState<number>(0);
    const [rail, updateRail] = useState<number>(0);
    const [image, updateImage] = useState<PIXI.Texture[]>([]);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const x = Math.floor(Math.random() * WindowWidth);

        const sprite = getBuildingCurrentSprite(spriteKey.current);
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
