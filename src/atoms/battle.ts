import { atom, useRecoilState, useRecoilValue } from 'recoil';

const state = atom({
    key: 'battle',
    default: {
        is_battle: false,
        is_process: false,
        anime_action: '',
        calc_action: '',
        your_max_hp: 0,
        your_current_hp: 0,
        enemy: '',
        enemy_japanese: '',
        enemy_english: '',
        enemy_max_hp: 0,
        enemy_current_hp: 0,
    },
});

export const useBattleState = () => {
    return useRecoilState(state);
};

export const useBattleSetter = () => {
    const [, setState] = useBattleState();
    return setState;
};

export const useBattleValue = () => {
    return useRecoilValue(state);
};
