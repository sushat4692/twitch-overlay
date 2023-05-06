import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Container, Graphics as ReactGraphics } from '@pixi/react';
import { Assets, Graphics } from 'pixi.js';

// Const
import { WindowHeight } from '@/const';

// Atoms
import {
    useCatsValue,
    useCarsValue,
    useBuildsValue,
    useDinosValue,
} from '@/atoms';

// Components
import {
    Cat,
    Building,
    Car,
    Dino,
    Avatar,
    Weather,
    Battle,
} from '@/components';

export const Animate: React.FC = () => {
    const inited = useRef(false);
    const [loaded, setLoaded] = useState(false);

    const cats = useCatsValue();
    const cars = useCarsValue();
    const builds = useBuildsValue();
    const dinos = useDinosValue();

    useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;

        Assets.add('cat-fall', './sprites/cat/image-fall.json');
        Assets.add('cat-sit', './sprites/cat/image-sit.json');
        Assets.add('cat-sleep', './sprites/cat/image-sleep.json');
        Assets.add('cat-spin', './sprites/cat/image-spin.json');
        Assets.add('cat-to_sit', './sprites/cat/image-to_sit.json');
        Assets.add('cat-to_stand', './sprites/cat/image-to_stand.json');
        Assets.add('cat-walk', './sprites/cat/image-walk.json');
        Assets.add('building-image1', './sprites/building/image1.json');
        Assets.add('building-image2', './sprites/building/image2.json');
        Assets.add('building-image3', './sprites/building/image3.json');
        Assets.add('car-image1', './sprites/car/image1.json');
        Assets.add('car-image2', './sprites/car/image2.json');
        Assets.add('car-image3', './sprites/car/image3.json');
        Assets.add('dino-image1', './sprites/dino/image1.json');

        Assets.load([
            'cat-fall',
            'cat-sit',
            'cat-sleep',
            'cat-spin',
            'cat-to_sit',
            'cat-to_stand',
            'cat-walk',
            'building-image1',
            'building-image2',
            'building-image3',
            'car-image1',
            'car-image2',
            'car-image3',
            'dino-image1',
        ]).then(() => {
            setLoaded(true);
        });
    }, []);

    return loaded ? (
        <>
            <Container x={64} y={42}>
                {cats.map((cat) => {
                    return <Cat key={cat.id} />;
                })}
            </Container>

            <Container x={0} y={WindowHeight} sortableChildren>
                {builds.map((build) => {
                    return <Building key={build.id} />;
                })}

                {cars.map((car) => {
                    return <Car key={car.id} />;
                })}

                {dinos.map((dino) => {
                    return <Dino key={dino.id} />;
                })}
            </Container>

            <Avatar />
            <Battle />
            <Weather />
        </>
    ) : null;
};
