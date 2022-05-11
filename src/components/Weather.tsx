import React, { useCallback, useMemo } from 'react';
import { Container, Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

// Components
import WeatherSnow from './WeatherSnow';
import WeatherRain from './WeatherRain';

// Atoms
import { useValue as useWeatherValue } from '../atoms/weather';

// Types
import { WeatherType } from '../types/WeatherType';

// Assets
import RainLightmap from '../assets/weather/rain-lightmap.png';
import SnowLightmap from '../assets/weather/snow-lightmap.png';
import { WindowHeight, WindowWidth } from '../const/App';

const Weather: React.FunctionComponent = () => {
    const weather = useWeatherValue();

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
        <>
            <Container filters={filters}>
                <WeatherDraw />
            </Container>

            {weather === WeatherType.Rain && (
                <Sprite
                    image={RainLightmap}
                    x={0}
                    y={0}
                    width={WindowWidth}
                    height={WindowHeight}
                />
            )}

            {weather === WeatherType.Snow && (
                <Sprite
                    image={SnowLightmap}
                    x={0}
                    y={0}
                    width={WindowWidth}
                    height={WindowHeight}
                />
            )}
        </>
    );
};

export default Weather;
