import React, { useRef, useEffect } from 'react';
import { Container, useApp } from '@inlet/react-pixi';

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
    const app = useApp();
    const inited = useRef(false);
    const loaded = useRef(false);

    const cats = useCatsValue();
    const cars = useCarsValue();
    const builds = useBuildsValue();
    const dinos = useDinosValue();

    useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;

        app.loader
            .add('cat-fall', './sprites/cat/image-fall.json')
            .add('cat-sit', './sprites/cat/image-sit.json')
            .add('cat-sleep', './sprites/cat/image-sleep.json')
            .add('cat-spin', './sprites/cat/image-spin.json')
            .add('cat-to_sit', './sprites/cat/image-to_sit.json')
            .add('cat-to_stand', './sprites/cat/image-to_stand.json')
            .add('cat-walk', './sprites/cat/image-walk.json')
            .add('building-image1', './sprites/building/image1.json')
            .add('building-image2', './sprites/building/image2.json')
            .add('building-image3', './sprites/building/image3.json')
            .add('car-image1', './sprites/car/image1.json')
            .add('car-image2', './sprites/car/image2.json')
            .add('car-image3', './sprites/car/image3.json')
            .add('dino-image1', './sprites/dino/image1.json')
            .load(() => {
                loaded.current = true;
            });
    }, []);

    return loaded.current ? (
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
