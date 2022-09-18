import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { WeatherType } from '@/types';

const state = atom<WeatherType>({
    key: 'weather',
    default: WeatherType.Normal,
});

export const useWeatherState = () => {
    return useRecoilState(state);
};

export const useWeatherSetter = () => {
    const [, setState] = useWeatherState();
    return setState;
};

export const useWeatherValue = () => {
    return useRecoilValue(state);
};
