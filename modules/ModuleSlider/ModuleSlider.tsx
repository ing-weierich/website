// Import Swiper React components
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as Styled from './styles';

// Import Swiper styles
import 'swiper/css';

const Slider = ({ ...props }) => {
    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    const images = props?.moduleSlider?.imagesCollection?.items;

    if (images.length < 1) {
        return null;
    }

    return (
        <Styled.Container>
            <Styled.Prev onClick={() => swiperInstance.slidePrev()}>
                <Styled.Icon src='/arrow_back_white.svg' />
            </Styled.Prev>
            <Styled.Next onClick={() => swiperInstance.slideNext()}>
                <Styled.Icon src='/arrow_forward_white.svg' />
            </Styled.Next>
            <Swiper slidesPerView={1} onSwiper={(swiper) => setSwiperInstance(swiper)} loop>
                {images.map((image: any) => {
                    return (
                        <SwiperSlide key={image.url}>
                            <Styled.ImageContainer>
                                <Styled.Image priority layout='fill' src={image.url} alt={image.title} />
                            </Styled.ImageContainer>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Styled.Container>
    );
};

export default Slider;
