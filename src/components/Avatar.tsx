import React from 'react';
import classNames from 'classnames/bind';
import { Stage } from '@inlet/react-pixi';

// Const
import { threshold, graphMax } from '../const/App';

// Type
import { AvatarFilter } from '../types/AvatarFilter';

// Action
import { useAvatar } from './Avatar.action';

import styles from './Avatar.module.css';
const cx = classNames.bind(styles);

type Props = {
    is8Bit: boolean;
    isGunya: boolean;
    isBigger: boolean;
    isFocus: boolean;
    isGlitch: boolean;
    filter: AvatarFilter;
};

const AvatarComponent: React.FunctionComponent<Props> = (props) => {
    const { AvatarSprite, canvas2DEl, showVolume, volume, startHandler } =
        useAvatar(props);

    return (
        <>
            <div
                className={cx({ Avatar: true, 'Avatar--zoom': props.isBigger })}
                // onClick={startHandler}
            >
                {/* <canvas
                    ref={canvasEl}
                    className={styles.Avatar__canvas}></canvas> */}
                <Stage
                    width={306}
                    height={332}
                    options={{
                        backgroundAlpha: 0,
                        width: 306,
                        height: 332,
                        resolution: 2,
                        antialias: false,
                    }}>
                    <AvatarSprite />
                </Stage>
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
            <div
                className={cx({
                    AvatarEffect: true,
                    'AvatarEffect--active': props.isFocus,
                    'Avatar--zoom': props.isBigger,
                })}
                onClick={startHandler}>
                <canvas
                    ref={canvas2DEl}
                    className={styles.Avatar__canvas}></canvas>
            </div>
        </>
    );
};

export default AvatarComponent;
