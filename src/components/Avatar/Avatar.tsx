import React, { useState, useEffect, useMemo } from 'react';
import { Container, Sprite } from '@pixi/react';

// Utils
import { sleep } from '@/util';

// Components
import { AvatarZoom, AvatarVolume, useAvatar } from '@/components';

// Atoms
import { useIsAvatarBiggerValue, useIsAvatarFocusValue } from '@/atoms';

export const Avatar: React.FC = () => {
    const isBigger = useIsAvatarBiggerValue();
    const isFocus = useIsAvatarFocusValue();

    const { AvatarSprite, showVolume, volume, bsw, energy, float, byte } =
        useAvatar();

    const [scale, setScale] = useState(1.3);
    useEffect(() => {
        if (isBigger) {
            (async () => {
                setScale(2);
                await sleep(100);
                setScale(1.3);
                await sleep(100);
                setScale(2);
                await sleep(100);
                setScale(1.3);
                await sleep(100);
                setScale(2);
            })();
        } else {
            (async () => {
                setScale(1.3);
                await sleep(100);
                setScale(2);
                await sleep(100);
                setScale(1.3);
                await sleep(100);
                setScale(2);
                await sleep(100);
                setScale(1.3);
            })();
        }
    }, [isBigger]);

    const mask = React.useRef<any>();
    const AvatarZoomMask = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', `1000`);
        canvas.setAttribute('height', `1000`);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const gradient = ctx.createRadialGradient(500, 500, 200, 500, 500, 500);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'black');

        ctx.beginPath();
        ctx.arc(500, 500, 500, 0, Math.PI * 2, true);
        ctx.fillStyle = gradient;
        ctx.fill();

        return canvas;
    }, []);

    return (
        <>
            <Container x={1765} y={1085} scale={scale}>
                <AvatarSprite />
            </Container>

            {isFocus && (
                <Container x={1765} y={1085} scale={scale} mask={mask.current}>
                    <AvatarZoom />
                    <Sprite
                        source={AvatarZoomMask}
                        ref={mask}
                        anchor={[0.52, 0.68]}
                    />
                </Container>
            )}

            <AvatarVolume
                show={showVolume}
                volume={volume}
                bsw={bsw}
                energy={energy}
                float={float}
                byte={byte}
            />
        </>
    );
};
