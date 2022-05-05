import React, {
    useCallback,
    useState,
    useEffect,
    useContext,
    useMemo,
    useRef,
} from 'react';
import { Graphics } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { random } from '../util/Random';

// Const
import { WindowWidth, WindowHeight } from '../const/App';

// Context
import { FrameCountContext } from '../context/FrameCount';

const SnowSize = 7;
const SnowSpeed = 1.5;
const SnowAccelerationMax = 2;

const WeatherSnow: React.FunctionComponent = () => {
    const frameCount = useContext(FrameCountContext);

    const a = useRef(0);
    const [x, setX] = useState(random(0, WindowWidth));
    const [y, setY] = useState(random(0, WindowHeight));

    const scale = useMemo(() => {
        return Math.random() * 2;
    }, []);

    useEffect(() => {
        setY((prev) => {
            if (prev > WindowHeight + SnowSize) {
                prev = -SnowSize;
            }

            return prev + SnowSpeed * scale;
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
    }, [frameCount, scale]);

    const draw = useCallback(
        (g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0xffffff, 0.7);
            g.drawCircle(0, 0, SnowSize * scale);
            g.endFill();
        },
        [scale]
    );

    return <Graphics draw={draw} x={x} y={y} />;
};

export default WeatherSnow;
