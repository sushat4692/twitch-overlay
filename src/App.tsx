import React, { useEffect, useState, useCallback } from 'react'
import styles from './App.module.css'
import { ApiClient } from 'twitch';
import { PubSubClient } from 'twitch-pubsub-client';
import { StaticAuthProvider } from 'twitch-auth'
import {v4 as uuid} from 'uuid'

// Components
import Cat from './components/Cat'
import Building from './components/Building'
import Car from './components/Car'

// Util
import {useMeowSound} from './util/useMeowSound'
import {useBuildSound} from './util/useBuildSound'
import {useCarSound} from './util/useCarSound'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string;
const CLIENT_TOKEN = import.meta.env.VITE_CLIENT_TOKEN as string;

function App() {
  const [cats, updateCats] = useState<{id: string}[]>([
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
  ])
  const [builds, updateBuilds] = useState<{id: string}[]>([
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
  ])
  const [cars, updateCars] = useState<{id: string}[]>([
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
    {id: uuid()},
  ])
  const [apiClient] = useState(new ApiClient({authProvider: new StaticAuthProvider(CLIENT_ID, CLIENT_TOKEN)}))
  const [pubSubClient] = useState(new PubSubClient())
  const meowSound = useMeowSound();
  const buildSound = useBuildSound();
  const carSound = useCarSound();

  useEffect(() => {
    (async () => {
      await pubSubClient.onRedemption(await pubSubClient.registerUserListener(apiClient), (message) => {

        console.log(message.rewardId)

        switch (message.rewardId) {
          case 'ac64948e-1c7e-4851-a2c8-995e788f7f55':
            // ネコチャン
            updateCats(prev => [...prev, {id: uuid()}])
            meowSound();
            break;
          case 'f5f977c9-418a-4cee-8b0c-f429dab30a41':
            // 建物
            updateBuilds(prev => [...prev, {id: uuid()}])
            buildSound();
            break;
          case '2ed2aab6-2dcd-4ae1-a8b1-44a8a76f5b96':
            // 車
            updateCars(prev => [...prev, {id: uuid()}])
            carSound();
            break;
        }
      })
    })()
  }, [])

  return (
    <div className={styles.App}>
      <div className={styles.App__cat}>
        {cats.map((cat) => {
          return (<Cat key={cat.id} />)
        })}
      </div>
      <div className={styles.App__land}>
        {builds.map(build => {
          return (<Building key={build.id} />)
        })}
      </div>
      <div className={styles.App__car}>
        {cars.map(car => {
          return (<Car key={car.id} />)
        })}
      </div>
    </div>
  )
}

export default App
