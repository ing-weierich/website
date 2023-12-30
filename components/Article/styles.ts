import styled from 'styled-components';

export const Container = styled.div<{ noPadding: boolean; color: string }>`
    padding-top: ${({ noPadding }) => (noPadding ? 0 : 20)}px;
    padding-bottom: ${({ noPadding }) => (noPadding ? 0 : 20)}px;

    background-color: ${({ color, theme }) => (color ? color : theme.colors.grey)};

    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding-top: ${({ noPadding }) => (noPadding ? 0 : 50)}px;
        padding-bottom: ${({ noPadding }) => (noPadding ? 0 : 50)}px;
    }
`;
