import React from 'react';
import classNames from 'classnames/bind';

import styles from './WireTopics.module.css';
const cx = classNames.bind(styles);

type Props = {
    topics: { id: string; content: string }[];
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
                <div key={topic.id} className={styles.WireTopics__item}>
                    <span className={styles.WireTopics__item__back}>
                        {topic.content}
                    </span>
                    <span className={styles.WireTopics__item__front}>
                        {topic.content}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default WireTopics;
