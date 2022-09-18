export type DinoSpriteType = 'dino1';

export const dinoSprites = {
    dino1: {
        img: 'dino-image1',
    },
};

export const getDinoSpriteKey = () => {
    return Object.keys(dinoSprites) as DinoSpriteType[];
};

export const getDinoCurrentSprite = (key: DinoSpriteType) => {
    return dinoSprites[key];
};

export const getDinoRandomSpriteKey = (keis?: DinoSpriteType[]) => {
    if (!keis) {
        keis = getDinoSpriteKey();
    }
    const index = Math.floor(Math.random() * keis.length);
    return keis[index];
};
