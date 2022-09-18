import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'isImageZoom',
    default: false,
});

export const useIsImageZoomState = () => {
    return useRecoilState(state);
};

export const useIsImageZoomSetter = () => {
    const [, setState] = useIsImageZoomState();
    return setState;
};

export const useIsImageZoomValue = () => {
    return useRecoilValue(state);
};
