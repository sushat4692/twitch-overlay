import React, { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

// Utils
import {
    useGetNewFollower,
    chatClient,
    playFollow,
    playSub,
    playRaid,
} from '@/util';

export const Alert: React.FC = () => {
    const isInited = useRef(false);

    useGetNewFollower((username) => {
        toast(`Thank you for following, ${username}!`);
        setTimeout(() => {
            playFollow();
        }, 500);
    });

    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;

        chatClient.onMessage((_, __, ___, message) => {
            console.log(message);

            if (message.isCheer) {
                toast(
                    `Thank you for cheering ${message.bits} bits, ${message.userInfo.displayName}!`
                );
                setTimeout(() => {
                    playSub();
                }, 500);
            }
        });

        chatClient.onRaid((_, __, raidInfo) => {
            toast(
                `Thank you for raiding, ${raidInfo.displayName} with ${raidInfo.viewerCount} raiders!`
            );
            setTimeout(() => {
                playRaid();
            }, 500);
        });

        chatClient.onSub((_, __, subInfo) => {
            toast(
                `Thank you for ${subInfo.months} months subscribing, ${subInfo.displayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });

        chatClient.onSubGift((_, __, subGiftInfo) => {
            toast(
                `Thank you for gift sub, ${subGiftInfo.gifterDisplayName} to ${subGiftInfo.displayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });

        chatClient.onSubExtend((_, __, subExtendInfo) => {
            toast(
                `Thank you for ${subExtendInfo.months} months subscribing, ${subExtendInfo.displayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });

        chatClient.onStandardPayForward((_, __, payForwardInfo) => {
            toast(
                `Thank you for gift sub, ${payForwardInfo.displayName} to ${payForwardInfo.recipientDisplayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });

        chatClient.onCommunityPayForward((_, __, payForwardInfo) => {
            toast(
                `Thank you for gift sub, ${payForwardInfo.originalGifterDisplayName} to ${payForwardInfo.displayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });

        chatClient.onGiftPaidUpgrade((_, __, giftUpgradeInfo) => {
            toast(
                `Thank you for upgrading gift sub, ${giftUpgradeInfo.displayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });
        chatClient.onPrimeCommunityGift((_, __, primeGiftInfo) => {
            toast(
                `Thank you for gift sub, ${primeGiftInfo.gifterDisplayName} to ${primeGiftInfo.name}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });
        chatClient.onPrimePaidUpgrade((_, __, paidUpgradeInfo) => {
            toast(
                `Thank you for upgrading prime sub, ${paidUpgradeInfo.displayName}!`
            );
            setTimeout(() => {
                playSub();
            }, 500);
        });

        return () => {
            isInited.current = false;
        };
    }, []);

    return (
        <ToastContainer
            position="top-center"
            // autoClose={true}
            closeButton={false}
            hideProgressBar={true}
            closeOnClick={false}
            draggable={false}
            pauseOnFocusLoss={false}
        />
    );
};
