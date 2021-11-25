import Car1 from '../assets/car1.png';
import Car2 from '../assets/car2.png';
import Car3 from '../assets/car3.png';

export type SpriteType = 'car1' | 'car2' | 'car3';

export const sprites = {
    car1: {
        img: Car1,
        frame: [100, 100, 100],
    },
    car2: {
        img: Car2,
        frame: [100, 100, 100],
    },
    car3: {
        img: Car3,
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
