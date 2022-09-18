import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

const state = atom({
    key: 'builds',
    default: [
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ],
});

export const useBuildsState = () => {
    return useRecoilState(state);
};

export const useBuildsSetter = () => {
    const [, setState] = useBuildsState();
    return setState;
};

export const useBuildsValue = () => {
    return useRecoilValue(state);
};
