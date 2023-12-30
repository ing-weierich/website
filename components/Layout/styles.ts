import styled from 'styled-components';

export const Container = styled.div`
    padding-top: 122px;
    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding-top: 136px;
    }
`;
