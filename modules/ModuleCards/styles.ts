import styled from 'styled-components';

export const Container = styled.div``;

export const Inner = styled.div`
    padding: 40px 20px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding: 50px 0;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
    }
`;

export const Headline = styled.div`
    font-weight: 700;
    font-size: 20px;
    line-height: 36px;
    margin-bottom: 20px;
    font-family: ${({ theme }) => theme.fonts.headlines};

    ${({ theme }) => theme.breakpoints.up('xl')} {
        font-size: 24px;
        line-height: 40px;
    }
`;

export const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
`;

export const ImageContainer = styled.div``;

export const Box = styled.div`
    padding: 40px 20px;
    height: 100%;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding: 40px;
    }
`;

export const Text = styled.div`
    font-size: 18px;
    line-height: 26px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        font-size: 20px;
        line-height: 24px;
    }

    ul {
        list-style: square;
        margin-left: 15px;
    }
`;
