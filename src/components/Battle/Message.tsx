import React, { useMemo } from 'react';
import { Text } from '@inlet/react-pixi';
import { TextStyle } from 'pixi.js';

type Props = {
    label: string;
};
const BattleMessage: React.FC<Props> = ({ label }: Props) => {
    const textStyle = useMemo(
        () =>
            new TextStyle({
                fontSize: 96,
                fill: '#ffffff',
                fontWeight: 'bold',
                fontFamily: 'PixelMplus12',
            }),
        []
    );

    return (
        <Text
            text={label}
            anchor={[0.5, 0.5]}
            x={260}
            y={-250}
            style={textStyle}
        />
    );
};

export default BattleMessage;
