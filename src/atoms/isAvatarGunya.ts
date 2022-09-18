import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isAvatarGunya',
    default: false,
});

export const useIsAvatarGunyaState = () => {
    return useRecoilState(state);
};

export const useIsAvatarGunyaSetter = () => {
    const [, setState] = useIsAvatarGunyaState();
    return setState;
};

export const useIsAvatarGunyaValue = () => {
    return useRecoilValue(state);
};
