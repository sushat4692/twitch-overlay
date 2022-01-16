export const audioCtx = new AudioContext();

export const playSound = (buffer: AudioBuffer, gain: number) => {
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = gain;
    gainNode.connect(audioCtx.destination);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    source.start(0);
};
