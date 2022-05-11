export type SpriteType = 'car1' | 'car2' | 'car3';

export const sprites = {
    car1: {
        img: 'car-image1',
    },
    car2: {
        img: 'car-image2',
    },
    car3: {
        img: 'car-image3',
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
