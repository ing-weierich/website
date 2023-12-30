import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    color: ${({ theme }) => theme.colors.white};
`;

export const Inner = styled.div`
    padding: 40px 20px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        padding: 50px 0;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
        display: flex;
    }
`;

export const Content = styled.div`
    margin-bottom: 40px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        width: 50%;
        padding-right: 54px;
    }
`;

export const Headline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 700;
    font-size: 24px;
    line-height: 48px;
    text-transform: uppercase;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        font-size: 48px;
        line-height: 80px;
    }
`;

export const Subheadline = styled.div`
    font-family: ${({ theme }) => theme.fonts.headlines};
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    text-transform: uppercase;
    margin-top: 20px;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        margin-top: 40px;
        font-size: 24px;
        line-height: 40px;
    }
`;

export const LogoContainer = styled.div`
    display: none;

    ${({ theme }) => theme.breakpoints.up('xl')} {
        display: block;
        position: absolute;
        opacity: 0.11;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }
`;

export const Logo = styled.img`
    transform: translate(-30px, 50px);
    width: 100%;
    height: auto;
    display: block;
`;

export const ImageContainer = styled.div`
    ${({ theme }) => theme.breakpoints.up('xl')} {
        width: 50%;
        padding-left: 54px;
        transform: translateY(150px);
    }
`;
