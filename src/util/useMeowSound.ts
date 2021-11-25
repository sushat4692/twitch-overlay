import { useCallback } from 'react'
import {audioCtx, playSound} from './playSound'

import Sound1 from '../assets/cat-meowing-1.mp3'
import Sound2 from '../assets/cat-meowing-2.mp3'
import Sound3 from '../assets/cat-meowing-3.mp3'
import Sound4 from '../assets/cat-meowing-4.mp3'
import Sound5 from '../assets/cat-meowing-5.mp3'

let sound1Buffer: AudioBuffer
let sound2Buffer: AudioBuffer
let sound3Buffer: AudioBuffer
let sound4Buffer: AudioBuffer
let sound5Buffer: AudioBuffer

export const prepareMeowSound = async () => {
    const setupSample = async (file: string) => {
        const response = await fetch(file)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
        return audioBuffer
    }

    sound1Buffer = await setupSample(Sound1)
    sound2Buffer = await setupSample(Sound2)
    sound3Buffer = await setupSample(Sound3)
    sound4Buffer = await setupSample(Sound4)
    sound5Buffer = await setupSample(Sound5)
}

export const useMeowSound = () => {
    return useCallback(() => {
        const buffer = (() => {
            const index = Math.floor(Math.random() * 5)

            switch (index) {
            case 0:
                return sound1Buffer
            case 1:
                return sound2Buffer
            case 2:
                return sound3Buffer
            case 3:
                return sound4Buffer
            case 4:
                return sound5Buffer
            default:
                return sound1Buffer
            }
        })()

        playSound(buffer, 0.1)
    }, [])
}