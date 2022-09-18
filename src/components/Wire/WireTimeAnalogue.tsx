import React, { useEffect, useState, useContext } from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';

// Context
import { FrameCountContext } from '@/context';

// Components
const Wrap = styled('div')([
    tw`absolute bg-black flex items-center justify-center text-white leading-none border-solid border-white`,
    {
        '--wire-time-size': `146px`,
        borderWidth: `var(--wire-border-width)`,
        left: `-31px`,
        top: `-31px`,
        width: `calc(var(--wire-time-size) - var(--wire-border-width))`,
        height: `calc(var(--wire-time-size) - var(--wire-border-width))`,
        borderRadius: `0 0 50% 0`,
    },
]);
const Hour = styled('span')([
    tw`absolute bg-white`,
    {
        width: `var(--wire-border-width)`,
        height: `calc(var(--wire-time-size) * 0.1875)`,
        bottom: `50%`,
        left: `0`,
        right: `0`,
        margin: `0 auto`,
        transformOrigin: `center bottom`,
    },
]);
const Minute = styled('span')([
    tw`absolute bg-white`,
    {
        width: `calc(var(--wire-border-width) / 2)`,
        height: `calc(var(--wire-time-size) * 0.3125)`,
        bottom: `50%`,
        left: `0`,
        right: `0`,
        margin: `0 auto`,
        transformOrigin: `center bottom`,
    },
]);
const Second = styled('span')([
    tw`absolute bg-white`,
    {
        width: `1px`,
        height: `calc(var(--wire-time-size) * 0.375)`,
        bottom: `50%`,
        left: `0`,
        right: `0`,
        margin: `0 auto`,
        transformOrigin: `center bottom`,
    },
]);

export const WireTimeAnalogue = () => {
    const frameCount = useContext(FrameCountContext);
    const [hourDeg, setHourDeg] = useState(0);
    const [minuteDeg, setMinuteDeg] = useState(0);
    const [secondDeg, setSecondDeg] = useState(0);

    useEffect(() => {
        const date = new Date();

        setHourDeg(
            (date.getHours() / 12) * 360 + (date.getMinutes() / 60 / 12) * 360
        );
        setMinuteDeg((date.getMinutes() / 60) * 360);
        setSecondDeg((date.getSeconds() / 60) * 360);
    }, [frameCount]);

    return (
        <Wrap>
            <Hour style={{ transform: `rotate(${hourDeg}deg)` }}></Hour>
            <Minute style={{ transform: `rotate(${minuteDeg}deg)` }}></Minute>
            <Second style={{ transform: `rotate(${secondDeg}deg)` }}></Second>
        </Wrap>
    );
};
