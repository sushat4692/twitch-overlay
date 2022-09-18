import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isAvatarFocus',
    default: false,
});

export const useIsAvatarFocusState = () => {
    return useRecoilState(state);
};

export const useIsAvatarFocusSetter = () => {
    const [, setState] = useIsAvatarFocusState();
    return setState;
};

export const useIsAvatarFocusValue = () => {
    return useRecoilValue(state);
};
