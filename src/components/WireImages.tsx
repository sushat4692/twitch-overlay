import React, { useContext } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Context
import { ImageDescriptionContext } from '../context/ImageDescription';

// Css
import 'swiper/css';
import styles from './WireImages.module.css';

type Props = {
    imageZoom: boolean;
};

const WireImages = ({ imageZoom }: Props) => {
    const { label, message, images } = useContext(ImageDescriptionContext);

    return (
        <div
            className={`${styles.WireImages} ${
                imageZoom ? styles['WireImages--zoom'] : ''
            }`}>
            <div className={styles.WireImages__slider}>
                {images.length > 1 ? (
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={1000}
                        spaceBetween={10}
                        loop={true}
                        className={styles.WireImages__slider__wrapper}>
                        {images.map((slider, index) => {
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
                        src={images[0]}
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
                    {message.join('\n')}
                </span>
            </div>
        </div>
    );
};

export default WireImages;
