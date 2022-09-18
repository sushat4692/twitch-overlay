import { useEffect, useRef } from 'react';

import { ApiClient } from '@twurple/api';

// Const
import { CHANNEL_NAME } from '@/const/App';
import { authProvider } from '@/const/AuthProvider';

const apiClient = new ApiClient({
    authProvider,
});

export const useGetNewFollower = (callback: (username: string) => void) => {
    const isInited = useRef(false);
    const latestFollower = useRef<string[]>([]);
    const timer = useRef<ReturnType<typeof setInterval>>();

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        (async () => {
            const currentUser = await apiClient.users.getUserByName(
                CHANNEL_NAME
            );

            if (!currentUser) {
                return;
            }

            timer.current = setInterval(async () => {
                const followers = await apiClient.users.getFollows({
                    followedUser: currentUser.id,
                    limit: 1,
                });

                if (followers.total > 0) {
                    const follower = followers.data[0];

                    if (
                        !latestFollower.current.some(
                            (userId) => userId === follower.userId
                        )
                    ) {
                        if (latestFollower.current.length > 0) {
                            callback(follower.userDisplayName);
                        }
                        latestFollower.current.push(follower.userId);
                    }
                }
            }, 5000);
        })();

        return () => {
            isInited.current = false;
            if (timer.current) {
                clearInterval(timer.current);
            }
        };
    }, []);
};
