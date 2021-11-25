import { useState, useEffect } from 'react';

export const useAnimationFrameCount = () => {
    const [frameCount, setFrameCount] = useState(0);

    useEffect(() => {
        const loop = () => {
            setFrameCount((prevFrameCount) => {
                const nextCount = prevFrameCount + 1;
                if (nextCount > Number.MAX_SAFE_INTEGER - 1000) {
                    return 0;
                }
                return nextCount;
            });
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }, []);

    return frameCount;
};
