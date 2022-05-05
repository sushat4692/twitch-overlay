import { useState, useEffect, useRef } from 'react';

export const useAnimationFrameCount = () => {
    const isInited = useRef(false);
    const [frameCount, setFrameCount] = useState(0);

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        const loop = () => {
            setFrameCount((prevFrameCount) => {
                const nextCount = prevFrameCount + 1;
                if (nextCount > Number.MAX_SAFE_INTEGER - 1000) {
                    return 0;
                }
                return nextCount;
            });

            if (isInited.current) {
                requestAnimationFrame(loop);
            }
        };

        requestAnimationFrame(loop);

        return () => {
            isInited.current = false;
        };
    }, []);

    return frameCount;
};
