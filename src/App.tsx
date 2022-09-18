import React from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil';

// Components
import { Stage as PixiStage } from '@inlet/react-pixi';
import {
    Animate,
    Alert,
    WireDesktop,
    //WireTimeAnalogue,
    WireTopics,
    WireImages,
} from '@/components';

// Context
import { FrameCountContext } from '@/context';

// Util
import {
    useAnimationFrameCount,
    useTwitchPubSubEvent,
    useTwitchChatEvent,
} from '@/util';

// Const
import { WindowWidth, WindowHeight } from '@/const';

// Component
const Wrapper = styled('div')([
    tw`relative overflow-hidden`,
    {
        width: 'var(--screen-width)',
        height: 'var(--screen-height)',
        '&::before': [
            tw`block bg-black relative`,
            {
                content: `''`,
                zIndex: -1,
                width: 'var(--screen-width)',
                height: 'var(--screen-height)',
                clipPath: `polygon(
                    0 0,
                    0 var(--screen-height),
                    calc(var(--desktop-position-left) - var(--wire-border-width) / 2) var(--screen-height),
                    calc(var(--desktop-position-left) - var(--wire-border-width) / 2) calc(var(--desktop-position-top) - var(--wire-border-width) / 2),
                    calc(var(--desktop-position-left) + var(--desktop-width) + var(--wire-border-width) / 2) calc(var(--desktop-position-top) - var(--wire-border-width) / 2),
                    calc(var(--desktop-position-left) + var(--desktop-width) + var(--wire-border-width) / 2) calc(var(--desktop-position-top) + var(--desktop-height) + var(--wire-border-width) / 2),
                    calc(var(--desktop-position-left) - var(--wire-border-width) / 2) calc(var(--desktop-position-top) + var(--desktop-height) + var(--wire-border-width) / 2),
                    calc(var(--desktop-position-left) - var(--wire-border-width) / 2) var(--screen-height),
                    var(--screen-width) var(--screen-height),
                    var(--screen-width) 0
                )`,
            },
        ],
    },
]);

// Bridge
type ContextBridgeProps = {
    Context: React.Context<number>;
    render: (children: React.ReactNode) => React.ReactNode;
};
const ContextBridge: React.FC<ContextBridgeProps> = ({
    children,
    Context,
    render,
}) => {
    const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

    return (
        <Context.Consumer>
            {(value) =>
                render(
                    <RecoilBridge>
                        <Context.Provider value={value}>
                            {children}
                        </Context.Provider>
                    </RecoilBridge>
                )
            }
        </Context.Consumer>
    );
};

type StageProps = React.ComponentProps<typeof PixiStage>;
const Stage: React.FC<StageProps> = ({ children, ...props }) => {
    return (
        <ContextBridge
            Context={FrameCountContext}
            render={(children) => <PixiStage {...props}>{children}</PixiStage>}>
            {children}
        </ContextBridge>
    );
};
const StyledStage = styled(Stage)([tw`absolute inset-0 z-50`]);

export const App: React.FC = () => {
    const frameCount = useAnimationFrameCount();
    useTwitchPubSubEvent();
    const { topics, topicShow } = useTwitchChatEvent();

    return (
        <FrameCountContext.Provider value={frameCount}>
            <Wrapper>
                <WireDesktop />
                {/* <WireTime /> */}
                <WireTopics topics={topics} topicShow={topicShow} />

                <StyledStage
                    width={WindowWidth}
                    height={WindowHeight}
                    options={{ backgroundAlpha: 0 }}>
                    <Animate />
                </StyledStage>

                <WireImages />

                <Alert />
            </Wrapper>
        </FrameCountContext.Provider>
    );
};
