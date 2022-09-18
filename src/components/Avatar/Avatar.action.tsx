import React, {
    useRef,
    useEffect,
    useCallback,
    useState,
    useContext,
    useMemo,
} from 'react';
import * as PIXI from 'pixi.js';
import { Sprite } from '@inlet/react-pixi';
import {
    ZoomBlurFilter,
    // AsciiFilter,
    GlitchFilter,
    ReflectionFilter,
} from 'pixi-filters';

// Const
import { threshold, fftSize, avatarDuration } from '@/const';

// Type
import { AvatarFilter } from '@/types';

// Context
import { FrameCountContext } from '@/context';

// Images
import ImageNormalMute from '@/assets/avatar/image-normal-mute.png';
import ImageNormalClose from '@/assets/avatar/image-normal-close.png';
import ImageNormalOpen from '@/assets/avatar/image-normal-open.png';
import Image8bitMute from '@/assets/avatar/image-8bit-mute.png';
import Image8bitClose from '@/assets/avatar/image-8bit-close.png';
import Image8bitOpen from '@/assets/avatar/image-8bit-open.png';

// Utils
import { Lipsync } from '@/util';

// Webgl Shader
import fragmentShader from './Avatar.Shader.frag';

// Atoms
import {
    useIsAvatar8BitValue,
    useIsAvatarGunyaValue,
    useIsAvatarFocusValue,
    useIsAvatarGlitchValue,
    useAvatarFilterValue,
} from '@/atoms';

const lipSync = new Lipsync({ fftSize });

export const useAvatar = () => {
    const isInited = useRef(false);
    const frameCount = useContext(FrameCountContext);

    const is8Bit = useIsAvatar8BitValue();
    const isGunya = useIsAvatarGunyaValue();
    const isFocus = useIsAvatarFocusValue();
    const isGlitch = useIsAvatarGlitchValue();
    const filter = useAvatarFilterValue();

    const [texture, setTexture] = useState(PIXI.Texture.from(ImageNormalClose));
    // const [filters, setFilters] = useState(new PIXI.Shader({vertexSrc: vertexShader, fragmentSrc: fragmentShader},{}));

    const muteTexture = useMemo(() => {
        if (is8Bit) {
            return PIXI.Texture.from(Image8bitMute);
        } else {
            return PIXI.Texture.from(ImageNormalMute);
        }
    }, [is8Bit]);

    // Mic
    const isStartedMic = useRef(0);
    const [showVolume, updateShowVolume] = useState(false);
    const [volume, updateVolume] = useState(0);
    const [energy, updateEnergy] = useState<
        [number, number, number, number, number]
    >([0, 0, 0, 0, 0]);
    const [bsw, updateBsw] = useState<[number, number, number]>([0, 0, 0]);
    const [float, updateFloat] = useState<Float32Array>(new Float32Array());
    const [byte, updateByte] = useState<Uint8Array>(new Uint8Array());

    const AvatarSprite = useCallback(() => {
        const filters: any[] = [];

        if (filter === AvatarFilter.Grayscale) {
            const grayScaleFilter = new PIXI.filters.ColorMatrixFilter();
            grayScaleFilter.grayscale(0.3, false);
            filters.push(grayScaleFilter);
        }

        if (filter === AvatarFilter.Gaming) {
            filters.push(
                new PIXI.Filter('', fragmentShader, {
                    uTime: frameCount,
                })
            );
        }

        if (isFocus) {
            filters.push(
                new ZoomBlurFilter({
                    strength: 0.2,
                    center: [306 / 2, 136],
                })
            );
        }

        if (isGunya) {
            filters.push(
                new ReflectionFilter({
                    mirror: false,
                    boundary: 0,
                    amplitude: [10, 10],
                    waveLength: [200, 200],
                    time: frameCount / 5,
                })
            );
        }

        // filters.push(new AsciiFilter(6));

        if (isGlitch) {
            filters.push(
                new GlitchFilter({
                    slices: 100,
                    offset: 10,
                    red: [0, 0],
                    green: [5, 5],
                    blue: [-5, -5],
                })
            );
        }

        return (
            <>
                <Sprite
                    texture={texture}
                    filters={filters}
                    width={306}
                    height={332}
                    anchor={[0.6, 0.9]}
                />
                {isStartedMic.current === 0 && (
                    <Sprite
                        texture={muteTexture}
                        filters={filters}
                        width={306}
                        height={332}
                        anchor={[0.6, 0.9]}
                    />
                )}
            </>
        );
    }, [filter, isFocus, isGunya, isGlitch, muteTexture, texture, frameCount]);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        window.addEventListener('click', startHandler);

        const check = () => {
            const result = lipSync.update();

            if (result) {
                updateVolume(result.volume);
                updateBsw(result.bsw);
                updateEnergy(result.energy);
                updateFloat(result.float);
                updateByte(result.byte);
            }

            if (isInited.current) {
                requestAnimationFrame(check);
            }
        };
        check();

        return () => {
            lipSync.stop();
            isInited.current = false;
        };
    }, []);

    useEffect(() => {
        if (
            volume > threshold &&
            frameCount % avatarDuration < avatarDuration / 2
        ) {
            // Open
            if (is8Bit) {
                // 8bit open
                setTexture(PIXI.Texture.from(Image8bitOpen));
            } else {
                // normal open
                setTexture(PIXI.Texture.from(ImageNormalOpen));
            }
        } else {
            // Close
            if (is8Bit) {
                // 8bit close
                setTexture(PIXI.Texture.from(Image8bitClose));
            } else {
                // normal close
                setTexture(PIXI.Texture.from(ImageNormalClose));
            }
        }
    }, [is8Bit, frameCount, volume]);

    const toggleShowVolume = useCallback(() => {
        updateShowVolume((prev) => !prev);
    }, []);

    const startHandler = useCallback(async () => {
        isStartedMic.current += 1;

        switch (isStartedMic.current) {
            case 1:
                await lipSync.startMic();
                break;
            case 2:
                toggleShowVolume();
                break;
            case 3:
                toggleShowVolume();
                lipSync.stop();
                isStartedMic.current = 0;
                break;
        }
    }, [toggleShowVolume]);

    return {
        AvatarSprite,
        showVolume,
        volume,
        bsw,
        energy,
        float,
        byte,
        startHandler,
    };
};
