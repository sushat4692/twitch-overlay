import React from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';

// Types
import { TopicItem } from '../types/TopicItem';

// Components
import WireTopicItem from './WireTopicItem';
const Wrapper = styled('div')<{ topicShow: boolean }>(({ topicShow }) => [
    tw`absolute z-10`,
    {
        top: `120px`,
        left: `20px`,
        width: `460px`,
        transition: `transform .3s`,
        willChange: `transform`,
    },
    topicShow
        ? null
        : {
              transform: `translateX(-480px)`,
          },
]);

type Props = {
    topics: TopicItem[];
    topicShow: boolean;
};
const WireTopics = ({ topics, topicShow }: Props) => {
    return (
        <Wrapper topicShow={topicShow}>
            {topics.map((topic) => (
                <WireTopicItem key={topic.id} topic={topic} />
            ))}
        </Wrapper>
    );
};

export default WireTopics;
