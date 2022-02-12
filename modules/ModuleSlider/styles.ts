import styled from 'styled-components';
import NextImage from 'next/image';
import { up } from 'styled-breakpoints';

export const Container = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
`;

export const Image = styled(NextImage)`
    object-fit: cover;
`;

export const ImageContainer = styled.div`
    width: 100%;
    height: 400px;

    ${up('xl')} {
        height: 800px;
    }
`;

export const Icon = styled.img`
    width: 40px;
    height: auto;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    ${up('xl')} {
        width: 50px;
    }
`;

export const Next = styled.div`
    background-color: rgba(1, 16, 25, 0.61);
    width: 120px;
    height: 120px;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    right: -40px;
    z-index: 9;
    transform: translateY(-50%);
    cursor: pointer;

    ${Icon} {
        left: 20px;
    }

    ${up('xl')} {
        width: 240px;
        height: 240px;
        right: -120px;

        ${Icon} {
            left: 50px;
        }
    }
`;

export const Prev = styled.div`
    background-color: rgba(1, 16, 25, 0.61);
    width: 120px;
    height: 120px;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: -40px;
    z-index: 9;
    transform: translateY(-50%);
    cursor: pointer;

    ${Icon} {
        right: 20px;
    }

    ${up('xl')} {
        width: 240px;
        height: 240px;
        left: -120px;

        ${Icon} {
            right: 50px;
        }
    }
`;
