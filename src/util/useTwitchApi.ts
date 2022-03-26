import { useEffect, useRef } from 'react';

import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';

// Const
import { CHANNEL_NAME, CLIENT_ID, CLIENT_TOKEN } from '../const/App';

const apiClient = new ApiClient({
    authProvider: new StaticAuthProvider(CLIENT_ID, CLIENT_TOKEN),
});

export const useGetNewFollower = (callback: (username: string) => void) => {
    const latestFollower = useRef<string[]>([]);
    const timer = useRef<ReturnType<typeof setInterval>>();

    useEffect(() => {
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
            if (timer.current) {
                clearInterval(timer.current);
            }
        };
    }, []);
};
