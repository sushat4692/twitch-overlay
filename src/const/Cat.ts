import Fall from '../assets/cat/image-fall.png';
import Sit from '../assets/cat/image-sit.png';
import Sleep from '../assets/cat/image-sleep.png';
import Walk from '../assets/cat/image-walk.png';
import Spin from '../assets/cat/image-spin.png';
import ToSit from '../assets/cat/image-to_sit.png';
import ToStand from '../assets/cat/image-to_stand.png';

export type SpriteType =
    | 'none'
    | 'fall'
    | 'sit'
    | 'sleep'
    | 'walk'
    | 'spin'
    | 'to_sit'
    | 'to_stand';

export const sprites = {
    none: {
        img: null,
        duration: Infinity,
        loop: true,
        move: false,
        afterReflect: false,
        next: [],
        frame: [Infinity],
    },
    fall: {
        img: Fall,
        duration: 400,
        loop: true,
        move: false,
        afterReflect: false,
        next: ['to_sit', 'walk', 'spin'],
        frame: [50, 50, 50, 50, 50, 50, 50, 50],
    },
    sit: {
        img: Sit,
        duration: [1200, 2000],
        loop: true,
        move: false,
        afterReflect: false,
        next: ['to_stand'],
        frame: [
            100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
            100, 100, 100,
        ],
    },
    sleep: {
        img: Sleep,
        duration: [2400, 3000],
        loop: true,
        move: false,
        afterReflect: false,
        next: ['to_stand'],
        frame: [
            200, 200, 600, 600, 200, 100, 100, 100, 100, 100, 100, 100, 100,
            300,
        ],
    },
    walk: {
        img: Walk,
        duration: [640, 3200],
        loop: true,
        move: true,
        afterReflect: false,
        next: ['spin', 'to_sit'],
        frame: [100, 100, 100, 100, 100],
    },
    spin: {
        img: Spin,
        duration: 500,
        loop: false,
        move: false,
        afterReflect: true,
        next: ['walk'],
        frame: [100, 100, 100, 100, 100],
    },
    to_sit: {
        img: ToSit,
        duration: 500,
        loop: false,
        move: false,
        afterReflect: false,
        next: ['sit', 'sleep'],
        frame: [100, 100, 100, 100, 100],
    },
    to_stand: {
        img: ToStand,
        duration: 500,
        loop: false,
        move: false,
        afterReflect: false,
        next: ['walk', 'spin'],
        frame: [100, 100, 100, 100, 100],
    },
};

export const getSpriteKey = () => {
    return Object.keys(sprites) as SpriteType[];
};

export const getCurrentSprite = (key: SpriteType) => {
    return sprites[key];
};

export const getTargetSpriteDuration = (key: SpriteType) => {
    const sprite = getCurrentSprite(key);
    if (!sprite) {
        return;
    }

    if (!Array.isArray(sprite.duration)) {
        return sprite.duration;
    }

    const [min, max] = sprite.duration;
    return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomSpriteKey = (keis?: SpriteType[]) => {
    if (!keis) {
        keis = getSpriteKey();
    }
    const index = Math.floor(Math.random() * keis.length);
    return keis[index];
};
