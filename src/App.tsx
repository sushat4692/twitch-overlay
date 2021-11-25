import React from 'react';
import styles from './App.module.css';

// Components
import Wires from './components/Wires';
import Cat from './components/Cat';
import Building from './components/Building';
import Car from './components/Car';

// Context
import { FrameCountContext } from './context/FrameCount';

// Util
import { useAnimationFrameCount } from './util/useAnimationFrameCount';
import { useTwitchPubSubEvent } from './util/useTwitchPubSubEvent';
import { useTwitchChatEvent } from './util/useTwitchChatEvent';

function App() {
    const frameCount = useAnimationFrameCount();
    const { cats, cars, builds, imageZoom } = useTwitchPubSubEvent();
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

                <Wires
                    imageZoom={imageZoom}
                    topics={topics}
                    topicShow={topicShow}
                />
            </div>
        </FrameCountContext.Provider>
    );
}

export default App;
