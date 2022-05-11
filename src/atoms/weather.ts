import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { WeatherType } from '../types/WeatherType';

const state = atom<WeatherType>({
    key: 'weather',
    default: WeatherType.Normal,
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
