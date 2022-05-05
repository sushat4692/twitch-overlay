import { audioCtx, playSound } from './playSound';

import SoundRain from '../assets/weather/rain.mp3';
import SoundSnow from '../assets/weather/snow.mp3';

let soundRainBuffer: AudioBuffer;
let soundSnowBuffer: AudioBuffer;

export const prepare = async () => {
    const setupSample = async (file: string) => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    };

    soundRainBuffer = await setupSample(SoundRain);
    soundSnowBuffer = await setupSample(SoundSnow);
};

export const playRain = () => {
    playSound(soundRainBuffer, 0.2, 10);
};

export const playSnow = () => {
    playSound(soundSnowBuffer, 0.1);
};
