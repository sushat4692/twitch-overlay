import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom<{ id: string }[]>({
    key: 'dinos',
    default: [],
});

export const useDinosState = () => {
    return useRecoilState(state);
};

export const useDinosSetter = () => {
    const [, setState] = useDinosState();
    return setState;
};

export const useDinosValue = () => {
    return useRecoilValue(state);
};
