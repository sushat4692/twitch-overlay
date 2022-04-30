import React from 'react';
import styles from './App.module.css';

// Type
import { WeatherType } from './types/WeatherType';

// Components
import Wires from './components/Wires';
import Cat from './components/Cat';
import Building from './components/Building';
import Car from './components/Car';
import Dino from './components/Dino';
import Avatar from './components/Avatar';
import WeatherRain from './components/WeatherRain';
import WeatherSnow from './components/WeatherSnow';
import Alert from './components/Alert';

// Context
import { FrameCountContext } from './context/FrameCount';

// Util
import { useAnimationFrameCount } from './util/useAnimationFrameCount';
import { useTwitchPubSubEvent } from './util/useTwitchPubSubEvent';
import { useTwitchChatEvent } from './util/useTwitchChatEvent';

function App() {
    const frameCount = useAnimationFrameCount();
    const {
        cats,
        cars,
        dinos,
        builds,
        imageZoom,
        isAvatar8Bit,
        isAvatarGunya,
        isAvatarBigger,
        isAvatarFocus,
        weather,
        avatarFilter,
    } = useTwitchPubSubEvent();
    const { topics, topicShow } = useTwitchChatEvent();

    return (
        <FrameCountContext.Provider value={frameCount}>
            <div className={styles.App}>
                <div className={styles.App__cat}>
                    {cats.map((cat) => {
                        return <Cat key={cat.id} />;
                    })}
                </div>
                <div className={styles.App__land}>
                    {builds.map((build) => {
                        return <Building key={build.id} />;
                    })}
                </div>
                <div className={styles.App__car}>
                    {cars.map((car) => {
                        return <Car key={car.id} />;
                    })}
                </div>
                <div className={styles.App__dino}>
                    {dinos.map((dino) => {
                        return <Dino key={dino.id} />;
                    })}
                </div>

                <Avatar
                    is8Bit={isAvatar8Bit}
                    isGunya={isAvatarGunya}
                    isBigger={isAvatarBigger}
                    isFocus={isAvatarFocus}
                    filter={avatarFilter}
                />

                <Wires
                    imageZoom={imageZoom}
                    topics={topics}
                    topicShow={topicShow}
                />

                {weather === WeatherType.Rain ? <WeatherRain /> : null}
                {weather === WeatherType.Snow ? <WeatherSnow /> : null}

                <Alert />
            </div>
        </FrameCountContext.Provider>
    );
}

export default App;
