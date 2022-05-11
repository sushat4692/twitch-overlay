import React, { useCallback } from 'react';
import { Graphics } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

// Const
import { threshold, graphMax } from '../const/App';

type Props = {
    show: boolean;
    volume: number;
};
const AvatarVolume: React.FunctionComponent<Props> = ({ show, volume }) => {
    const gageDraw = useCallback(
        (g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0xff0000);
            g.drawRect(0, 0, 306 * (volume / graphMax), 48);
            g.endFill();
        },
        [volume]
    );

    const wireDraw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0x000000);
        g.lineStyle({ width: 2, color: 0xffffff });
        g.drawRect(0, 0, 306, 48);
        g.endFill();
    }, []);

    const thresholdDraw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0xffffff);
        g.drawRect(306 * (threshold / graphMax), 0, 2, 48);
        g.endFill();
    }, []);

    return show ? (
        <>
            <Graphics x={1562} y={791} draw={wireDraw} />
            <Graphics x={1562} y={791} draw={gageDraw} />
            <Graphics x={1562} y={791} draw={thresholdDraw} />
        </>
    ) : null;
};

export default AvatarVolume;
