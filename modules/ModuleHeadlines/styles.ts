import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const Container = styled.div`
    text-align: center;
`;

export const Inner = styled.div`
    padding: 40px 20px;

    ${up('xl')} {
        padding: 50px 0;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
    }
`;

export const Headline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 400;
    font-size: 24px;
    line-height: 48px;
    text-transform: uppercase;

    ${up('xl')} {
        font-size: 48px;
        line-height: 80px;
    }
`;

export const Subheadline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 700;
    font-size: 18px;
    line-height: 28px;
    text-transform: uppercase;
    margin-top: 20px;

    ${up('xl')} {
        margin-top: 40px;
        font-size: 24px;
        line-height: 40px;
    }
`;
