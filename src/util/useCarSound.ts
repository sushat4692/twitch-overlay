import { audioCtx, playSound } from '@/util/playSound';

import Sound1 from '@/assets/car/sound1.mp3';

let sound1Buffer: AudioBuffer;

export const prepareCarSound = async () => {
    const setupSample = async (file: string) => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    };

    sound1Buffer = await setupSample(Sound1);
    return;
};

export const playCarSound = () => {
    const buffer = (() => {
        const index = Math.floor(Math.random() * 5);

        switch (index) {
            default:
                return sound1Buffer;
        }
    })();

    playSound(buffer, 0.1);
};
