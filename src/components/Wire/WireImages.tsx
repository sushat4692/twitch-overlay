import React, { useContext } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from '@emotion/styled';
import tw from 'twin.macro';

// Context
import { ImageDescriptionContext } from '@/context';

// Atoms
import { useIsImageZoomValue } from '@/atoms';

// Components
const Wrapper = styled('div')<{ isImageZoom: boolean }>(({ isImageZoom }) => [
    tw`absolute inset-0 z-50 bg-black bg-opacity-0 pointer-events-none`,
    {
        '--wire-image-slider-width': '400px',
        '--wire-image-slider-height': '300px',
        '--wire-image-slider-zoom-width': '1200px',
        '--wire-image-slider-zoom-height': '900px',
        '--wire-image-slider-content-width': '1600px',
        '--wire-image-slider-content-height': '1200px',
        '--wire-image-label-width': '372px',
        '--wire-image-label-height': '100px',
        '--wire-image-name-width': '436px',
        '--wire-image-name-height': '108px',
        willChange: 'background-color',
        transition: 'background-color .6s',
    },
    isImageZoom ? tw`bg-opacity-80` : null,
]);

const SliderOuter = styled('div')<{ isImageZoom: boolean }>(
    ({ isImageZoom }) => {
        return [
            tw`absolute border-solid border-white bg-black`,
            {
                left: `calc(var(--screen-width) - var(--wire-image-slider-width) - var(--wire-border-width))`,
                top: `calc(96px - var(--wire-border-width))`,
                width: `calc(var(--wire-image-slider-width) + var(--wire-border-width) * 2)`,
                height: `calc(var(--wire-image-slider-height) + var(--wire-border-width) * 2)`,
                borderWidth: `var(--wire-border-width)`,
                borderRadius: `var(--wire-border-width)`,
                willChange: `left, width, height`,
                transition: `left .6s, width .6s, height .6s`,
            },
            isImageZoom
                ? {
                      left: `calc((var(--screen-width) - var(--wire-image-slider-zoom-width)) / 2 - var(--wire-border-width))`,
                      width: `calc(var(--wire-image-slider-zoom-width) + var(--wire-border-width) * 2)`,
                      height: `calc(var(--wire-image-slider-zoom-height) + var(--wire-border-width) * 2)`,
                  }
                : null,
        ];
    }
);

const SliderImage = styled('img')([
    tw`w-full h-full object-cover`,
    {
        willChange: `width, height`,
        transition: `width .6s, height .6s`,
    },
]);

const ImageLabel = styled('div')<{ isImageZoom: boolean }>(
    ({ isImageZoom }) => [
        tw`absolute z-10 border-solid border-white flex items-center justify-center bg-black`,
        {
            left: `calc(var(--screen-width) - var(--wire-image-label-width) - var(--wire-border-width))`,
            top: `0`,
            width: `calc(var(--wire-image-label-width) + var(--wire-border-width) * 2)`,
            height: `calc(var(--wire-image-label-height) + var(--wire-border-width))`,
            borderWidth: `0 var(--wire-border-width) var(--wire-border-width) var(--wire-border-width)`,
            borderRadius: `0 0 var(--wire-border-width) var(--wire-border-width)`,
            willChange: `left`,
            transition: `left .6s`,
        },
        isImageZoom
            ? {
                  left: `calc((var(--screen-width) - var(--wire-image-slider-zoom-width)) / 2 - var(--wire-border-width) - 60px)`,
              }
            : null,
    ]
);

const ImageLabelText = styled('span')([
    tw`block z-10 text-white text-center whitespace-pre-wrap`,
    {
        lineHeight: `1.2`,
        fontFamily: `'PixelMplus12'`,
        fontSize: `28px`,
        fontWeight: `bold`,
        WebkitFontSmoothing: `none`,
    },
]);

const ImageName = styled('div')<{ isImageZoom: boolean }>(({ isImageZoom }) => [
    tw`absolute z-10 border-solid border-white flex items-center justify-center bg-black`,
    {
        left: `calc(var(--screen-width) - var(--wire-image-name-width) - var(--wire-border-width))`,
        top: `calc(418px - var(--wire-border-width))`,
        width: `calc(var(--wire-image-name-width) + var(--wire-border-width) * 2)`,
        height: `calc(var(--wire-image-name-height) + var(--wire-border-width) * 2)`,
        borderWidth: `var(--wire-border-width)`,
        borderRadius: `var(--wire-border-width)`,
        willChange: `left, top`,
        transition: `left .6s, top .6s`,
    },
    isImageZoom
        ? {
              left: `calc((var(--screen-width) - var(--wire-image-slider-zoom-width)) / 2 + var(--wire-image-slider-zoom-width) - var(--wire-image-name-width) - var(--wire-border-width) + 80px)`,
              top: `calc(var(--screen-height) - var(--wire-image-name-height) - var(--wire-border-width))`,
          }
        : null,
]);

const ImageNameText = styled('span')([
    tw`block text-white text-center whitespace-pre-wrap`,
    {
        lineHeight: `1.4`,
        fontFamily: `'PixelMplus12'`,
        fontSize: `24px`,
        WebkitFontSmoothing: `none`,
    },
]);

export const WireImages: React.FC = () => {
    const { label, message, images } = useContext(ImageDescriptionContext);
    const isImageZoom = useIsImageZoomValue();

    return (
        <Wrapper isImageZoom={isImageZoom}>
            <SliderOuter isImageZoom={isImageZoom}>
                {images.length > 1 ? (
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={1000}
                        spaceBetween={10}
                        loop={true}>
                        {images.map((slider, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <SliderImage src={slider} alt="" />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <SliderImage src={images[0]} alt="" />
                )}
            </SliderOuter>

            <ImageLabel isImageZoom={isImageZoom}>
                <ImageLabelText>{label.join('\n')}</ImageLabelText>
            </ImageLabel>

            <ImageName isImageZoom={isImageZoom}>
                <ImageNameText>{message.join('\n')}</ImageNameText>
            </ImageName>
        </Wrapper>
    );
};
