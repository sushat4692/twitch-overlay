import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isAvatarGunya',
    default: false,
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
