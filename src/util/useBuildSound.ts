import { useState, useEffect, useCallback } from 'react';

import Sound1 from '../assets/building-sound-1.mp3'

let sound1Buffer: AudioBuffer;

export const prepareBuildSound = () => {
    return new Promise<void>(async (resolve) => {
        const ctx = new AudioContext();

        const setupSample = async (file: string) => {
            const response = await fetch(file);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            return audioBuffer;
        }

        sound1Buffer = await setupSample(Sound1)

        resolve()
    })
}

export const useBuildSound = () => {
    const [ctx] = useState(new AudioContext());

    return useCallback(async () => {
        const buffer = (() => {
            const index = Math.floor(Math.random() * 5)

            switch (index) {
                default:
                    return sound1Buffer;
            }
        })()

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1;
        gainNode.connect(ctx.destination);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.start(0);
    }, [])
}