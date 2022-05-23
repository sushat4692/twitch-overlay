import React, { useCallback } from 'react';
import { Container, Graphics } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

// Const
import { sampleRate, threshold, graphMax } from '../const/App';

const GapSize = 15;
const ContainerWidth = 420;
const VolumeHeight = 60;
const GraphHeight = 230;
const GraphGap = 5;

type Props = {
    show: boolean;
    volume: number;
    bsw: [number, number, number];
    energy: [number, number, number, number, number];
    float: Float32Array;
    byte: Uint8Array;
};
const AvatarVolume: React.FunctionComponent<Props> = ({
    show,
    volume,
    bsw,
    energy,
    float,
    byte,
}) => {
    const VolumeDraw = () => {
        const gageDraw = useCallback(
            (g: PIXI.Graphics) => {
                g.clear();
                g.beginFill(0xff0000);
                g.drawRect(
                    0,
                    0,
                    ContainerWidth * (volume / graphMax),
                    VolumeHeight
                );
                g.endFill();
            },
            [volume]
        );

        const wireDraw = useCallback((g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0x000000);
            g.lineStyle({ width: 2, color: 0xffffff });
            g.drawRect(0, 0, ContainerWidth, VolumeHeight);
            g.endFill();
        }, []);

        const thresholdDraw = useCallback((g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0xffffff);
            g.drawRect(
                ContainerWidth * (threshold / graphMax),
                0,
                2,
                VolumeHeight
            );
            g.endFill();
        }, []);

        return (
            <Container x={GapSize} y={GapSize}>
                <Graphics draw={wireDraw} />
                <Graphics draw={gageDraw} />
                <Graphics draw={thresholdDraw} />
            </Container>
        );
    };

    const FloatDraw = () => {
        const bgDraw = useCallback((g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0x000000);
            g.lineStyle({ width: 2, color: 0xffffff });
            g.drawRect(0, 0, ContainerWidth, GraphHeight);
            g.endFill();
        }, []);

        const lineDraw = useCallback(
            (g: PIXI.Graphics) => {
                g.clear();
                g.lineStyle({ width: 2, color: 0xffffff });

                for (let i = 0; i < float.length; i += 1) {
                    const x =
                        ((ContainerWidth - GraphGap * 2) / (float.length - 1)) *
                            i +
                        GraphGap;
                    const y = (0.5 - float[i] / GraphHeight / 2) * GraphHeight;

                    if (i === 0) {
                        g.moveTo(x, y);
                    } else {
                        g.lineTo(x, y);
                    }
                }
            },
            [float]
        );

        return (
            <Container x={GapSize} y={GapSize * 2 + VolumeHeight}>
                <Graphics draw={bgDraw} />
                <Graphics draw={lineDraw} />
            </Container>
        );
    };

    const ByteDraw = () => {
        const bgDraw = useCallback((g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0x000000);
            g.lineStyle({ width: 2, color: 0xffffff });
            g.drawRect(0, 0, ContainerWidth, GraphHeight);
            g.endFill();
        }, []);

        const lineDraw = useCallback(
            (g: PIXI.Graphics) => {
                g.clear();
                g.lineStyle({ width: 2, color: 0xffffff });

                for (let i = 0; i < byte.length; i += 1) {
                    const x =
                        ((ContainerWidth - GraphGap * 2) / (byte.length - 1)) *
                            i +
                        GraphGap;
                    const y = (1 - byte[i] / 255) * GraphHeight;

                    if (i === 0) {
                        g.moveTo(x, y);
                    } else {
                        g.lineTo(x, y);
                    }
                }
            },
            [byte]
        );

        return (
            <Container x={GapSize} y={GapSize * 3 + VolumeHeight + GraphHeight}>
                <Graphics draw={bgDraw} />
                <Graphics draw={lineDraw} />
            </Container>
        );
    };

    const EnergyDraw = () => {
        const bgDraw = useCallback((g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0x000000);
            g.lineStyle({ width: 2, color: 0xffffff });
            g.drawRect(0, 0, ContainerWidth, GraphHeight);
            g.endFill();
        }, []);

        const lineDraw = useCallback(
            (g: PIXI.Graphics) => {
                g.clear();
                g.lineStyle({ width: 2, color: 0xffffff });

                for (let i = 0; i < energy.length; i += 1) {
                    const x =
                        ((ContainerWidth - GraphGap * 2) /
                            (energy.length - 1)) *
                            i +
                        GraphGap;
                    const y = GraphHeight - energy[i] * GraphHeight;

                    if (i === 0) {
                        g.moveTo(x, y);
                    } else {
                        g.lineTo(x, y);
                    }
                }
            },
            [energy]
        );

        return (
            <Container
                x={GapSize}
                y={GapSize * 4 + VolumeHeight + GraphHeight * 2}>
                <Graphics draw={bgDraw} />
                <Graphics draw={lineDraw} />
            </Container>
        );
    };

    const BSWDraw = () => {
        const bgDraw = useCallback((g: PIXI.Graphics) => {
            g.clear();
            g.beginFill(0x000000);
            g.lineStyle({ width: 2, color: 0xffffff });
            g.drawRect(0, 0, ContainerWidth, GraphHeight);
            g.endFill();
        }, []);

        const lineDraw = useCallback(
            (g: PIXI.Graphics) => {
                g.clear();
                g.lineStyle({ width: 2, color: 0xffffff });

                for (let i = 0; i < bsw.length; i += 1) {
                    const x =
                        ((ContainerWidth - GraphGap * 2) / (bsw.length - 1)) *
                            i +
                        GraphGap;
                    const y = GraphHeight - bsw[i] * GraphHeight;

                    if (i === 0) {
                        g.moveTo(x, y);
                    } else {
                        g.lineTo(x, y);
                    }
                }
            },
            [bsw]
        );

        return (
            <Container
                x={GapSize}
                y={GapSize * 5 + VolumeHeight + GraphHeight * 3}>
                <Graphics draw={bgDraw} />
                <Graphics draw={lineDraw} />
            </Container>
        );
    };

    return show ? (
        <>
            <VolumeDraw />
            <FloatDraw />
            <ByteDraw />
            <EnergyDraw />
            <BSWDraw />
        </>
    ) : null;
};

export default AvatarVolume;
