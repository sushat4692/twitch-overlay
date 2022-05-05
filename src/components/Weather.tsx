import React, { useCallback, useMemo } from 'react';
import styles from './Weather.module.css';
import { Stage as PixiStage, Container } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

// Const
import { WindowWidth, WindowHeight } from '../const/App';

// Context
import { FrameCountContext } from '../context/FrameCount';

import WeatherSnow from './WeatherSnow';
import WeatherRain from './WeatherRain';

// Types
import { WeatherType } from '../types/WeatherType';

// Bridge
type ContextBridgeProps = {
    Context: React.Context<number>;
    render: (children: React.ReactNode) => React.ReactNode;
};
const ContextBridge: React.FunctionComponent<ContextBridgeProps> = ({
    children,
    Context,
    render,
}) => {
    return (
        <Context.Consumer>
            {(value) =>
                render(
                    <Context.Provider value={value}>
                        {children}
                    </Context.Provider>
                )
            }
        </Context.Consumer>
    );
};

type StageProps = React.ComponentProps<typeof PixiStage>;
const Stage: React.FunctionComponent<StageProps> = ({ children, ...props }) => {
    return (
        <ContextBridge
            Context={FrameCountContext}
            render={(children) => <PixiStage {...props}>{children}</PixiStage>}>
            {children}
        </ContextBridge>
    );
};

type Props = {
    weather: WeatherType;
};
const Weather: React.FunctionComponent<Props> = ({ weather }) => {
    const WeatherDraw = useCallback(() => {
        switch (weather) {
            case WeatherType.Rain:
                return (
                    <>
                        {[...Array(300)].map((_, i) => (
                            <WeatherRain key={i} />
                        ))}
                    </>
                );
            case WeatherType.Snow:
                return (
                    <>
                        {[...Array(300)].map((_, i) => (
                            <WeatherSnow key={i} />
                        ))}
                    </>
                );
        }
        return null;
    }, [weather]);

    const filters = useMemo(() => {
        switch (weather) {
            case WeatherType.Snow: {
                const blurFilter = new PIXI.filters.BlurFilter();
                blurFilter.blur = 2;
                return [blurFilter];
            }
        }

        return null;
    }, [weather]);

    return (
        <div className={styles.Weather} data-weather={weather}>
            <Stage
                width={WindowWidth}
                height={WindowHeight}
                options={{ backgroundAlpha: 0 }}>
                <Container filters={filters}>
                    <WeatherDraw />
                </Container>
            </Stage>

            {weather === WeatherType.Rain && (
                <div
                    className={`${styles.Weather__mask} ${styles['Weather__mask--rain']}`}></div>
            )}

            {weather === WeatherType.Snow && (
                <div
                    className={`${styles.Weather__mask} ${styles['Weather__mask--snow']}`}></div>
            )}
        </div>
    );
};

export default Weather;
