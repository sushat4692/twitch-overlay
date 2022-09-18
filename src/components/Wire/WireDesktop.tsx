import styled from '@emotion/styled';
import tw from 'twin.macro';

export const WireDesktop = styled('div')([
    tw`absolute border-solid border-white overflow-hidden`,
    {
        left: `calc(var(--desktop-position-left) - var(--wire-border-width))`,
        top: `calc(var(--desktop-position-top) - var(--wire-border-width))`,
        width: `calc(var(--desktop-width) + var(--wire-border-width) * 2)`,
        height: `calc(var(--desktop-height) + var(--wire-border-width) * 2)`,
        borderWidth: `var(--wire-border-width)`,
        borderRadius: `var(--wire-border-width)`,
        zIndex: -1,
    },
]);
