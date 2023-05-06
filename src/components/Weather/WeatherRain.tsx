import React, { useCallback, useState } from 'react';
import { Graphics, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { random } from '@/util';

// Const
import { WindowWidth, WindowHeight } from '@/const';

const RainSize = 100;
const RainSpeed = 50;

export const WeatherRain: React.FC = () => {
    const [x, setX] = useState(random(0, WindowWidth));
    const [y, setY] = useState(random(0, WindowHeight));

    useTick(() => {
        setY((prev) => {
            if (prev > WindowHeight + RainSize) {
                prev = -RainSize;
                setX(random(0, WindowWidth));
            }

            return prev + RainSpeed;
        });
    });

    const draw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0xffffff, 0.3);
        g.drawRect(0, 0, 2, RainSize);
        g.endFill();
    }, []);

    return <Graphics draw={draw} x={x} y={y} />;
};
