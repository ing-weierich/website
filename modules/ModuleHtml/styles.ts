import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const Container = styled.div`
    padding: 80px 24px;
    p,
    li {
        font-size: 20px;
        line-height: 32px;
    }
    ul {
        list-style-position: inside;
    }
    p,
    ul {
        margin-bottom: 20px;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-size: 30px;
        line-height: 38px;
        margin-bottom: 40px;
    }
    a,
    p a {
        color: ${({ theme }) => theme.colors.black};
    }
    ${up('xl')} {
        padding: 120px 0;
        width: ${({ theme }) => theme.maxWidth}px;
        margin: 0 auto;
    }
`;
