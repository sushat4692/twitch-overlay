import React, { useState, useEffect, useContext } from 'react'
import styles from './Building.module.css'

import {WindowWidth} from '../const/App'
import { getCurrentSprite, getRandomSpriteKey } from '../const/Building'

// Context
import {FrameCountContext} from '../context/FrameCount'

const Building = () => {
    const frameCount = useContext(FrameCountContext)

    const [spriteKey] = useState(getRandomSpriteKey())
    const [x, updateX] = useState<number>(0)
    const [rail, updateRail] = useState<number>(0)
    const [image, updateImage] = useState<string>('')
    const [index, updateIndex] = useState<number>(0)
    const [startFrameTime, updateStartFrameTime] = useState<number>((new Date).getTime())

    useEffect(() => {
        const x = Math.floor(Math.random() * WindowWidth)

        const sprite = getCurrentSprite(spriteKey)
        updateImage(sprite.img || '')

        updateX(x)
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
    }, [frameCount])

    return (<div className={styles.Building} data-build={rail} style={{
        left: `${x}px`,
        backgroundImage: `url(${image})`,
        backgroundPositionX: `${-160 * index}px`,
    }}></div>)
}

export default Building