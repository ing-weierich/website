import { up } from 'styled-breakpoints';
import styled from 'styled-components';

export const Container = styled.div<{ greyBackground: boolean }>`
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: ${({ greyBackground, theme }) => (greyBackground ? theme.colors.grey : theme.colors.white)};

    ${up('xl')} {
        padding-top: 50px;
        padding-bottom: 50px;
    }
`;
