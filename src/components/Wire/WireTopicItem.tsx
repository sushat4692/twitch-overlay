import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import tw from 'twin.macro';

// Types
import { TopicItem } from '@/types';

// Keyframes
const itemShow = keyframes({
    '0%': {
        transform: `translateX(-480px)`,
    },
    '100%': {
        transform: `translateX(0px)`,
    },
});
const itemHide = keyframes({
    '0%': {
        transform: `translateX(0)`,
    },
    '100%': {
        maxHeight: 0,
        transform: `translateX(-480px)`,
        paddingBottom: 0,
    },
});

// Components
const Item = styled('div')<{ hiding: boolean }>(({ hiding }) => [
    tw`relative`,
    {
        fontSize: `32px`,
        fontWeight: `700`,
        fontFamily: `'Noto Sans JP', sans-serif`,
        transform: `translateX(0)`,
        willChange: `transform`,
        paddingBottom: `10px`,
        animation: `${itemShow} 0.4s ease-in-out 1`,
    },
    hiding
        ? {
              transform: `translateX(-480px)`,
              animation: `${itemHide} 0.4s ease-in-out 1`,
          }
        : null,
]);
const ItemBack = styled('span')({ WebkitTextStroke: '8px #fff' });
const ItemFront = styled('span')(tw`absolute inset-0`);

type Props = {
    topic: TopicItem;
};

export const WireTopicItem = ({ topic }: Props) => {
    const el = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (el.current) {
            el.current.style.maxHeight = `${el.current.clientHeight}px`;
        }
    }, []);

    return (
        <Item ref={el} hiding={topic.hiding}>
            <ItemBack>{topic.content}</ItemBack>
            <ItemFront>{topic.content}</ItemFront>
        </Item>
    );
};
