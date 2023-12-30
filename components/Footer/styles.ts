import link from 'next/link';
import styled from 'styled-components';

export const Container = styled.footer``;

export const TopContainer = styled.div`
    padding: 80px 24px;
    background-color: ${({ theme }) => theme.colors.blue};
    color: ${({ theme }) => theme.colors.white};
    position: relative;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding: 120px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
`;

export const TopContainerInside = styled.div`
    ${({ theme }) => theme.breakpoints.up('xl')} {
        display: flex;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
    }
`;

export const Box = styled.div`
    ${({ theme }) => theme.breakpoints.up('xl')} {
        display: flex;
        flex-wrap: wrap;
    }
`;

export const Headline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-size: 24px;
    line-height: 38px;
    text-transform: uppercase;
    margin-bottom: 40px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        line-height: 48px;
    }
`;

export const Text = styled.div`
    font-size: 20px;
    line-height: 28px;
`;

export const Link = styled.a`
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    display: flex;
    margin-bottom: 20px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        margin-right: 34px;
    }
`;

export const Icon = styled.img`
    margin-right: 18px;
    width: 25px;
    height: auto;
`;

export const Data = styled.div`
    font-size: 18px;
`;

export const Fish = styled.img`
    display: none;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
    }
`;

export const BottomContainer = styled.div`
    padding: 40px 24px;
    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        flex-direction: inherit;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
        justify-content: space-between;
        align-items: flex-end;
    }
`;

export const CopyrightContainer = styled.div`
    order: 2;
    width: 100%;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        order: 1;
        width: auto;
    }
`;

export const Copyright = styled.div`
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    text-transform: uppercase;
    margin-bottom: 10px;
`;

export const Navigation = styled.div`
    order: 1;
    width: 100%;
    margin-bottom: 40px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        order: 2;
        width: auto;
        margin-bottom: 0;
        display: flex;
    }
`;

export const NavigationItem = styled(link)``;

export const NavigationValue = styled.div`
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    text-transform: uppercase;
    margin-bottom: 10px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        margin-left: 40px;
    }

    &:first-child {
        margin-left: 0;
    }
`;

export const Logo = styled.img`
    display: none;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        display: block;
        margin-bottom: 40px;
    }
`;
