import React, { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import tw from 'twin.macro';

// Context
import { FrameCountContext } from '../context/FrameCount';

// Components
const Wrapper = styled('div')([
    tw`absolute border-solid border-white bg-black flex items-center justify-center text-white leading-none`,
    {
        left: `0`,
        top: `0`,
        width: `calc(328px - var(--wire-border-width))`,
        height: `calc(112px - var(--wire-border-width))`,
        borderWidth: `0 var(--wire-border-width) var(--wire-border-width) 0`,
        borderRadius: `0 0 var(--wire-border-width) 0`,
        fontFamily: `'k12x8'`,
        fontWeight: `bold`,
        WebkitFontSmoothing: `none`,
    },
]);

const Text = styled('span')({ fontSize: '52px' });
const Sep = styled('span')<{ showColon: boolean }>(({ showColon }) => [
    { fontSize: '40px' },
    showColon ? null : { visibility: 'hidden' },
]);
const Small = styled('span')({ fontSize: '36px', marginLeft: '10px' });

const WireTime = () => {
    const frameCount = useContext(FrameCountContext);
    const [date, setDate] = useState(new Date());
    const [showColon, setShowColon] = useState(true);

    useEffect(() => {
        const date = new Date();

        setDate(date);
        setShowColon(Math.floor(date.getTime() / 1000) % 2 === 0);
    }, [frameCount]);

    return (
        <Wrapper>
            <div>
                <Text>{format(date, 'hh')}</Text>
                <Sep showColon={showColon}>:</Sep>
                <Text>{format(date, 'mm')}</Text>
                <Small>{format(date, 'aa')}</Small>
            </div>
        </Wrapper>
    );
};

export default WireTime;
