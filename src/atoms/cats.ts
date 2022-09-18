import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

const state = atom({
    key: 'cats',
    default: [
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ],
});

export const useCatsState = () => {
    return useRecoilState(state);
};

export const useCatsSetter = () => {
    const [, setState] = useCatsState();
    return setState;
};

export const useCatsValue = () => {
    return useRecoilValue(state);
};
