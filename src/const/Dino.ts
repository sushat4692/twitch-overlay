import Car1 from '../assets/dino/image1.png';

export type SpriteType = 'dino1';

export const sprites = {
    dino1: {
        img: Car1,
        frame: [200, 200, 200, 200],
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
