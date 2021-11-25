import React, { useEffect, useState } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';

import 'swiper/css';
import styles from './WireImages.module.css';

import { DefaultSlider } from '../const/WireImages';

type Props = {
    imageZoom: boolean;
};

const WireImages = ({ imageZoom }: Props) => {
    const [label, updateLabel] = useState<string[]>([
        'いつかのご飯・お菓子',
        "One day's Meal/Snack",
    ]);
    const [name, updateName] = useState<string[]>([
        '今日はお休み',
        'Closed Today',
    ]);
    const [sliders, updateSliders] = useState<string[]>(DefaultSlider);

    useEffect(() => {
        (async () => {
            const result = await axios
                .get(`/image.json?t=${Date.now().toString()}`)
                .catch((e) => {
                    console.error(e);
                });

            if (!result) {
                return;
            }

            const {
                label,
                message,
                images,
            }: { label: string[]; message: string[]; images: string[] } =
                result.data;
            if (
                !label ||
                !Array.isArray(label) ||
                !message ||
                !Array.isArray(message) ||
                !images ||
                !Array.isArray(images) ||
                images.length <= 0
            ) {
                return;
            }

            updateLabel(label);
            updateName(message);
            updateSliders(images);
        })();
    }, []);

    return (
        <div
            className={`${styles.WireImages} ${
                imageZoom ? styles['WireImages--zoom'] : ''
            }`}>
            <div className={styles.WireImages__slider}>
                {sliders.length > 1 ? (
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={1000}
                        spaceBetween={10}
                        loop={true}
                        className={styles.WireImages__slider__wrapper}>
                        {sliders.map((slider, index) => {
                            return (
                                <SwiperSlide
                                    key={index}
                                    className={styles.WireImages__slider__item}>
                                    <img
                                        src={slider}
                                        alt=""
                                        className={
                                            styles.WireImages__slider__image
                                        }
                                    />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <img
                        src={sliders[0]}
                        alt=""
                        className={styles.WireImages__slider__image}
                    />
                )}
            </div>

            <div className={styles.WireImages__label}>
                <span className={styles.WireImages__label__text}>
                    {label.join('\n')}
                </span>
            </div>

            <div className={styles.WireImages__name}>
                <span className={styles.WireImages__name__text}>
                    {name.join('\n')}
                </span>
            </div>
        </div>
    );
};

export default WireImages;
