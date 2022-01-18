import React from 'react';
import styles from './WeatherRain.module.css';

const drops = new Array(200).fill(0).map(() => Math.random());

const Rain = (): JSX.Element => {
    return (
        <div className={styles.WeatherRain}>
            <div className={styles.WeatherRain__rains}>
                {drops.map((d, i) => (
                    <span key={i} style={{ animationDelay: `${d}s` }} />
                ))}
            </div>
        </div>
    );
};

export default Rain;
