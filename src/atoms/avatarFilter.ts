import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { AvatarFilter } from '@/types';

const state = atom<AvatarFilter>({
    key: 'avatarFilter',
    default: AvatarFilter.Normal,
});

export const useAvatarFilterState = () => {
    return useRecoilState(state);
};

export const useAvatarFilterSetter = () => {
    const [, setState] = useAvatarFilterState();
    return setState;
};

export const useAvatarFilterValue = () => {
    return useRecoilValue(state);
};
