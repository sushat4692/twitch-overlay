export type CatSpriteType =
    | 'none'
    | 'fall'
    | 'sit'
    | 'sleep'
    | 'walk'
    | 'spin'
    | 'to_sit'
    | 'to_stand';

export const catSprites = {
    none: {
        img: null,
        duration: Infinity,
        loop: true,
        move: false,
        afterReflect: false,
        next: [],
        speed: Infinity,
    },
    fall: {
        img: 'cat-fall',
        duration: 400,
        loop: true,
        move: false,
        afterReflect: false,
        next: ['to_sit', 'walk', 'spin'],
        speed: 0.2,
    },
    sit: {
        img: 'cat-sit',
        duration: [1200, 2000],
        loop: true,
        move: false,
        afterReflect: false,
        next: ['to_stand'],
        speed: 0.15,
    },
    sleep: {
        img: 'cat-sleep',
        duration: [2400, 3000],
        loop: true,
        move: false,
        afterReflect: false,
        next: ['to_stand'],
        speed: 0.05,
    },
    walk: {
        img: 'cat-walk',
        duration: [640, 3200],
        loop: true,
        move: true,
        afterReflect: false,
        next: ['spin', 'to_sit'],
        frame: [100, 100, 100, 100, 100],
        speed: 0.14,
    },
    spin: {
        img: 'cat-spin',
        duration: 500,
        loop: false,
        move: false,
        afterReflect: true,
        next: ['walk'],
        speed: 0.15,
    },
    to_sit: {
        img: 'cat-to_sit',
        duration: 500,
        loop: false,
        move: false,
        afterReflect: false,
        next: ['sit', 'sleep'],
        speed: 0.2,
    },
    to_stand: {
        img: 'cat-to_stand',
        duration: 500,
        loop: false,
        move: false,
        afterReflect: false,
        next: ['walk', 'spin'],
        speed: 0.15,
    },
};

export const getCatSpriteKey = () => {
    return Object.keys(catSprites) as CatSpriteType[];
};

export const getCatCurrentSprite = (key: CatSpriteType) => {
    return catSprites[key];
};

export const getCatTargetSpriteDuration = (key: CatSpriteType) => {
    const sprite = getCatCurrentSprite(key);
    if (!sprite) {
        return;
    }

    if (!Array.isArray(sprite.duration)) {
        return sprite.duration;
    }

    const [min, max] = sprite.duration;
    return Math.floor(Math.random() * (max - min)) + min;
};

export const getCatRandomSpriteKey = (keis?: CatSpriteType[]) => {
    if (!keis) {
        keis = getCatSpriteKey();
    }
    const index = Math.floor(Math.random() * keis.length);
    return keis[index];
};
