import styled from 'styled-components';

export const Container = styled.div<{ greyBackground: boolean }>`
    background-color: ${({ greyBackground, theme }) => (greyBackground ? theme.colors.grey : theme.colors.white)};
`;
