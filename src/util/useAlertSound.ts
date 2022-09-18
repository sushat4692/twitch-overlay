import { audioCtx, playSound } from '@/util/playSound';

import SoundFollow from '@/assets/alert/follow.mp3';
import SoundSub from '@/assets/alert/sub.mp3';
import SoundRaid from '@/assets/alert/raid.mp3';
import SoundLvup from '@/assets/alert/lvup.mp3';

let soundFollowBuffer: AudioBuffer;
let soundSubBuffer: AudioBuffer;
let soundRaidBuffer: AudioBuffer;
let soundLvupBuffer: AudioBuffer;

export const prepareAlertSound = async () => {
    const setupSample = async (file: string) => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    };

    soundFollowBuffer = await setupSample(SoundFollow);
    soundSubBuffer = await setupSample(SoundSub);
    soundRaidBuffer = await setupSample(SoundRaid);
    soundLvupBuffer = await setupSample(SoundLvup);
    return;
};

export const playFollow = () => {
    playSound(soundFollowBuffer, 0.2);
};

export const playSub = () => {
    playSound(soundSubBuffer, 0.2);
};

export const playRaid = () => {
    playSound(soundRaidBuffer, 0.2);
};

export const playLvup = () => {
    playSound(soundLvupBuffer, 0.1);
};
