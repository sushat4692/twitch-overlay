import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

const state = atom({
    key: 'cars',
    default: [
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ],
});

export const useCarsState = () => {
    return useRecoilState(state);
};

export const useCarsSetter = () => {
    const [, setState] = useCarsState();
    return setState;
};

export const useCarsValue = () => {
    return useRecoilValue(state);
};
