import { audioCtx, playSound } from './playSound';

import Sound1 from '../assets/avatar/sound1.mp3';
import SoundGrayScale from '../assets/avatar/sound-grayscale.mp3';
import SoundGaming from '../assets/avatar/sound-gaming.mp3';
import SoundGunya from '../assets/avatar/sound-gunya.mp3';
import SoundFocus from '../assets/avatar/sound-focus.mp3';
import SoundZoomin from '../assets/avatar/sound-zoomin.mp3';
import SoundZoomout from '../assets/avatar/sound-zoomout.mp3';
import SoundGlitch from '../assets/avatar/sound-glitch.mp3';

let sound1Buffer: AudioBuffer;
let soundGrayScaleBuffer: AudioBuffer;
let soundGamingBuffer: AudioBuffer;
let soundGunyaBuffer: AudioBuffer;
let soundFocusBuffer: AudioBuffer;
let soundZoominBuffer: AudioBuffer;
let soundZoomoutBuffer: AudioBuffer;
let soundGlitchBuffer: AudioBuffer;

export const prepare = async () => {
    const setupSample = async (file: string) => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    };

    sound1Buffer = await setupSample(Sound1);
    soundGrayScaleBuffer = await setupSample(SoundGrayScale);
    soundGamingBuffer = await setupSample(SoundGaming);
    soundGunyaBuffer = await setupSample(SoundGunya);
    soundFocusBuffer = await setupSample(SoundFocus);
    soundZoominBuffer = await setupSample(SoundZoomin);
    soundZoomoutBuffer = await setupSample(SoundZoomout);
    soundGlitchBuffer = await setupSample(SoundGlitch);
    return;
};

export const play = () => {
    const buffer = (() => {
        const index = Math.floor(Math.random() * 5);

        switch (index) {
            default:
                return sound1Buffer;
        }
    })();

    playSound(buffer, 0.1);
};

export const playGrayScale = () => {
    playSound(soundGrayScaleBuffer, 0.2);
};

export const playGaming = () => {
    playSound(soundGamingBuffer, 0.2);
};

export const playGunya = () => {
    playSound(soundGunyaBuffer, 0.2);
};

export const playFocus = () => {
    playSound(soundFocusBuffer, 0.2);
};

export const playZoomin = () => {
    playSound(soundZoominBuffer, 0.2);
};

export const playZoomout = () => {
    playSound(soundZoomoutBuffer, 0.2);
};

export const playGlitch = () => {
    playSound(soundGlitchBuffer, 0.1, 10);
};
