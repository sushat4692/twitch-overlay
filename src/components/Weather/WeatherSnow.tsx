import React, { useCallback, useState, useRef } from 'react';
import { Graphics, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { random } from '@/util';

// Const
import { WindowWidth, WindowHeight } from '@/const';

const SnowSize = 7;
const SnowSpeed = 1.5;
const SnowAccelerationMax = 2;

export const WeatherSnow: React.FC = () => {
    const a = useRef(0);
    const [x, setX] = useState(random(0, WindowWidth));
    const [y, setY] = useState(random(0, WindowHeight));

    const scale = useRef(Math.random());

    useTick(() => {
        setY((prev) => {
            if (prev > WindowHeight + SnowSize) {
                prev = -SnowSize;
            }

            return prev + SnowSpeed * scale.current;
        });

        a.current = a.current + (Math.random() - 0.5) * 0.5;
        if (a.current > SnowAccelerationMax) {
            a.current = SnowAccelerationMax;
        }
        if (a.current < -SnowAccelerationMax) {
            a.current = -SnowAccelerationMax;
        }

        setX((prev) => {
            prev = prev + a.current;

            if (prev > WindowWidth + SnowSize) {
                prev = -SnowSize;
            }
            if (prev < -SnowSize) {
                prev = WindowWidth + SnowSize;
            }

            return prev;
        });
    });

    const draw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0xffffff, 0.7);
        g.drawCircle(0, 0, SnowSize * scale.current);
        g.endFill();
    }, []);

    return <Graphics draw={draw} x={x} y={y} />;
};
