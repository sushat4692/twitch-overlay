import { audioCtx, playSound } from '@/util/playSound';

import SoundEncount from '@/assets/battle/encount.mp3';
import SoundMiss from '@/assets/battle/miss.mp3';
import SoundYourAttack from '@/assets/battle/your_attack.mp3';
import SoundYourCritical from '@/assets/battle/your_critical.mp3';
import SoundEnemyAttack from '@/assets/battle/enemy_attack.mp3';
import SoundEnemyCritical from '@/assets/battle/enemy_critical.mp3';
import SoundGameClear from '@/assets/battle/game_clear.mp3';
import SoundGameOver from '@/assets/battle/game_over.mp3';

let soundEncount: AudioBuffer;
let soundMiss: AudioBuffer;
let soundYourAttack: AudioBuffer;
let soundYourCritical: AudioBuffer;
let soundEnemyAttack: AudioBuffer;
let soundEnemyCritical: AudioBuffer;
let soundGameClear: AudioBuffer;
let soundGameOver: AudioBuffer;

export const prepareBattleSound = async () => {
    const setupSample = async (file: string) => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    };

    soundEncount = await setupSample(SoundEncount);
    soundMiss = await setupSample(SoundMiss);
    soundYourAttack = await setupSample(SoundYourAttack);
    soundYourCritical = await setupSample(SoundYourCritical);
    soundEnemyAttack = await setupSample(SoundEnemyAttack);
    soundEnemyCritical = await setupSample(SoundEnemyCritical);
    soundGameClear = await setupSample(SoundGameClear);
    soundGameOver = await setupSample(SoundGameOver);
};

export const playEncount = () => {
    playSound(soundEncount, 0.2);
};

export const playMiss = () => {
    playSound(soundMiss, 0.2);
};

export const playYourAttack = () => {
    playSound(soundYourAttack, 0.2);
};

export const playYourCritical = () => {
    playSound(soundYourCritical, 0.2);
};

export const playEnemyAttack = () => {
    playSound(soundEnemyAttack, 0.2);
};

export const playEnemyCritical = () => {
    playSound(soundEnemyCritical, 0.2);
};

export const playGameClear = () => {
    playSound(soundGameClear, 0.2);
};

export const playGameOver = () => {
    playSound(soundGameOver, 0.2);
};
