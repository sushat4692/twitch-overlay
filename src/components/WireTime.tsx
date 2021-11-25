import React, { useEffect, useState, useContext } from 'react'
import {format} from 'date-fns'

import styles from './WireTime.module.css'

// Context
import {FrameCountContext} from '../context/FrameCount'

const WireTime = () => {
    const frameCount = useContext(FrameCountContext)
    const [date, setDate] = useState(new Date())
    const [showColon, setShowColon] = useState(true)

    useEffect(() => {
        const date = new Date()

        setDate(date)
        setShowColon(Math.floor(date.getTime() / 1000) % 2 === 0)
    }, [frameCount])

    return (<div className={styles.WireTime}>
        <div>
            <span className={styles.WireTime__text}>{ format(date, 'hh') }</span>
            <span className={`${styles.WireTime__sep} ${showColon ? '' : styles.WireTime__sep__hide}`}>:</span>
            <span className={styles.WireTime__text}>{ format(date, 'mm') }</span>
            <span className={styles.WireTime__small}>{ format(date, 'aa') }</span>
        </div>
    </div>)
}

export default WireTime