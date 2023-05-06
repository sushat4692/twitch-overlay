import React, { useCallback, useMemo } from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';

type Props = {
    x: number;
    y: number;
    label: string;
    barColor: number;
    current: number;
    max: number;
};
export const BattleHPBar: React.FC<Props> = ({
    x,
    y,
    label,
    barColor,
    current,
    max,
}: Props) => {
    const textStyle = useMemo(
        () =>
            new PIXI.TextStyle({
                fontSize: 32,
                fill: '#ffffff',
                fontWeight: 'bold',
                fontFamily: 'PixelMplus12',
            }),
        []
    );
    const textHPStyle = useMemo(
        () =>
            new PIXI.TextStyle({
                fontSize: 24,
                fill: '#ffffff',
                fontFamily: 'PixelMplus12',
            }),
        []
    );

    const barFrameDraw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(0x000000, 0);
        g.lineStyle(2, 0xffffff, 1);
        g.drawRect(120, 0, 380, 52);
        g.endFill();
    }, []);

    const barFillDraw = useCallback(
        (g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(barColor, 1);
            g.drawRect(120, 0, 380 * (current / max), 52);
            g.endFill();
        },
        [barColor, current, max]
    );

    return (
        <Container x={x} y={y}>
            <Text
                text={label}
                anchor={[0, 0.5]}
                x={18}
                y={26}
                style={textStyle}
            />
            <Graphics draw={barFillDraw} />
            <Graphics draw={barFrameDraw} />

            <Text
                text={`${current}/${max}`}
                anchor={[1, 0.5]}
                x={490}
                y={26}
                style={textHPStyle}
            />
        </Container>
    );
};
