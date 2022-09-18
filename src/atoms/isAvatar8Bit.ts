import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isAvatar8Bit',
    default: false,
});

export const useIsAvatar8BitState = () => {
    return useRecoilState(state);
};

export const useIsAvatar8BitSetter = () => {
    const [, setState] = useIsAvatar8BitState();
    return setState;
};

export const useIsAvatar8BitValue = () => {
    return useRecoilValue(state);
};
