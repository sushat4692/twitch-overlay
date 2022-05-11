import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { AvatarFilter } from '../types/AvatarFilter';

const state = atom<AvatarFilter>({
    key: 'avatarFilter',
    default: AvatarFilter.Normal,
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
