import React, { useCallback, useState, useContext } from 'react';

// Const
import { sampleRate, fftSize, avatarDuration } from '../const/App';

// Context
import { FrameCountContext } from '../context/FrameCount';

import styles from './Avatar.module.css';

type Props = {
    is8Bit: boolean;
    isGaming: boolean;
};

const AvatarComponent: React.FunctionComponent<Props> = ({
    is8Bit,
    isGaming,
}) => {
    const frameCount = useContext(FrameCountContext);
    const [volume, updateVolume] = useState(0);

    const startHandler = useCallback(() => {
        (async () => {
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
        })();
    }, []);

    return (
        <>
            <div
                data-open={
                    volume > 1 &&
                    frameCount % avatarDuration < avatarDuration / 2
                }
                data-gaming={isGaming}
                data-is8bit={is8Bit}
                className={styles.Avatar}
                onClick={startHandler}></div>
        </>
    );
};

export default AvatarComponent;
