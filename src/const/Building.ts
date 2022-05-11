export type SpriteType = 'building1' | 'building2' | 'building3';

export const sprites = {
    building1: {
        img: 'building-image1',
    },
    building2: {
        img: 'building-image2',
    },
    building3: {
        img: 'building-image3',
    },
};

export const getSpriteKey = () => {
    return Object.keys(sprites) as SpriteType[];
};

export const getCurrentSprite = (key: SpriteType) => {
    return sprites[key];
};

export const getRandomSpriteKey = (keis?: SpriteType[]) => {
    if (!keis) {
        keis = getSpriteKey();
    }
    const index = Math.floor(Math.random() * keis.length);
    return keis[index];
};
