import React, {
    useRef,
    useEffect,
    useCallback,
    useState,
    useContext,
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
import { sampleRate, threshold, fftSize, avatarDuration } from '../const/App';

// Type
import { AvatarFilter } from '../types/AvatarFilter';

// Context
import { FrameCountContext } from '../context/FrameCount';

// Images
import ImageNormalClose from '../assets/avatar/image-normal-close.png';
import ImageNormalOpen from '../assets/avatar/image-normal-open.png';
import Image8bitClose from '../assets/avatar/image-8bit-close.png';
import Image8bitOpen from '../assets/avatar/image-8bit-open.png';

// Webgl Shader
// import vertexShader from './Avatar.Shader.vert';
import fragmentShader from './Avatar.Shader.frag';

// Utils
import { focusLine } from '../util/focusLine';

type Props = {
    is8Bit: boolean;
    isGunya: boolean;
    isFocus: boolean;
    isGlitch: boolean;
    filter: AvatarFilter;
};

export const useAvatar = ({
    is8Bit,
    isGunya,
    isFocus,
    isGlitch,
    filter,
}: Props) => {
    const isInited = useRef(false);
    const frameCount = useContext(FrameCountContext);
    const [texture, setTexture] = useState(PIXI.Texture.from(ImageNormalClose));
    // const [filters, setFilters] = useState(new PIXI.Shader({vertexSrc: vertexShader, fragmentSrc: fragmentShader},{}));

    // Mic
    const isStartedMic = useRef(false);
    const [showVolume, updateShowVolume] = useState(false);
    const [volume, updateVolume] = useState(0);

    // FocusLine
    const canvas2DEl = useRef<HTMLCanvasElement>(null);
    const focusLineDraw = useRef<ReturnType<typeof focusLine>>();

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
                    time: (frameCount / 5) % 21,
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
            <Sprite
                texture={texture}
                filters={filters}
                width={306}
                height={332}
            />
        );
    }, [filter, isFocus, isGunya, isGlitch, texture, frameCount]);

    useEffect(() => {
        if (!canvas2DEl.current) {
            return;
        }

        if (isInited.current) {
            return;
        }
        isInited.current = true;

        focusLineDraw.current = focusLine(
            canvas2DEl.current,
            canvas2DEl.current.width / 2,
            canvas2DEl.current.height / 2,
            30,
            200,
            100,
            70,
            'gray'
        );

        return () => {
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

    useEffect(() => {
        if (!focusLineDraw.current || !isFocus) {
            return;
        }
        focusLineDraw.current.render();
    }, [frameCount, isFocus]);

    const toggleShowVolume = useCallback(() => {
        updateShowVolume((prev) => !prev);
    }, []);

    const startHandler = useCallback(async () => {
        if (isStartedMic.current) {
            return toggleShowVolume();
        }
        isStartedMic.current = true;

        const audioCtx = new AudioContext({ sampleRate });
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        const source = audioCtx.createMediaStreamSource(stream);

        const analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = 0.3;
        analyzer.fftSize = fftSize;

        source.connect(analyzer);

        const check = () => {
            const array = new Uint8Array(analyzer.frequencyBinCount);
            analyzer.getByteFrequencyData(array);
            const volume =
                array.reduce((prev, current) => prev + current, 0) /
                array.length;

            updateVolume(volume);

            requestAnimationFrame(check);
        };
        check();
    }, [toggleShowVolume]);

    return {
        AvatarSprite,
        canvas2DEl,
        showVolume,
        volume,
        startHandler,
    };
};
