import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom<{ id: string }[]>({
    key: 'dinos',
    default: [],
});

export const useState = () => {
    return useRecoilState(state);
};

export const useSetter = () => {
    const [, setState] = useState();
    return setState;
};

export const useValue = () => {
    return useRecoilValue(state);
};
