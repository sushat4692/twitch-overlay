import { useRef, useEffect, useCallback, useState, useContext } from 'react';
import * as THREE from 'three';

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

// Values
let renderer: THREE.WebGLRenderer | null = null;

// Webgl Shader
import vertexShader from './Avatar.Shader.vert';
import fragmentShader from './Avatar.Shader.frag';

// Utils
import { focusLine } from '../util/focusLine';

type Props = {
    is8Bit: boolean;
    isGunya: boolean;
    isFocus: boolean;
    filter: AvatarFilter;
};

export const useAvatar = ({ is8Bit, isGunya, isFocus, filter }: Props) => {
    const frameCount = useContext(FrameCountContext);

    // Three.js
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const canvas2DEl = useRef<HTMLCanvasElement>(null);
    const scene = useRef<THREE.Scene>();
    const camera = useRef<THREE.PerspectiveCamera>();
    const mesh =
        useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>();
    const uniforms = useRef<{ [uniform: string]: THREE.IUniform<any> }>({});

    // Texture
    const ImageNormalCloseTexture = useRef(
        new THREE.TextureLoader().load(ImageNormalClose)
    );
    const ImageNormalOpenTexture = useRef(
        new THREE.TextureLoader().load(ImageNormalOpen)
    );
    const Image8bitCloseTexture = useRef(
        new THREE.TextureLoader().load(Image8bitClose)
    );
    const Image8bitOpenTexture = useRef(
        new THREE.TextureLoader().load(Image8bitOpen)
    );

    // Mic
    const isStartedMic = useRef(false);
    const [showVolume, updateShowVolume] = useState(false);
    const [volume, updateVolume] = useState(0);

    // FocusLine
    const focusLineDraw = useRef<ReturnType<typeof focusLine>>();

    useEffect(() => {
        if (!canvasEl.current || !canvas2DEl.current) {
            return;
        }

        const domRect = canvasEl.current.getBoundingClientRect();
        const canvasSize = {
            w: domRect.width,
            h: domRect.height,
        };

        renderer = new THREE.WebGLRenderer({
            canvas: canvasEl.current,
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvasSize.w, canvasSize.h);

        // ウィンドウとwebGLの座標を一致させるため、描画がウィンドウぴったりになるようカメラを調整
        const fov = 60; // 視野角
        const fovRad = (fov / 2) * (Math.PI / 180);
        const dist = canvasSize.h / 2 / Math.tan(fovRad);
        camera.current = new THREE.PerspectiveCamera(
            fov,
            canvasSize.w / canvasSize.h,
            0.1,
            1000
        );
        camera.current.position.z = dist;

        scene.current = new THREE.Scene();

        uniforms.current = {
            uTexture: { value: ImageNormalCloseTexture.current },
            uImageAspect: { value: 600 / 650 }, // 画像のアスペクト
            uPlaneAspect: { value: domRect.width / domRect.height }, // プレーンのアスペクト
            uTime: { value: 0 },
            uOffset: { value: 0 },
            uFreq: { value: 0 },
            uAmp: { value: 0 },
            uGrayScaleFlag: { value: false },
            uGamingFlag: { value: false },
        };
        const geo = new THREE.PlaneBufferGeometry(
            domRect.width,
            domRect.height,
            100,
            100
        );
        const mat = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            uniforms: uniforms.current,
            vertexShader,
            fragmentShader,
        });

        mesh.current = new THREE.Mesh(geo, mat);
        scene.current.add(mesh.current);

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
    }, []);

    useEffect(() => {
        if (!mesh.current) {
            return;
        }

        if (is8Bit) {
            mesh.current.material.uniforms.uTexture.value =
                Image8bitCloseTexture.current;
        } else {
            mesh.current.material.uniforms.uTexture.value =
                ImageNormalCloseTexture.current;
        }
    }, [is8Bit]);

    useEffect(() => {
        if (!mesh.current) {
            return;
        }

        if (isGunya) {
            uniforms.current.uOffset.value = 0.05;
            uniforms.current.uFreq.value = 0.05;
            uniforms.current.uAmp.value = 10.0;
        } else {
            uniforms.current.uOffset.value = 0;
            uniforms.current.uFreq.value = 0;
            uniforms.current.uAmp.value = 0;
        }
    }, [isGunya]);

    useEffect(() => {
        switch (filter) {
            case AvatarFilter.Gaming:
                uniforms.current.uGrayScaleFlag.value = false;
                uniforms.current.uGamingFlag.value = true;
                return;
            case AvatarFilter.Grayscale:
                uniforms.current.uGrayScaleFlag.value = true;
                uniforms.current.uGamingFlag.value = false;
                return;
            case AvatarFilter.Normal:
                uniforms.current.uGrayScaleFlag.value = false;
                uniforms.current.uGamingFlag.value = false;
                return;
        }
    }, [filter]);

    useEffect(() => {
        if (!mesh.current) {
            return;
        }

        if (
            volume > threshold &&
            frameCount % avatarDuration < avatarDuration / 2
        ) {
            // Open
            if (is8Bit) {
                mesh.current.material.uniforms.uTexture.value =
                    Image8bitOpenTexture.current;
            } else {
                mesh.current.material.uniforms.uTexture.value =
                    ImageNormalOpenTexture.current;
            }
        } else {
            // Close
            if (is8Bit) {
                mesh.current.material.uniforms.uTexture.value =
                    Image8bitCloseTexture.current;
            } else {
                mesh.current.material.uniforms.uTexture.value =
                    ImageNormalCloseTexture.current;
            }
        }
    }, [is8Bit, frameCount, volume]);

    useEffect(() => {
        if (!renderer || !scene.current || !camera.current) {
            return;
        }

        uniforms.current.uTime.value += 1;
        renderer.render(scene.current, camera.current);

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
    }, []);

    return {
        canvasEl,
        canvas2DEl,
        showVolume,
        volume,
        startHandler,
    };
};
