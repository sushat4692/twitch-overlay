export type CarSpriteType = 'car1' | 'car2' | 'car3';

export const carSprites = {
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

export const getCarSpriteKey = () => {
    return Object.keys(carSprites) as CarSpriteType[];
};

export const getCarCurrentSprite = (key: CarSpriteType) => {
    return carSprites[key];
};

export const getCarRandomSpriteKey = (keis?: CarSpriteType[]) => {
    if (!keis) {
        keis = getCarSpriteKey();
    }
    const index = Math.floor(Math.random() * keis.length);
    return keis[index];
};
