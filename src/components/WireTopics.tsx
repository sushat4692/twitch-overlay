import React from 'react';
import classNames from 'classnames/bind';

import { TopicItem } from '../types/TopicItem';
import WireTopicItem from './WireTopicItem';

import styles from './WireTopics.module.css';
const cx = classNames.bind(styles);

type Props = {
    topics: TopicItem[];
    topicShow: boolean;
};

const WireTopics = ({ topics, topicShow }: Props) => {
    return (
        <div
            className={cx({
                WireTopics: true,
                'WireTopics--hide': !topicShow,
            })}>
            {topics.map((topic) => (
                <WireTopicItem key={topic.id} topic={topic} />
            ))}
        </div>
    );
};

export default WireTopics;
