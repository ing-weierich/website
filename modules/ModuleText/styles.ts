import styled from 'styled-components';
import ButtonComponent from '@nextful/components/Button';
import { up } from 'styled-breakpoints';

export const Container = styled.div``;

export const Inner = styled.div`
    padding: 40px 20px;

    ${up('xl')} {
        padding: 100px 0;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
        display: flex;
    }
`;

export const Box = styled.div`
    flex: 1;

    &:first-child {
        padding-right: 40px;
    }

    &:last-child {
        padding-left: 40px;
    }
`;

export const Topline = styled.div`
    color: rgba(2, 50, 77, 0.6);
    font-weight: 700;
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 16px;
`;

export const Button = styled(ButtonComponent)`
    margin-bottom: 20px;
`;

export const Headline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 700;
    font-size: 36px;
    line-height: 64px;
    text-transform: uppercase;
    margin-bottom: 20px;

    ${up('xl')} {
        margin-bottom: 40px;
    }
`;

export const Text = styled.div`
    p {
        margin-bottom: 20px;
    }
`;
