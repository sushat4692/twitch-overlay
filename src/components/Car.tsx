import React, { useState, useEffect, useContext } from 'react'
import styles from './Car.module.css'

import {WindowWidth} from '../const/App'
import { getCurrentSprite, getRandomSpriteKey } from '../const/Car'

// Context
import {FrameCountContext} from '../context/FrameCount'

const CarWidth = 180

const Car = () => {
    const frameCount = useContext(FrameCountContext)

    const [spriteKey] = useState(getRandomSpriteKey())
    const [x, updateX] = useState<number>(0)
    const [rail, updateRail] = useState<number>(0)
    const [direction, updateDirection] = useState<number>(0)
    const [speed, updateSpeed] = useState<number>(0)
    const [image, updateImage] = useState<string>('')
    const [index, updateIndex] = useState<number>(0)
    const [startFrameTime, updateStartFrameTime] = useState<number>((new Date).getTime())

    useEffect(() => {
        const direction = Math.floor(Math.random() * 2)
        const speed = Math.random() + 0.5
        const x = Math.random() * (WindowWidth/2 - CarWidth) + (!direction ? WindowWidth/2 : 0)

        const sprite = getCurrentSprite(spriteKey)
        updateImage(sprite.img || '')

        updateX(x)
        updateDirection(direction)
        updateSpeed(speed)
        updateRail(Math.floor(Math.random() * 3))
    }, [])

    useEffect(() => {
        const sprite = getCurrentSprite(spriteKey)
        if (!sprite) {
            return
        }

        const length = sprite.frame.reduce((prev, current) => prev+current, 0)
        const currentTime = (new Date).getTime()
        const frameDuration = currentTime - startFrameTime

        if (frameDuration > length) {
            updateStartFrameTime(currentTime)
        }

        const index = (() => {
            let index = 0
            let sum = 0

            sprite.frame.some((frame, i) => {
                sum += frame
                index = i
                return frameDuration <= sum
            })

            return index
        })()
        updateIndex(index)

        updateX(prev => {
            const next = prev + speed * (direction ? 1 : -1)

            if (next < 0 - CarWidth) {
                return WindowWidth
            }

            if (next > WindowWidth + CarWidth) {
                return -CarWidth
            }

            return prev + speed * (direction ? 1 : -1)
        })
    }, [frameCount])

    return (<div className={styles.Car} style={{
        left: `${x}px`,
    }} data-build={rail} data-direction={direction}>
        <div className={styles.Car__inner}
            style={{
                backgroundImage: `url(${image})`,
                backgroundPositionX: `${-CarWidth * index}px`,
            }}
        ></div>
    </div>)
}

export default Car