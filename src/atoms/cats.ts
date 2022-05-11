import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

const state = atom({
    key: 'cats',
    default: [
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
        { id: uuid() },
    ],
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
