import React from 'react';

// Const
import { threshold, graphMax } from '../const/App';

// Type
import { AvatarFilter } from '../types/AvatarFilter';

// Action
import { useAvatar } from './Avatar.action';

import styles from './Avatar.module.css';

type Props = {
    is8Bit: boolean;
    isGunya: boolean;
    filter: AvatarFilter;
};

const AvatarComponent: React.FunctionComponent<Props> = (props) => {
    const { canvasEl, showVolume, volume, startHandler } = useAvatar(props);

    return (
        <>
            <div className={styles.Avatar} onClick={startHandler}>
                <canvas
                    ref={canvasEl}
                    className={styles.Avatar__canvas}></canvas>
                {showVolume ? (
                    <div className={styles.Avatar__volume}>
                        <div
                            className={styles.Avatar__volume__bar}
                            style={{
                                width: `${(volume / graphMax) * 100}%`,
                            }}></div>

                        <div
                            className={styles.Avatar__volume__threshold}
                            style={{
                                left: `${(threshold / graphMax) * 100}%`,
                            }}></div>
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default AvatarComponent;
