import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isAvatarGlitch',
    default: false,
});

export const useIsAvatarGlitchState = () => {
    return useRecoilState(state);
};

export const useIsAvatarGlitchSetter = () => {
    const [, setState] = useIsAvatarGlitchState();
    return setState;
};

export const useIsAvatarGlitchValue = () => {
    return useRecoilValue(state);
};
