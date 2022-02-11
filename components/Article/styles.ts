import { up } from 'styled-breakpoints';
import styled from 'styled-components';

export const Container = styled.div<{ whiteBackground: boolean }>`
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: ${({ whiteBackground, theme }) => (whiteBackground ? theme.colors.white : theme.colors.grey)};

    ${up('xl')} {
        padding-top: 50px;
        padding-bottom: 50px;
    }
`;
