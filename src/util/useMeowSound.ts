import { useState, useEffect, useCallback } from 'react';

import Sound1 from '../assets/cat-meowing-1.mp3'
import Sound2 from '../assets/cat-meowing-2.mp3'
import Sound3 from '../assets/cat-meowing-3.mp3'
import Sound4 from '../assets/cat-meowing-4.mp3'
import Sound5 from '../assets/cat-meowing-5.mp3'

let sound1Buffer: AudioBuffer;
let sound2Buffer: AudioBuffer;
let sound3Buffer: AudioBuffer;
let sound4Buffer: AudioBuffer;
let sound5Buffer: AudioBuffer;

export const prepareMeowSound = () => {
    return new Promise<void>(async (resolve) => {
        const ctx = new AudioContext();

        const setupSample = async (file: string) => {
            const response = await fetch(file);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            return audioBuffer;
        }

        sound1Buffer = await setupSample(Sound1)
        sound2Buffer = await setupSample(Sound2)
        sound3Buffer = await setupSample(Sound3)
        sound4Buffer = await setupSample(Sound4)
        sound5Buffer = await setupSample(Sound5)

        resolve()
    })
}

export const useMeowSound = () => {
    const [ctx] = useState(new AudioContext());

    return useCallback(async () => {
        const buffer = (() => {
            const index = Math.floor(Math.random() * 5)

            switch (index) {
                case 0:
                    return sound1Buffer;
                case 1:
                    return sound2Buffer;
                case 2:
                    return sound3Buffer;
                case 3:
                    return sound4Buffer;
                case 4:
                    return sound5Buffer;
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