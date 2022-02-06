import styled from 'styled-components';
import LinkComponent from 'next/link';

export const Button = styled(LinkComponent)``;

export const Link = styled.a`
    display: inline-block;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.blue};
    height: 53px;
    line-height: 53px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: 600;
`;

export const Label = styled.div``;
