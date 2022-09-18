export type BuildingSpriteType = 'building1' | 'building2' | 'building3';

export const buildingSprites = {
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

export const getBuildingSpriteKey = () => {
    return Object.keys(buildingSprites) as BuildingSpriteType[];
};

export const getBuildingCurrentSprite = (key: BuildingSpriteType) => {
    return buildingSprites[key];
};

export const getBuildingRandomSpriteKey = (keis?: BuildingSpriteType[]) => {
    if (!keis) {
        keis = getBuildingSpriteKey();
    }
    const index = Math.floor(Math.random() * keis.length);
    return keis[index];
};
