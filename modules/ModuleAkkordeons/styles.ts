import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const Container = styled.div``;

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
    font-weight: 700;
    font-size: 24px;
    line-height: 48px;
    text-transform: uppercase;
    margin-bottom: 20px;
`;

export const Accordion = styled.div`
    margin-bottom: 1px;
    background-color: ${({ theme }) => theme.colors.white};
`;

export const Head = styled.div`
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
`;

export const Label = styled.div`
    font-size: 20px;
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 700;
`;

export const Icon = styled.img<{ isOpen: boolean }>`
    transform: rotate(${({ isOpen }) => (isOpen ? '0' : '180deg')});
`;

export const Content = styled.div<{ isOpen: boolean }>`
    padding: 40px 20px;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

    ul {
        margin-left: 15px;
        list-style: square;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
        margin-bottom: 20px;
    }
`;
