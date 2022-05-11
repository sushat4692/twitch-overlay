import React, { useState, useEffect, useMemo } from 'react';
import { Container, Sprite } from '@inlet/react-pixi';

// Action
import { useAvatar } from './Avatar.action';

// Utils
import { sleep } from '../util/timer';

// Components
import AvatarZoom from './AvatarZoom';
import AvatarVolume from './AvatarVolume';

// Atoms
import { useValue as useIsAvatarBiggerValue } from '../atoms/isAvatarBigger';
import { useValue as useIsAvatarFocusValue } from '../atoms/isAvatarFocus';

const AvatarComponent: React.FunctionComponent = () => {
    const isBigger = useIsAvatarBiggerValue();
    const isFocus = useIsAvatarFocusValue();

    const { AvatarSprite, showVolume, volume, startHandler } = useAvatar();

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
            <Container
                x={1765}
                y={1085}
                scale={scale}
                interactive={true}
                pointerdown={startHandler}>
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

            <AvatarVolume show={showVolume} volume={volume} />
        </>
    );
};

export default AvatarComponent;
