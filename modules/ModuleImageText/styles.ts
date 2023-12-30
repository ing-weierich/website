import styled from 'styled-components';
import ImageComponent from 'next/image';

export const Container = styled.div``;

export const Inner = styled.div`
    padding: 40px 20px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding: 50px 0 193px 0;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
    }
`;

export const ImageContainer = styled.div`
    position: relative;
`;

export const Image = styled(ImageComponent)``;

export const Headline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 700;
    font-size: 24px;
    line-height: 40px;
    text-transform: uppercase;
    margin-bottom: 20px;
`;

export const Text = styled.div`
    margin-top: 20px;

    p {
        margin-bottom: 20px;
    }

    ${({ theme }) => theme.breakpoints.up('xl')} {
        background-color: ${({ theme }) => theme.colors.white};
        position: absolute;
        bottom: -143px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 216px);
        padding: 80px;
    }
`;
