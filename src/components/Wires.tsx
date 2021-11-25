import React from 'react';

import WireDesktop from './WireDesktop';
import WireTime from './WireTime';
import WireTopics from './WireTopics';
import WireImages from './WireImages';

type Props = {
    imageZoom: boolean;
    topics: { id: string; content: string }[];
    topicShow: boolean;
};

const Wires = ({ imageZoom, topics, topicShow }: Props) => {
    return (
        <>
            <WireDesktop />
            <WireTime />
            <WireTopics topics={topics} topicShow={topicShow} />
            <WireImages imageZoom={imageZoom} />
        </>
    );
};

export default Wires;
