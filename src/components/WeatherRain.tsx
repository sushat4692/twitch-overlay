import React, { useCallback, useState, useEffect, useContext } from 'react';
import { Graphics } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { random } from '../util/Random';

// Const
import { WindowWidth, WindowHeight } from '../const/App';

// Context
import { FrameCountContext } from '../context/FrameCount';

const RainSize = 100;
const RainSpeed = 50;

const WeatherSnow: React.FunctionComponent = () => {
    const frameCount = useContext(FrameCountContext);

    const [x, setX] = useState(random(0, WindowWidth));
    const [y, setY] = useState(random(0, WindowHeight));

    useEffect(() => {
        setY((prev) => {
            if (prev > WindowHeight + RainSize) {
                prev = -RainSize;
                setX(random(0, WindowWidth));
            }

            return prev + RainSpeed;
        });
    }, [frameCount]);

    const draw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0xffffff, 0.3);
        g.drawRect(0, 0, 2, RainSize);
        g.endFill();
    }, []);

    return <Graphics draw={draw} x={x} y={y} />;
};

export default WeatherSnow;
