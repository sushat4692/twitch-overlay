import React, { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';

import { TopicItem } from '../types/TopicItem';

import styles from './WireTopics.module.css';
const cx = classNames.bind(styles);

type Props = {
    topic: TopicItem;
};

const WireTopicItem = ({ topic }: Props) => {
    const el = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (el.current) {
            el.current.style.maxHeight = `${el.current.clientHeight}px`;
        }
    }, []);

    return (
        <div
            ref={el}
            className={cx({
                WireTopics__item: true,
                'WireTopics__item--hide': topic.hiding,
            })}>
            <span className={styles.WireTopics__item__back}>
                {topic.content}
            </span>
            <span className={styles.WireTopics__item__front}>
                {topic.content}
            </span>
        </div>
    );
};

export default WireTopicItem;
