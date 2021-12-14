import Building1 from '../assets/building/image1.png';
import Building2 from '../assets/building/image2.png';
import Building3 from '../assets/building/image3.png';

export type SpriteType = 'building1' | 'building2' | 'building3';

export const sprites = {
    building1: {
        img: Building1,
        frame: [100, 100, 100],
    },
    building2: {
        img: Building2,
        frame: [100, 100, 100],
    },
    building3: {
        img: Building3,
        frame: [100, 100, 100],
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
