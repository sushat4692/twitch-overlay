import React, { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';

import styles from './WireTimeAnalogue.module.css';

// Context
import { FrameCountContext } from '../context/FrameCount';

const WireTimeAnalogue = () => {
    const frameCount = useContext(FrameCountContext);
    const [hourDeg, setHourDeg] = useState(0);
    const [minuteDeg, setMinuteDeg] = useState(0);
    const [secondDeg, setSecondDeg] = useState(0);

    useEffect(() => {
        const date = new Date();

        setHourDeg(
            (date.getHours() / 12) * 360 + (date.getMinutes() / 60 / 12) * 360
        );
        setMinuteDeg((date.getMinutes() / 60) * 360);
        setSecondDeg((date.getSeconds() / 60) * 360);
    }, [frameCount]);

    return (
        <div className={styles.WireTimeAnalogue}>
            <span
                className={styles.WireTimeAnalogue__hour}
                style={{ transform: `rotate(${hourDeg}deg)` }}></span>
            <span
                className={styles.WireTimeAnalogue__minute}
                style={{ transform: `rotate(${minuteDeg}deg)` }}></span>
            <span
                className={styles.WireTimeAnalogue__second}
                style={{ transform: `rotate(${secondDeg}deg)` }}></span>
        </div>
    );
};

export default WireTimeAnalogue;
