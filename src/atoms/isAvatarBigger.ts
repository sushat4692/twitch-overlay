import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isAvatarBigger',
    default: false,
});

export const useIsAvatarBiggerState = () => {
    return useRecoilState(state);
};

export const useIsAvatarBiggerSetter = () => {
    const [, setState] = useIsAvatarBiggerState();
    return setState;
};

export const useIsAvatarBiggerValue = () => {
    return useRecoilValue(state);
};
